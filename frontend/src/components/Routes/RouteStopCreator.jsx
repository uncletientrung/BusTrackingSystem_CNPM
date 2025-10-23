import { GripVertical, MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import StopMap from "../../pages/Stops/StopMap";

export default function RouteStopCreator({ stops, onStopsChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newStop, setNewStop] = useState({
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);

  const handleAddStop = () => {
    setNewStop({
      name: '',
      latitude: '',
      longitude: '',
      address: '',
      description: ''
    });
    setErrors({});
    setShowMap(false);
    setIsAdding(true);
  };

  const handleMapClick = (lat, lng) => {
    setNewStop(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }));
    setErrors(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setNewStop(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      // Show map if both coordinates are valid
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(newStop.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(newStop.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setShowMap(true);
      }
    }
  };

  const validateStop = () => {
    const newErrors = {};

    if (!newStop.name.trim()) {
      newErrors.name = 'Tên điểm dừng không được để trống';
    }

    if (!newStop.latitude) {
      newErrors.latitude = 'Vĩ độ không được để trống';
    } else {
      const lat = parseFloat(newStop.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Vĩ độ phải từ -90 đến 90';
      }
    }

    if (!newStop.longitude) {
      newErrors.longitude = 'Kinh độ không được để trống';
    } else {
      const lng = parseFloat(newStop.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Kinh độ phải từ -180 đến 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveStop = () => {
    if (!validateStop()) return;

    const stop = {
      id: Date.now(), // Temporary ID
      code: `ST-${Date.now().toString().slice(-6)}`,
      name: newStop.name,
      latitude: parseFloat(newStop.latitude),
      longitude: parseFloat(newStop.longitude),
      lat: parseFloat(newStop.latitude),
      lng: parseFloat(newStop.longitude),
      address: newStop.address,
      description: newStop.description,
      order: stops.length + 1
    };

    onStopsChange([...stops, stop]);
    setIsAdding(false);
  };

  const handleRemoveStop = (stopId) => {
    const filtered = stops.filter(s => s.id !== stopId);
    // Reorder remaining stops
    const reordered = filtered.map((stop, index) => ({
      ...stop,
      order: index + 1
    }));
    onStopsChange(reordered);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = [...stops];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    // Update order
    const reordered = items.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    onStopsChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Điểm dừng trên tuyến
        </label>
        <button
          type="button"
          onClick={handleAddStop}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm điểm dừng
        </button>
      </div>

      {/* Add Stop Form */}
      {isAdding && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-blue-900">Thêm điểm dừng mới</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Form */}
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tên điểm dừng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStop.name}
                  onChange={(e) => {
                    setNewStop({ ...newStop, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="VD: Bến xe Miền Đông"
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Vĩ độ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={newStop.latitude}
                    onChange={handleCoordinateChange}
                    placeholder="10.8231"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.latitude && (
                    <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Kinh độ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={newStop.longitude}
                    onChange={handleCoordinateChange}
                    placeholder="106.6297"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.longitude && (
                    <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={newStop.address}
                  onChange={(e) => setNewStop({ ...newStop, address: e.target.value })}
                  placeholder="292 Đinh Bộ Lĩnh, Bình Thạnh"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={newStop.description}
                  onChange={(e) => setNewStop({ ...newStop, description: e.target.value })}
                  placeholder="Mô tả ngắn..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Column - Map */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  Chọn vị trí trên bản đồ
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  {showMap ? 'Ẩn' : 'Hiện'} bản đồ
                </button>
              </div>
              {showMap ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div style={{ height: '250px' }}>
                    <StopMap
                      latitude={parseFloat(newStop.latitude) || 10.8231}
                      longitude={parseFloat(newStop.longitude) || 106.6297}
                      onMapClick={handleMapClick}
                      stopName={newStop.name || 'Điểm dừng mới'}
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-[250px] flex flex-col items-center justify-center">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs text-gray-500">Nhập tọa độ hoặc click "Hiện bản đồ"</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveStop}
              className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Thêm vào tuyến
            </button>
          </div>
        </div>
      )}

      {/* Stops List */}
      {stops.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Danh sách điểm dừng ({stops.length})
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-96 overflow-y-auto">
            {stops
              .sort((a, b) => a.order - b.order)
              .map((stop, index) => (
                <div
                  key={stop.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Order Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {stop.order}
                      </div>
                    </div>

                    {/* Stop Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{stop.name}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {stop.code || `ST-${stop.id}`}
                        {stop.address && ` • ${stop.address}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Tọa độ: {(stop.lat || stop.latitude)?.toFixed(4)}, {(stop.lng || stop.longitude)?.toFixed(4)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-gray-500 italic">
            💡 Kéo thả để sắp xếp thứ tự các điểm dừng
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Chưa có điểm dừng nào</p>
          <p className="text-sm text-gray-400 mt-1">Click "Thêm điểm dừng" để bắt đầu</p>
        </div>
      )}
    </div>
  );
}
