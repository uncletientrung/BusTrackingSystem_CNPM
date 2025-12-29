import { useEffect, useRef, useState } from "react";
import busImg from '../../assets/bus.png'
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
  selectedTrackingId,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const busMarkerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const moveTimerRef = useRef(null); // timer di chuyển xe
  const LichTrinhCuId = useRef(null);
  const [busPosition, setBusPosition] = useState(null);
  const fullRouteCoordinates = useRef([]);
  const allowedCoordinates = useRef([])
  const currentIndex = useRef(0);

  const busIcon = L.icon({
    iconUrl: busImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 38],
  });

  const viTriXacNhanCuoi = () => {
    let DDXacNhanCuoi = -1;
    let index = -1;
    markers.forEach((m, i) => {
      if (m.trangthai === 1 && m.thutu > DDXacNhanCuoi) {
        DDXacNhanCuoi = m.thutu;
        index = i;
      }
    });
    return index;
  };

  const updateAllowedRoute = async () => {
    if (markers.length === 0) return;
    const dDXNCuoiIndex = viTriXacNhanCuoi();
    const dDTiepTheoIndex = dDXNCuoiIndex + 1;
    if (dDXNCuoiIndex === -1) {
      const first = markers[0];
      allowedCoordinates.current = [[first.vido, first.kinhdo]];
      currentIndex.current = 0;
      setBusPosition({ lat: first.vido, lng: first.kinhdo });
      return;
    }
    if (dDTiepTheoIndex >= markers.length) {
      const last = markers[markers.length - 1];
      setBusPosition({ lat: last.vido, lng: last.kinhdo });
      return;
    }

    const batdau = markers[dDXNCuoiIndex];
    const toaDoMarkerTiepTheo = markers[dDTiepTheoIndex];
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${batdau.kinhdo},${batdau.vido};${toaDoMarkerTiepTheo.kinhdo},${toaDoMarkerTiepTheo.vido}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes?.[0]?.geometry?.coordinates) {
        const toaDo_VidoKinhDo = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        const boQuaToaDoLap = toaDo_VidoKinhDo.slice(1)
        allowedCoordinates.current = [...allowedCoordinates.current, ...boQuaToaDoLap];
        startBusMoving();
      }
    } catch (err) {
      console.error("Lỗi OSRM đoạn mới:", err);
      allowedCoordinates.current.push([toaDoMarkerTiepTheo.vido, toaDoMarkerTiepTheo.kinhdo]);
      startBusMoving();
    } 
  };

  const startBusMoving = () => {
    if (moveTimerRef.current) clearInterval(moveTimerRef.current); // Nếu đang chạy thì xóa chạy mới
    const geometry_toaDo = allowedCoordinates.current;
    if (geometry_toaDo.length === 0) return;
    let i = currentIndex.current;
    moveTimerRef.current = setInterval(() => {
      if (i >= geometry_toaDo.length - 1) {
        clearInterval(moveTimerRef.current);
        moveTimerRef.current = null;
        const toaDoCuoi = geometry_toaDo[geometry_toaDo.length - 1];
        setBusPosition({ lat: toaDoCuoi[0], lng: toaDoCuoi[1] });
        currentIndex.current = geometry_toaDo.length - 1;
        return;
      }
      i++;
      currentIndex.current = i;
      const [lat, lng] = geometry_toaDo[i];
      setBusPosition({ lat, lng });
    }, 100);
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

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routeLayerRef.current) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const isNewSchedule = LichTrinhCuId.current !== selectedTrackingId;
    if (isNewSchedule) { // Nếu là LT mới
      setBusPosition(null);
      allowedCoordinates.current = [];
      currentIndex.current = 0;
      fullRouteCoordinates.current = [];
      if (busMarkerRef.current) {
        mapInstanceRef.current.removeLayer(busMarkerRef.current);
        busMarkerRef.current = null;
      }
    }
    LichTrinhCuId.current = selectedTrackingId;

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

    if (markers.length >= 2) {
      const toaDoDayDu = markers.map(m => `${m.kinhdo},${m.vido}`).join(";");
      fetch(`https://router.project-osrm.org/route/v1/driving/${toaDoDayDu}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data.routes?.[0]) {
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            fullRouteCoordinates.current = coords;
            L.geoJSON(data.routes[0].geometry, {
              style: { color: "#1d4ed8", weight: 6, opacity: 0.9 },
            }).addTo(routeLayerRef.current);
          }
        })
        .catch(() => {
          const latlngs = markers.map(m => [m.vido, m.kinhdo]);
          L.polyline(latlngs, { color: "#64748b", weight: 5, dashArray: "10, 10" })
            .addTo(routeLayerRef.current);
        });
    }
    updateAllowedRoute();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    };
  }, [markers, selectedTrackingId]);

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