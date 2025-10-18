import { CircleCheck, FlagTriangleRight, Hourglass, MapPin, RefreshCcw, VibrateIcon, Map } from "lucide-react";
import { useState } from "react";

export default function TrackingPage() {
  const [selectedBus, setSelectedBus] = useState(1); // Trạng thái con xe bus số id x
  const [confirmedStops, setConfirmedStops] = useState([]); // Điểm dừng và xác nhận của tài xế

  const demoBuses = [ // Giả lập dữ liệu 
    { id: 1, busNumber: 'BUS-001', route: 'Bến Thành - Sân Bay' },
    { id: 2, busNumber: 'BUS-002', route: 'Quận 1 - Quận 7' },
    { id: 3, busNumber: 'BUS-003', route: 'Thủ Đức - Quận 3' }
  ];

  const demoStops = [ // Giả lập dữ liệu điểm dừng
    { id: 1, name: 'Bến xe Bến Thành', lat: 10.8231, lng: 106.6297, confirmed: false },
    { id: 2, name: 'Chợ Tân Định', lat: 10.7890, lng: 106.6850, confirmed: true },
    { id: 3, name: 'Công viên Tao Đàn', lat: 10.7769, lng: 106.6909, confirmed: true },
    { id: 4, name: 'Sân bay Tân Sơn Nhất', lat: 10.8187, lng: 106.6519, confirmed: false }
  ];

  // Tìm thông tin xe buýt được chọn
  const selectedBusData = demoBuses.find(bus => bus.id === selectedBus);

  // Tạo markers cho các điểm dừng
  const demoMarkers = demoStops.map((stop, index) => {
    const isConfirmed = stop.confirmed || confirmedStops.includes(stop.id);
    return {
      lat: stop.lat,
      lng: stop.lng,
      title: stop.name,
      popup: `
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
          <h3 style="color: #1f2937; margin-bottom: 8px; font-weight: bold;">📍 ${stop.name}</h3>
          <p style="margin: 4px 0; color: ${isConfirmed ? '#059669' : '#d97706'}; font-weight: 600;">
            ${isConfirmed ? '✅ Xe đã đến điểm này' : '🚌 Xe đang trên đường đến'}
          </p>
          <p style="margin: 4px 0; color: #4b5563;">
            <strong>Xe buýt:</strong> ${selectedBusData?.busNumber || 'Chưa xác định'}
          </p>
          <p style="margin: 4px 0; color: #4b5563;">
            <strong>Tuyến:</strong> ${selectedBusData?.route || 'Chưa xác định'}
          </p>
        </div>
      `
    };
  });

  // Hàm handle để tài xế xác nhận điểm đến
  const confirmStop = (stopId) => {
    setConfirmedStops(prev => {
      if (!prev.includes(stopId)) {
        const stop = demoStops.find(s => s.id === stopId);
        alert(`✅ Đã xác nhận đến "${stop.name}"! Đang thông báo phụ huynh...`);
        return [...prev, stopId];
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Title và icon */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <MapPin className="text-blue-600" />
              <span>Theo dõi xe buýt</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">Giao diện tài xế - Theo dõi và xác nhận điểm đến</p>
          </div>

          {/* Ô Select xe hiện tại */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Xe hiện tại:</label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            >
              {demoBuses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber} - {bus.route}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map và các controls */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4">
        {/* Map */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              {/* Icon và title bản đồ */}
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <MapPin className="text-green-500" />
                <span>Bản đồ tuyến đường</span>
              </h3>
              {/* Tuyến xem */}
              <p className="text-sm text-gray-600 mt-1">
                Tuyến: {selectedBusData?.route} | Xe: {selectedBusData?.busNumber}
              </p>
            </div>
            <div className="flex-1 p-0">
              <Map
                center={[10.8231, 106.6297]}
                zoom={13}
                markers={demoMarkers}
                className="w-full h-full rounded-b-xl"
              />
            </div>
          </div>
        </div>

        {/* Các control */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
            {/* Header control */}
            <div className="p-4 bg-blue-600 text-white rounded-t-xl">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FlagTriangleRight className="w-5 h-5" />
                <span>Xác nhận điểm đến</span>
              </h3>
              <p className="text-sm opacity-90 mt-1">Nhấn xác nhận khi xe đã đến điểm dừng</p>
            </div>

            {/* Tiến trình điểm đến */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  {demoStops.filter(s => s.confirmed).length + confirmedStops.length}
                </span>
                <span className="text-gray-500"> / {demoStops.length}</span>
                <p className="text-sm text-gray-600">Điểm đã hoàn thành</p>
              </div>
              {/* Thanh tiến trình */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((demoStops.filter(s => s.confirmed).length + confirmedStops.length) / demoStops.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Danh sách điểm dừng */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {demoStops.map((stop, index) => {
                const isConfirmed = stop.confirmed || confirmedStops.includes(stop.id);
                return (
                  <div
                    key={stop.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isConfirmed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {/* Nút thứ tự điểm dừng */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            isConfirmed ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        {/* Tên điểm dừng */}
                        <span className="font-medium text-gray-800 text-sm">{stop.name}</span>
                      </div>
                    </div>

                    {/* Text trạng thái điểm dừng */}
                    <div className="text-xs text-gray-600 mb-3">
                      {isConfirmed ? (
                        <div className="flex items-center space-x-2">
                          <CircleCheck className="w-4 h-4 text-green-500" />
                          <span>Đã hoàn thành - Phụ huynh đã được thông báo</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Hourglass className="w-4 h-4 text-yellow-500" />
                          <span>Chờ xe đến điểm này</span>
                        </div>
                      )}
                    </div>

                    {/* Button xác nhận điểm đến */}
                    {!isConfirmed ? (
                      <button
                        onClick={() => confirmStop(stop.id)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center space-x-2"
                      >
                        <FlagTriangleRight className="w-4 h-4" />
                        <span>Xác nhận đã đến</span>
                      </button>
                    ) : (
                      <div className="text-center py-2 bg-green-100 rounded-md">
                        <span className="text-green-700 font-medium text-sm">✓ Hoàn thành</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t bg-gray-50 rounded-b-xl space-y-2">
              {/* Nút gửi phụ huynh */}
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <VibrateIcon className="w-4 h-4" />
                <span>Thông báo tất cả phụ huynh</span>
              </button>

              {/* Nút làm mới */}
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};