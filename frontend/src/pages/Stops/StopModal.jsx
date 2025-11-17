import { MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import StopMap from "./StopMap";
import { StopAPI } from "../../api/apiServices";

export default function StopModal({ stop, onClose, onSave }) {
  const [stops, setStops] = useState([]);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    madd: '',
    tendiemdung: '',
    vido: '',
    kinhdo: '',
    diachi: '',      
  });

  useEffect(() => {
    if (stop) {
      setFormData({
        madd: stop.madd,
        tendiemdung: stop.tendiemdung,
        vido: stop.vido,
        kinhdo: stop.kinhdo,
        diachi: stop.diachi,        
      });
      if (stop.vido && stop.kinhdo) {
        setShowMap(true);
      }
    } else {
      setFormData({
        madd: '',
        tendiemdung: '',
        vido: '',
        kinhdo: '',
        diachi: '',                      
      });
    }
  }, [stop]);

  useEffect(() => {
    (async () => {
      try {
        const listStop = await StopAPI.getAllStops();
        setStops(listStop);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu điểm dừng:', error);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) { // Xóa lỗi khi nhập
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }

      const lat = name === 'vido' ? parseFloat(value) : parseFloat(formData.vido);
      const lng = name === 'kinhdo' ? parseFloat(value) : parseFloat(formData.kinhdo);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setShowMap(true);
      }
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      vido: lat.toFixed(6),
      kinhdo: lng.toFixed(6)
    }));
    setErrors(prev => ({
      ...prev,
      vido: '',
      kinhdo: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    let lat;
    let lng;
    if (!formData.tendiemdung.trim()) {
      newErrors.tendiemdung = 'Tên điểm dừng không được để trống';
    }
    if (!formData.vido) {
      newErrors.vido = 'Vĩ độ không được để trống';
    } else {
      lat = parseFloat(formData.vido);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.vido = 'Vĩ độ phải từ -90 đến 90';
      }
    }
    if (!formData.kinhdo) {
      newErrors.kinhdo = 'Kinh độ không được để trống';
    } else {
      lng = parseFloat(formData.kinhdo);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.kinhdo = 'Kinh độ phải từ -180 đến 180';
      }
    }
    if (!formData.diachi.trim()) {
      newErrors.diachi = 'Địa chỉ không được để trống';
    }

    for (let i = 0; i < stops.length; i++) {
      if (stops[i].vido == lat && stops[i].kinhdo == lng && stops[i].madd != formData.madd) {
        newErrors.vido = 'Địa điểm này đã có trên hệ thống';
        newErrors.kinhdo = 'Địa điểm này đã có trên hệ thống';
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
        vido: parseFloat(formData.vido),
        kinhdo: parseFloat(formData.kinhdo)
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
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh]">
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
                <div className="space-y-4">
                  {/* Mã điểm dừng*/}
                  {stop && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã điểm dừng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="madd"
                        value={"STOP-"+formData.madd}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                        placeholder="ST-001"
                        disabled
                        readOnly
                      />
                    </div>
                  )}

                  {/* Tên điểm dừng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên điểm dừng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tendiemdung"
                      value={formData.tendiemdung}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.tendiemdung ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="Bến xe Bến Thành"
                    />
                    {errors.tendiemdung && (
                      <p className="mt-1 text-sm text-red-500">{errors.tendiemdung}</p>
                    )}
                  </div>

                  {/* Vĩ độ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vĩ độ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vido"
                      value={formData.vido}
                      onChange={handleCoordinateChange}
                      className={`w-full px-3 py-2 border ${errors.vido ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="10.8231"
                    />
                    {errors.vido && (
                      <p className="mt-1 text-sm text-red-500">{errors.vido}</p>
                    )}
                  </div>

                  {/* Kinh độ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kinh độ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="kinhdo"
                      value={formData.kinhdo}
                      onChange={handleCoordinateChange}
                      className={`w-full px-3 py-2 border ${errors.kinhdo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="106.6297"
                    />
                    {errors.kinhdo && (
                      <p className="mt-1 text-sm text-red-500">{errors.kinhdo}</p>
                    )}
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="diachi"
                      value={formData.diachi}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.diachi ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="1 Phạm Ngũ Lão, Quận 1, TP.HCM"
                    />
                    {errors.diachi && (
                      <p className="mt-1 text-sm text-red-500">{errors.diachi}</p>
                    )}
                  </div>
                </div>

                {/* Map */}
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
                    <div className="border border-gray-300 rounded-lg overflow-hidden h-90">
                      <StopMap
                        latitude={parseFloat(formData.vido) || 10.8231}
                        longitude={parseFloat(formData.kinhdo) || 106.6297}
                        onMapClick={handleMapClick}
                        stopName={formData.tendiemdung || 'Điểm dừng mới'}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center ">
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
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
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