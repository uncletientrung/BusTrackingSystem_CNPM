import { useEffect, useState } from "react";
import { RouteIcon, X, MapPin } from "lucide-react";
import StopSelector from "../../components/Routes/StopSelector";
import { calculateRouteDistance } from "../../utils/distanceCalculator";
import { CTRouteAPI, StopAPI } from "../../api/apiServices";

export default function RouteForm({ route, listStop, onSave, onCancel }) {
  const isReadOnly = route?.__readOnly === true; // Kiểm tra chế độ xem
  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState({ // Form xem/ sửa/ thêm
    name: route ? route.tentuyen : '',
    code: route?.matd || '',
    description: route?.mota || '',
    stops: [],
    status: route?.trangthai || -1,
    distance: route?.tongquangduong || 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [dsCTTD, listStop] = await Promise.all([CTRouteAPI.getCTTTById(Number(route.matd))
          , StopAPI.getAllStops()]);
        if (isReadOnly) {
          setFormData(prev => ({ ...prev, stops: dsCTTD }));
        }
        setStops(listStop);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Chi tiết Route: ', error);
      }
    })();
  }, [route, isReadOnly])

  const [errors, setErrors] = useState({});

  // Chỉ validate khi KHÔNG phải chế độ xem
  const validate = () => {
    if (isReadOnly) return true;
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên tuyến không được để trống';
    if (!formData.code.trim()) newErrors.code = 'Mã tuyến không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStopsChange = (stops) => {
    if (isReadOnly) return;
    const distance = calculateRouteDistance(stops);
    setFormData(prev => ({
      ...prev,
      stops,
      distance,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Modal */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <RouteIcon className="h-7 w-7 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {isReadOnly
              ? 'Xem chi tiết tuyến đường'
              : route
                ? 'Chỉnh sửa tuyến đường'
                : 'Thêm tuyến đường mới'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mã tuyến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã tuyến {isReadOnly ? '' : '*'}
          </label>
          <input
            type="text"
            value={"TD-" + formData.code}
            onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, code: e.target.value }))}
            disabled={isReadOnly || !!route}
            placeholder="VD: BT-SB-01"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.code ? 'border-red-300' : 'border-gray-300'
              } ${isReadOnly || route ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
          {errors.code && !isReadOnly && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
        </div>

        {/* Tên tuyến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên tuyến {isReadOnly ? '' : '*'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isReadOnly}
            placeholder="VD: Bến Thành - Sân Bay"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
              } ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
          {errors.name && !isReadOnly && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          value={formData.description}
          onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          disabled={isReadOnly}
          placeholder="Mô tả chi tiết về tuyến đường..."
          className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors resize-none ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          readOnly={isReadOnly}
        />
      </div>

      {/* Khoảng cách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng cách <span className="text-xs text-blue-600">(Tự động)</span>
          </label>
          <input
            type="text"
            value={formData.distance || 'Chưa có điểm dừng'}
            readOnly
            disabled
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          {isReadOnly ? (
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {formData.status === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
            </div>
          ) : (
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ngưng hoạt động</option>
            </select>
          )}
        </div>
      </div>

      {/* Danh sách điểm dừng */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Điểm dừng ({formData.stops.length})

        </label>
        {isReadOnly ? (
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-50 border border-gray-300 rounded-lg">
            {formData.stops.length > 0 ? (
              formData.stops.map((stop, idx) => (
                <div key={stop.madd} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-medium text-primary-600">{idx + 1}.</span>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{stops.find(s => s.madd == stop.madd).tendiemdung}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Chưa có điểm dừng</p>
            )}
          </div>
        ) : (
          <StopSelector
            selectedStops={formData.stops}
            onStopsChange={handleStopsChange}
            availableStops={listStop}
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          {isReadOnly ? 'Đóng' : 'Hủy'}
        </button>

        {/* ẨN NÚT LƯU KHI XEM */}
        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            {route ? 'Cập nhật' : 'Tạo tuyến'}
          </button>
        )}
      </div>
    </div>
  );
}