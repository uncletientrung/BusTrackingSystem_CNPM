import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const abortControllerRef = useRef(null);

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
    // trước khi join thì trả về mảng kinh độ vĩ độ ['106.629700,10.823100', '106.685000,10.789000']
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${toaDoTuDauDenDich}?overview=full&geometries=geojson`;

    fetch(osrmUrl, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error("Lỗi chuyển đổi ở SimpleMap");
        return r.json();
      })
      .then(data => {
        // Nếu request đã bị hủy (do đổi lịch trình) → bỏ qua
        if (controller.signal.aborted) return;

        if (data.routes && data.routes[0]) {
          const route = data.routes[0].geometry; // Tuyến tốt nhất
          // console.log(data.routes[0].geometry); // trả về geoJSON LineString
          L.geoJSON(route, {
            style: {
              color: "#1d4ed8",
              weight: 6,
              opacity: 0.9,
            },
          }).addTo(routeLayerRef.current);
        }
      })
      .catch(err => {
        // Nếu bị hủy do abort thì ngắt
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
  }, [markers]); 

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-xl shadow-lg border border-gray-200 ${className}`}
      style={{ minHeight: "600px" }}
    />
  );
}