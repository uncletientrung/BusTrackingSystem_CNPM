import { useEffect, useRef } from "react";

export default function SimpleMap({
  center = [10.8231, 106.6297], // mặc định là toạ độ TP.HCM.
  zoom = 13, // mức phóng to mặc định.
  markers = [], // <mảng Marker> truyền bên TrackingPage
  onMapClick, // callback khi click lên bản đồ
  className = "h-96" }) {
  const mapRef = useRef(null);  // Dùng để lưu DOM element (container) cho Leaflet 
  const mapInstance = useRef(null); // Dùng để lưu instance của Leaflet map
  // Lý do dùng useRef: giữ giá trị qua các lần render mà không gây render lại component

  useEffect(() => { // Hàm khởi tạo map render 1 lần
    const loadLeaflet = async () => { // Nạp tài nguyên Leaflet
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) { // Kiểm tra có thẻ Link leaflet chưa
        const cssLink = document.createElement('link'); // Nếu chưa thì tạo 
        cssLink.rel = 'stylesheet'; // Gán thuộc tính rel="stylesheet", nó là một stylesheet (CSS).
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; // Đường dẫn file css leaflet
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='; // mã hash của leaflet
        cssLink.crossOrigin = ''; // Cho phép dùng SRI khi tải tài nguyên từ domain khác
        document.head.appendChild(cssLink); // gán cái này vào <head>
      }

      // Load Leaflet JS
      if (!window.L) { // window.L chính là object toàn cục của Leaflet
        const script = document.createElement('script'); // Tạo js mới vào trong DOM
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; // Đường dẫn file js
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='; // Chuỗi SRI, đảm bảo file tải về khớp hash
        script.crossOrigin = ''; // Cho phép kiểm tra SRI với file tải từ domain khác.

        script.onload = () => { // Load xong thì gọi hàm initializeMap()
          initializeMap();
        };
        document.head.appendChild(script); // Thêm vào <head>
      } else {
        initializeMap(); //Nếu đã có thì gọi thôi
      }
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !mapInstance.current) {
        try {
          // Initialize map
          mapInstance.current = window.L.map(mapRef.current).setView(center, zoom);

          // Add OpenStreetMap tiles
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(mapInstance.current);

          // Add markers if any
          markers.forEach((marker) => {
            const leafletMarker = window.L.marker([marker.lat, marker.lng]);
            if (marker.popup || marker.title) { 
              leafletMarker.bindPopup(marker.popup || marker.title); // hiển thị khi bấm vào Marker
            }
            leafletMarker.addTo(mapInstance.current); // Thêm market vào bản đồ
          });

          // Handle map click
          if (onMapClick) {
            mapInstance.current.on('click', (e) => {
              onMapClick(e.latlng); // gọi callBack trả về tọa độ Click
            });
          }

        } catch (error) { // Hiển thị đang tải bản đồ
          console.error('Error initializing map:', error);
          // Show fallback message
          if (mapRef.current) {
            mapRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg">
                <div class="text-center">
                  <div class="text-4xl mb-2">🗺️</div>
                  <p class="text-blue-600 font-semibold">Bản đồ tuyến xe buýt</p>
                  <p class="text-blue-500 text-sm mt-1">Đang tải bản đồ...</p>
                  <div class="mt-4 space-y-2">
                    ${markers.map((marker, index) =>
              `<div class="bg-white px-3 py-2 rounded shadow text-sm">
                        📍 ${marker.title || `Điểm ${index + 1}`}
                      </div>`
            ).join('')}
                  </div>
                </div>
              </div>
            `;
          }
        }
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
          mapInstance.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (mapInstance.current && window.L) {
      try {
        // Clear existing markers
        mapInstance.current.eachLayer((layer) => {
          if (layer instanceof window.L.Marker) {
            mapInstance.current.removeLayer(layer);
          }
        });

        // Add new markers
        markers.forEach((marker) => {
          const leafletMarker = window.L.marker([marker.lat, marker.lng]);
          if (marker.popup || marker.title) {
            leafletMarker.bindPopup(marker.popup || marker.title);
          }
          leafletMarker.addTo(mapInstance.current);
        });
      } catch (error) {
        console.error('Error updating markers:', error);
      }
    }
  }, [markers]);

  return (
    <>
      <div
        ref={mapRef}
        className={`w-full ${className} border rounded-lg shadow-md bg-gray-100`}
        style={{ minHeight: '300px' }}
      />
    </>
  )
};