import { MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import StopMap from "./StopMap";

export default function StopModal({ stop, onClose, onSave }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (stop) {
      setFormData({
        code: stop.code || '',
        name: stop.name || '',
        latitude: stop.latitude || '',
        longitude: stop.longitude || '',
        address: stop.address || '',
        description: stop.description || ''
      });
      // Show map if coordinates exist
      if (stop.latitude && stop.longitude) {
        setShowMap(true);
      }
    } else {
      // Auto-generate code for new stop
      const timestamp = Date.now().toString().slice(-6);
      setFormData(prev => ({
        ...prev,
        code: `ST-${timestamp}`
      }));
    }
  }, [stop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    // Allow empty, numbers, minus sign, and decimal point
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user types
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      // Show map if both coordinates are valid
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setShowMap(true);
      }
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }));
    // Clear coordinate errors
    setErrors(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã điểm dừng không được để trống';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên điểm dừng không được để trống';
    }

    if (!formData.latitude) {
      newErrors.latitude = 'Vĩ độ không được để trống';
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Vĩ độ phải từ -90 đến 90';
      }
    }

    if (!formData.longitude) {
      newErrors.longitude = 'Kinh độ không được để trống';
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Kinh độ phải từ -180 đến 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {stop ? 'Chỉnh sửa điểm dừng' : 'Thêm điểm dừng mới'}
                </h2>
                <p className="text-sm text-gray-500">
                  {stop ? 'Cập nhật thông tin điểm dừng' : 'Nhập thông tin điểm dừng mới'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  {/* Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã điểm dừng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.code ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="ST-001"
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên điểm dừng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="Bến xe Bến Thành"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vĩ độ (Latitude) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleCoordinateChange}
                      className={`w-full px-3 py-2 border ${
                        errors.latitude ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="10.8231 (từ -90 đến 90)"
                    />
                    {errors.latitude && (
                      <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
                    )}
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kinh độ (Longitude) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleCoordinateChange}
                      className={`w-full px-3 py-2 border ${
                        errors.longitude ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="106.6297 (từ -180 đến 180)"
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1 Phạm Ngũ Lão, Quận 1, TP.HCM"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Mô tả ngắn về điểm dừng..."
                    />
                  </div>
                </div>

                {/* Right Column - Map */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Vị trí trên bản đồ
                    </label>
                    <button
                      type="button"
                      onClick={toggleMap}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
                    </button>
                  </div>
                  
                  {showMap ? (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <StopMap
                        latitude={parseFloat(formData.latitude) || 10.8231}
                        longitude={parseFloat(formData.longitude) || 106.6297}
                        onMapClick={handleMapClick}
                        stopName={formData.name || 'Điểm dừng mới'}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">
                        Nhập tọa độ để xem vị trí trên bản đồ
                      </p>
                      <button
                        type="button"
                        onClick={toggleMap}
                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Hiển thị bản đồ
                      </button>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Mẹo:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Nhấp vào bản đồ để chọn vị trí</li>
                      <li>• Tọa độ sẽ tự động cập nhật</li>
                      <li>• Có thể nhập tọa độ thủ công</li>
                      <li>• Kéo/zoom bản đồ để tìm vị trí chính xác</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {stop ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
