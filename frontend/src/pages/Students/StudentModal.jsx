import { X, User, Calendar, Phone, Home, MapPin, GraduationCap, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function StudentModal({ isOpen, onClose, onSave, mode, student, stops, users }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    birthday: '',
    sex: 1,
    grade: '1',
    parentName: '',
    parentPhone: '',
    address: '',
    pickupPoint: '',  
    dropdownPoint: '', 
    status: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && student) {
      setFormData({
        studentId: student.mahs?.toString() || '',
        name: student.hoten || '',
        birthday: student.ngaysinh || '',
        sex: student.gioitinh ?? 1,
        grade: student.lop || '1',
        parentName: student.maph?.toString() || '',
        parentPhone: student.sdt || '',
        address: student.diachi || '',
        pickupPoint: student.diemdon?.toString() || '',
        dropdownPoint: student.diemdung?.toString() || '',
        status: student.trangthai === 1 ? 1 : 0
      });
    } else {
      const defaultForm = {
        studentId: '',
        name: '',
        birthday: '',
        sex: 1,
        grade: '1',
        parentName: '',
        parentPhone: '',
        address: '',
        pickupPoint: '',
        dropdownPoint: '',
        status: 1
      };
      setFormData(defaultForm);
    }

    setErrors({});
  }, [isOpen, mode, student, stops, users]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Họ và tên không được để trống';
    if (!formData.birthday) newErrors.birthday = 'Ngày sinh không được để trống';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Số điện thoại phụ huynh không được để trống';
    if (formData.parentPhone && !/^\d{10,11}$/.test(formData.parentPhone))
      newErrors.parentPhone = 'Số điện thoại không hợp lệ (10-11 số)';
    if (!formData.pickupPoint) newErrors.pickupPoint = 'Vui lòng chọn điểm đón';
    if (!formData.dropdownPoint) newErrors.dropdownPoint = 'Vui lòng chọn điểm trả';
    if (!formData.address) newErrors.address = "Vui lòng nhập thông tin địa chỉ";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'sex' || name === 'status' || name === 'pickupPoint' || name === 'dropdownPoint')
        ? (value === '' ? '' : parseInt(value))
        : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      const diemdonId = formData.pickupPoint ? parseInt(formData.pickupPoint) : null;
      const diemdungId = formData.dropdownPoint ? parseInt(formData.dropdownPoint) : null;
      const maph = formData.parentName ? parseInt(formData.parentName) : -1;
      if (mode === 'create') {
        const newStudent = {
          hoten: formData.name,
          ngaysinh: formData.birthday,
          gioitinh: formData.sex,
          lop: formData.grade,
          diachi: formData.address,
          sdt: formData.parentPhone,
          maph: maph,
          diemdon: diemdonId,
          diemdung: diemdungId,
          trangthai: formData.status
        };
        onSave(newStudent);
      } else if (mode === 'edit' && student) {
        const updatedStudent = {
          mahs: student.mahs,
          hoten: formData.name,
          ngaysinh: formData.birthday,
          gioitinh: formData.sex,
          lop: formData.grade,
          diachi: formData.address,
          sdt: formData.parentPhone,
          maph: maph,
          diemdon: diemdonId,
          diemdung: diemdungId,
          trangthai: formData.status
        };
        onSave(updatedStudent);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="h-7 w-7 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Thêm học sinh mới' : 'Chỉnh sửa thông tin học sinh'}
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
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {/* Mã học sinh */}
            {mode === 'edit' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="h-4 w-4" />
                  Mã học sinh
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            )}

            {/* Họ và tên */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.birthday ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.birthday && <p className="mt-1 text-xs text-red-600">{errors.birthday}</p>}
            </div>

            {/* Giới tính */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={1}>Nam</option>
                <option value={0}>Nữ</option>
              </select>
            </div>

            {/* Lớp */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="h-4 w-4" />
                Lớp
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Lớp {i + 1}</option>
                ))}
              </select>
            </div>

            {/* Số điện thoại phụ huynh */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4" />
                SĐT phụ huynh <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="0901234567"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.parentPhone ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.parentPhone && <p className="mt-1 text-xs text-red-600">{errors.parentPhone}</p>}
            </div>

            {/* Tên phụ huynh */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Tên phụ huynh
              </label>
              <select
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors `}
              >
                <option value="">Chọn phụ huynh</option>
                {users.map(user => (
                  <option key={user.mand} value={user.mand}>
                    {user.hoten}
                  </option>
                ))}
              </select>
            </div>

            {/* Điểm đón */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                Điểm đón <span className="text-red-500">*</span>
              </label>
              <select
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.pickupPoint ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Chọn điểm đón</option>
                {stops.map(stop => (
                  <option key={stop.madd} value={stop.madd}>
                    {stop.tendiemdung}
                  </option>
                ))}
              </select>
              {errors.pickupPoint && <p className="mt-1 text-xs text-red-600">{errors.pickupPoint}</p>}
            </div>

            {/* Điểm trả */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                Điểm trả <span className="text-red-500">*</span>
              </label>
              <select
                name="dropdownPoint"
                value={formData.dropdownPoint}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.dropdownPoint ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Chọn điểm trả</option>
                {stops.map(stop => (
                  <option key={stop.madd} value={stop.madd}>
                    {stop.tendiemdung}
                  </option>
                ))}
              </select>
              {errors.dropdownPoint && <p className="mt-1 text-xs text-red-600">{errors.dropdownPoint}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home className="h-4 w-4" />
                Địa chỉ nhà
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                rows={2}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </div>

            {/* Trạng thái */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Ngừng hoạt động</option>
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
            <Users className="h-5 w-5" />
            {mode === 'create' ? 'Thêm học sinh' : 'Cập nhật'}
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