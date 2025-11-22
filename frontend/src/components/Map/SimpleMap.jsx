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
  selectedTrackingId,        // Thêm prop này để reset xe khi đổi lịch trình
  onArriveAtStop,            // Callback khi xe đến điểm dừng (tùy chọn)
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const busMarkerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Vị trí xe buýt hiện tại (giả lập)
  const [busPosition, setBusPosition] = useState(null);
  const routeCoordinates = useRef([]); // Lưu toàn bộ tọa độ tuyến đường từ OSRM

  // Icon xe buýt cố định (không xoay hướng)
  const busIcon = L.divIcon({
    html: `
      <div style="
        background: #3b82f6; color: white; width: 40px; height: 40px;
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

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current) return;

    if (abortControllerRef.current) { // Hủy request nếu có
      abortControllerRef.current.abort();
    }

    const controller = new AbortController(); // Tạo request
    abortControllerRef.current = controller;

    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();
    if (busMarkerRef.current) {
      mapInstanceRef.current.removeLayer(busMarkerRef.current);
      busMarkerRef.current = null;
    }
    setBusPosition(null);
    routeCoordinates.current = [];

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

    // Gọi OSRM để lấy đường đi thực tế
    const toaDoTuDauDenDich = markers.map(m => `${m.kinhdo},${m.vido}`).join(";");
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${toaDoTuDauDenDich}?overview=full&geometries=geojson`;

    fetch(osrmUrl, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error("Lỗi chuyển đổi ở SimpleMap");
        return r.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;

        if (data.routes && data.routes[0]) {
          const route = data.routes[0].geometry;
          routeCoordinates.current = route.coordinates.map(coord => [coord[1], coord[0]]); // [lat, lng]

          // Vẽ đường đi
          L.geoJSON(route, {
            style: {
              color: "#1d4ed8",
              weight: 6,
              opacity: 0.9,
            },
          }).addTo(routeLayerRef.current);

          // BẮT ĐẦU GIẢ LẬP XE CHẠY TỪ ĐÂY
          let index = 0;
          const totalPoints = routeCoordinates.current.length;
          const speedKmh = 50; // Tốc độ giả lập: 50 km/h
          const msPerPoint = 100; // Càng nhỏ càng mượt (50-150 là đẹp)

          const moveBus = () => {
            if (index >= totalPoints) {
              clearInterval(timer);
              return;
            }

            const [lat, lng] = routeCoordinates.current[index];
            setBusPosition({ lat, lng });

            // Kiểm tra xe đã gần điểm dừng chưa (khoảng 50m)
            markers.forEach((stop) => {
              const distance = mapInstanceRef.current.distance(
                [lat, lng],
                [stop.vido, stop.kinhdo]
              );
              if (distance < 50 && stop.trangthai !== 1) {
                onArriveAtStop?.(stop.malt, stop.thutu, stop.tendiemdung, stop.matd, stop.madd);
              }
            });

            index += Math.max(1, Math.floor(speedKmh / 50)); // Tăng tốc độ điểm nhảy
          };

          const timer = setInterval(moveBus, msPerPoint);
          moveBus(); // Chạy ngay lập tức frame đầu

          // Cleanup khi đổi lịch trình
          return () => clearInterval(timer);
        }
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        console.error("OSRM lỗi vẽ đường thẳng thay thế", err);
        const latlngs = markers.map(m => [m.vido, m.kinhdo]);
        L.polyline(latlngs, {
          color: "#64748b",
          weight: 5,
          dashArray: "10, 10",
          opacity: 0.7,
        }).addTo(routeLayerRef.current);
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [markers, selectedTrackingId]); // selectedTrackingId để reset khi đổi chuyến

  // Di chuyển marker xe buýt theo vị trí giả lập
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