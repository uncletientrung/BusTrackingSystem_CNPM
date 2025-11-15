// components/BusModal.jsx
import { X, BusFront, Gauge, Users, Calendar, Fuel, User, Route } from "lucide-react";
import { useState, useEffect } from "react";

export default function BusModal({ bus, onClose, onSave, buses }) {
  const listBus = buses;
  const [formData, setFormData] = useState({
    maxe: '',
    bienso: '',
    hangxe: '',
    namsanxuat: '',
    soghe: '',
    trangthai: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bus) {
      setFormData({
        maxe: bus.maxe || '',
        bienso: bus.bienso || '',
        hangxe: bus.hangxe || '',
        namsanxuat: bus.namsanxuat || '',
        soghe: bus.soghe || '',
        trangthai: bus.trangthai || 0,
      });
    } else {
      setFormData({
        maxe: '',
        bienso: '',
        hangxe: '',
        namsanxuat: '',
        soghe: '',
        trangthai: 0,
      });
    }
    setErrors({});
  }, [bus]);

  const validate = () => {
    const newErrors = {};
    if (!formData.bienso.trim()) newErrors.bienso = 'Biển số không được để trống';
    if (!formData.soghe || formData.soghe <= 0) newErrors.soghe = 'Sức chứa phải lớn hơn 0';
    if (!formData.namsanxuat) newErrors.namsanxuat = 'Năm sản xuất không được để trống';
    const currentYear= new Date().getFullYear();
    if (Number(formData.namsanxuat) > currentYear) newErrors.namsanxuat = 'Năm sản xuất không được lớn hơn năm hiện tại';
    for (const bus of listBus) {
      if (bus.maxe !== formData.maxe && bus.bienso === formData.bienso) {
        newErrors.bienso = 'Biển số đã tồn tại';
        break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soghe' || name === 'trangthai' ? parseInt(value) || '' : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BusFront className="h-7 w-7 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {bus ? 'Chỉnh sửa xe buýt' : 'Thêm xe buýt mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className={`grid gap-5 grid-cols-1 ${bus && bus.maxe != null ? "md:grid-cols-2" : ""}`}>
            {/* Mã xe */}
            {bus?.maxe && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <BusFront className="h-4 w-4" />
                  Mã xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="maxe"
                  value={"BUS-" + formData.maxe}
                  onChange={handleChange}
                  disabled={!!bus}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.maxe ? 'border-red-300' : 'border-gray-300'
                    } ${bus ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.maxe && <p className="mt-1 text-xs text-red-600">{errors.maxe}</p>}
              </div>
            )}
            {/* Biển số */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Gauge className="h-4 w-4" />
                Biển số xe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bienso"
                value={formData.bienso}
                onChange={handleChange}
                placeholder="VD: 51B-123.45"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.bienso ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.bienso && <p className="mt-1 text-xs text-red-600">{errors.bienso}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Hãng xe */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <BusFront className="h-4 w-4" />
                Hãng xe
              </label>
              <input
                type="text"
                name="hangxe"
                value={formData.hangxe}
                onChange={handleChange}
                placeholder="VD: Hyundai, Thaco..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Năm sản xuất */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                Năm sản xuất
              </label>
              <input
                type="number"
                name="namsanxuat"
                value={formData.namsanxuat}
                onChange={handleChange}
                placeholder="2024"
                min="2000"
                max="2030"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.namsanxuat && <p className="mt-1 text-xs text-red-600">{errors.namsanxuat}</p>}
            </div>

            {/* Sức chứa */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4" />
                Sức chứa (chỗ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="soghe"
                value={formData.soghe}
                onChange={handleChange}
                placeholder="40"
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.soghe ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {errors.soghe && <p className="mt-1 text-xs text-red-600">{errors.soghe}</p>}
            </div>


            {/* Trạng thái */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="trangthai"
                value={formData.trangthai}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={1}>Hoạt động</option>
                <option value={2}>Bảo trì</option>
                <option value={3}>Sửa chữa</option>
                <option value={0}>Ngưng hoạt động</option>
              </select>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <BusFront className="h-5 w-5" />
            {bus ? 'Cập nhật' : 'Thêm xe'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}