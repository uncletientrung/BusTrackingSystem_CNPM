import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({
  center = [10.8231, 106.6297], //Tọa độ trung tâm HCM
  zoom = 13,
  markers = [], // danh sách Marker
  onMapClick, // callback khi click bản đồ.
  className = "h-96"
}) => {
  const mapRef = useRef(null);  // div DOM để render bản đồ (mục đích để lưu giá trị khi render lại)
  const mapInstance = useRef(null); // instance của Leaflet map
  const markersLayer = useRef(null); // layer group chứa tất cả markers

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) { // Kiểm tra đã tồn tại mapref và chưa có bản đồ để tránh tạo nhiều
      // Tạo bản đồ bằng L, gắn vào div mà mapRef trỏ tới.
      // Đặt vị trí trung tâm (center) và mức phóng (zoom)
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      // Thêm lớp bản đồ nền từ OpenStreetMap.
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // Tạo một LayerGroup để chứa các marker (có thể thêm/xóa toàn bộ marker trong nhóm này)
      markersLayer.current = L.layerGroup().addTo(mapInstance.current);

      // Handle map click
      if (onMapClick) {
        mapInstance.current.on('click', (e) => {
          onMapClick(e.latlng); // Trả về tọa đọ được Click
        });
      }
    }

    return () => { // Nếu component bị hủy nó xóa map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers khi markers trong danh sách thay đổi
  useEffect(() => {
    if (markersLayer.current) {
      markersLayer.current.clearLayers(); // Xóa hết marker cũ

      markers.forEach((marker) => { // Duyệt qua mảng markers để tạo marker mới
        const { lat, lng, title, popup } = marker;
        const leafletMarker = L.marker([lat, lng]); // Tạo 1 marker tại vị trí (lat, lng)

        if (title || popup) { // Nếu có title hoặc popup thì gắn popup hiển thị khi click marker
          leafletMarker.bindPopup(popup || title);
        }

        leafletMarker.addTo(markersLayer.current); // Thêm marker này vào layerGroup
      });
    }
  }, [markers]);

  // Render mỗi khi đổi tọa độ center hoặc zoom
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div
      ref={mapRef} // khởi tạo bản đồ
      className={`w-full ${className} border rounded-lg shadow-md`}
    />
  );
};

export default Map;