import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function SimpleMap({
  center = [10.8231, 106.6297],
  zoom = 13,
  markers = [],
  className = "h-96",
  selectedTrackingId, // Thêm prop này để reset xe khi đổi lịch trình
  onArriveAtStop, // Callback khi xe đến điểm dừng (tùy chọn)
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const busMarkerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const moveTimerRef = useRef(null); // Timer di chuyển xe

  // Vị trí xe buýt hiện tại (giả lập)
  const [busPosition, setBusPosition] = useState(null);
  const fullRouteCoordinates = useRef([]); // Lưu toàn bộ tọa độ tuyến đường (để vẽ đầy đủ)
  const allowedCoordinates = useRef([]); // Chỉ những tọa độ xe được phép chạy đến (đến điểm đã xác nhận)

  // Icon xe buýt cố định (không xoay hướng)
  const busIcon = L.divIcon({
    html: `
      <div style="
        background: #3b82f6; color: white; width: AbortController40px; height: 40px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-weight: bold; font-size: 16px; border: 4px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      ">
        BUS
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Hàm tính đoạn đường xe được phép chạy (từ đầu đến điểm đã xác nhận cuối cùng + điểm kế tiếp nếu đang chạy)
  const updateAllowedRoute = async () => {
    if (markers.length === 0) return;

    // Tìm điểm đã xác nhận cuối cùng
    const lastConfirmedIndex = markers.slice().reverse().findIndex(m => m.trangthai === 1);
    const lastConfirmedRealIndex = lastConfirmedIndex >= 0 ? markers.length - 1 - lastConfirmedIndex : -1;

    // Nếu chưa có điểm nào xác nhận → xe đứng ở điểm đầu
    if (lastConfirmedRealIndex === -1) {
      const first = markers[0];
      setBusPosition({ lat: first.vido, lng: first.kinhdo });
      allowedCoordinates.current = [[first.vido, first.kinhdo]];
      return;
    }

    // Xe được chạy đến điểm kế tiếp sau điểm đã xác nhận cuối cùng
    const nextStopIndex = lastConfirmedRealIndex + 1;
    if (nextStopIndex >= markers.length) {
      // Đã xác nhận hết → xe dừng ở điểm cuối
      const last = markers[markers.length - 1];
      setBusPosition({ lat: last.vido, lng: last.kinhdo });
      return;
    }

    // Lấy tọa độ từ đầu đến điểm kế tiếp (để chạy mượt)
    const stopsUpToNext = markers.slice(0, nextStopIndex + 1);
    const coordsStr = stopsUpToNext.map(m => `${m.kinhdo},${m.vido}`).join(";");

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`,
        { signal: abortControllerRef.current?.signal }
      );
      const data = await response.json();

      if (data.routes?.[0]) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        allowedCoordinates.current = coords;
        // Bắt đầu chạy xe trên đoạn được phép
        startBusMoving();
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("OSRM lỗi đoạn cho phép:", err);
    }
  };

  // Hàm bắt đầu chạy xe trên đoạn được phép
  const startBusMoving = () => {
    if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    const coords = allowedCoordinates.current;
    if (coords.length === 0) return;

    let i = 0;
    moveTimerRef.current = setInterval(() => {
      if (i >= coords.length) {
        clearInterval(moveTimerRef.current);
        const last = coords[coords.length - 1];
        setBusPosition({ lat: last[0], lng: last[1] });
        return;
      }
      const [lat, lng] = coords[i];
      setBusPosition({ lat, lng });
      i += 2; // Tốc độ nhanh chậm tùy chỉnh ở đây
    }, 80);
  };

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      routeLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Khi markers hoặc selectedTrackingId thay đổi → vẽ lại toàn bộ
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current) return;

    // Hủy request cũ nếu có
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Xóa cũ
    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();
    if (busMarkerRef.current) {
      mapInstanceRef.current.removeLayer(busMarkerRef.current);
      busMarkerRef.current = null;
    }
    setBusPosition(null);
    fullRouteCoordinates.current = [];
    allowedCoordinates.current = [];

    // Vẽ lại marker
    markers.forEach((marker) => {
      const isConfirmed = marker.trangthai === 1;
      const iconHtml = `
        <div style="
          background: ${isConfirmed ? '#10b981' : '#f59e0b'};
          color: white;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        ">
          ${marker.thutu}
        </div>
      `;
      const icon = L.divIcon({
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -10],
        className: "",
      });
      L.marker([marker.vido, marker.kinhdo], { icon })
        .bindPopup(marker.popup, { minWidth: 240 })
        .addTo(markersLayerRef.current);
    });

    if (markers.length < 2) return;

    // VẼ ĐẦY ĐỦ TUYẾN ĐƯỜNG TỪ ĐẦU ĐẾN CUỐI (luôn luôn)
    const fullCoordsStr = markers.map(m => `${m.kinhdo},${m.vido}`).join(";");
    const fullUrl = `https://router.project-osrm.org/route/v1/driving/${fullCoordsStr}?overview=full&geometries=geojson`;

    const fetchFullRoute = async () => {
      try {
        const response = await fetch(fullUrl, { signal: controller.signal });
        const data = await response.json();

        if (controller.signal.aborted || !data.routes?.[0]) return;

        fullRouteCoordinates.current = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

        L.geoJSON(data.routes[0].geometry, {
          style: { color: "#1d4ed8", weight: 6, opacity: 0.9 },
        }).addTo(routeLayerRef.current);

        // Sau khi vẽ xong toàn bộ tuyến → tính đoạn xe được phép chạy
        await updateAllowedRoute();
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("OSRM lỗi, vẽ đường thẳng");
        const latlngs = markers.map(m => [m.vido, m.kinhdo]);
        L.polyline(latlngs, { color: "#64748b", weight: 5, dashArray: "10, 10" }).addTo(routeLayerRef.current);
      }
    };

    fetchFullRoute();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    };
  }, [markers, selectedTrackingId]); // Khi markers thay đổi (do bấm xác nhận) → xe chạy tiếp

  // Cập nhật vị trí icon xe
  useEffect(() => {
    if (!mapInstanceRef.current || !busPosition) return;

    if (busMarkerRef.current) {
      busMarkerRef.current.setLatLng([busPosition.lat, busPosition.lng]);
    } else {
      busMarkerRef.current = L.marker([busPosition.lat, busPosition.lng], {
        icon: busIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);
    }
  }, [busPosition]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-xl shadow-lg border border-gray-200 ${className}`}
      style={{ minHeight: "600px" }}
    />
  );
}