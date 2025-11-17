import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Leaflet with bundlers
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// });

export default function StopMap({ latitude, longitude, onMapClick, stopName }) {
  const mapRef = useRef(null); // là DOM <div> để khởi tạo map
  const mapInstanceRef = useRef(null); // Lưu instance không bị render lại
  const markerRef = useRef(null); // Lưu marker hiện tại

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Tạo instance Leaflet và cho tọa độ set ở trung tâm
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 13);
      // L.map(mapRef.current) nhận thẻ từ mapref.current và vẽ lên đó
      // Hiển thị bản đồ nền
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      if (onMapClick) { // Nếu hàm này được truyền vào
        mapInstanceRef.current.on('click', (e) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    if (mapInstanceRef.current) { // Kiểm tra đã khởi tạo leaflet chưa
      if (markerRef.current) { // nếu đã có marker thì xóa cái hiện tại
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      if (!isNaN(latitude) && !isNaN(longitude)) {       // Kiểm tra tọa độ
        markerRef.current = L.marker([latitude, longitude])
          .addTo(mapInstanceRef.current) // Thêm marker vào bản đồ
          .bindPopup(stopName || 'Điểm dừng') // Hiển thị tên popup
          .openPopup(); // Tự động thêm popup khi thêm marker

        // đi chuyển bản đồ khi có marker mới
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      }
    }
  }, [latitude, longitude, stopName, onMapClick]);

  useEffect(() => { // Được gọi khi hủy component
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg"
      style={{ minHeight: '384px' }}
    />
  );
}
