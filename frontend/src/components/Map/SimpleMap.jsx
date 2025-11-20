import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon mặc định của Leaflet khi dùng với React/Vite
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

  // Khởi tạo bản đồ chỉ một lần
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Tạo layer group cho marker và tuyến đường
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
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current || markers.length === 0) return;

    // Xóa lớp cũ
    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();
    markers.forEach((m) => { // Vẽ các marker điểm dừng
      const isConfirmed = m.trangthai === 1;

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
          ${m.thutu}
        </div>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -10],
      });

      L.marker([m.vido, m.kinhdo], { icon })
        .bindPopup(m.popup || m.title || `Điểm ${m.thutu}`, { minWidth: 240 })
        .addTo(markersLayerRef.current);
    });

    // Gọi OSRM để lấy đường đi thực tế
    const coordinates = markers.map(m => `${m.kinhdo},${m.vido}`).join(";");
    // trước khi join thì trả  1 mảng kinh độ vĩ độ ['106.629700,10.823100', '106.685000,10.789000']
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    
    fetch(osrmUrl)
      .then(r => r.json()) //parse JSON trả về từ OSRM.
      .then(data => {
        if (data.routes && data.routes[0]) {
          const route = data.routes[0].geometry; // Tuyến tốt nhất
          // console.log(data.routes[0].geometry); // trả về mảng tọa độ hình học (geoJSON) của tọa bắt đầu đến kết thúc và type : "LineString"
          L.geoJSON(route, { // Vẽ
            style: {
              color: "#1d4ed8",
              weight: 6,
              opacity: 0.9,
            },
          }).addTo(routeLayerRef.current);
        }
      })
      .catch(err => {
        console.warn("OSRM lỗi, vẽ đường thẳng thay thế", err);
        const latlngs = markers.map(m => [m.vido, m.kinhdo]); // Nếu có lỗi thì nối thẳng
        L.polyline(latlngs, {
          color: "#64748b",
          weight: 5,
          dashArray: "10, 10",
          opacity: 0.7,
        }).addTo(routeLayerRef.current);
      });
  }, [markers]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-xl shadow-lg border border-gray-200 ${className}`}
      style={{ minHeight: "600px" }}
    />
  );
}