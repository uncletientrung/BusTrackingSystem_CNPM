import { Search, UserCheck, X } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Component cho phép chọn học sinh để thêm vào lịch trình
 * @param {Array} selectedStudents - Danh sách học sinh đã chọn
 * @param {Function} onStudentsChange - Callback khi danh sách thay đổi
 * @param {Boolean} isOpen - Trạng thái mở/đóng modal
 * @param {Function} onClose - Callback khi đóng modal
 */
export default function ScheduleStudentSelector({ 
  selectedStudents = [], 
  onStudentsChange, 
  isOpen, 
  onClose 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // Mock data - Danh sách học sinh mẫu
  useEffect(() => {
    const mockStudents = [
      { id: 1, name: 'Nguyễn Văn A', studentCode: 'HS001', class: '10A1', grade: 10, phone: '0901234567', address: 'Quận 1, TP.HCM' },
      { id: 2, name: 'Trần Thị B', studentCode: 'HS002', class: '10A1', grade: 10, phone: '0901234568', address: 'Quận 3, TP.HCM' },
      { id: 3, name: 'Lê Văn C', studentCode: 'HS003', class: '10A2', grade: 10, phone: '0901234569', address: 'Quận 5, TP.HCM' },
      { id: 4, name: 'Phạm Thị D', studentCode: 'HS004', class: '10A2', grade: 10, phone: '0901234570', address: 'Quận 7, TP.HCM' },
      { id: 5, name: 'Hoàng Văn E', studentCode: 'HS005', class: '11A1', grade: 11, phone: '0901234571', address: 'Bình Thạnh, TP.HCM' },
      { id: 6, name: 'Vũ Thị F', studentCode: 'HS006', class: '11A1', grade: 11, phone: '0901234572', address: 'Tân Bình, TP.HCM' },
      { id: 7, name: 'Đặng Văn G', studentCode: 'HS007', class: '11A2', grade: 11, phone: '0901234573', address: 'Gò Vấp, TP.HCM' },
      { id: 8, name: 'Bùi Thị H', studentCode: 'HS008', class: '11A2', grade: 11, phone: '0901234574', address: 'Thủ Đức, TP.HCM' },
      { id: 9, name: 'Ngô Văn I', studentCode: 'HS009', class: '12A1', grade: 12, phone: '0901234575', address: 'Quận 2, TP.HCM' },
      { id: 10, name: 'Đinh Thị K', studentCode: 'HS010', class: '12A1', grade: 12, phone: '0901234576', address: 'Quận 9, TP.HCM' },
      { id: 11, name: 'Trương Văn L', studentCode: 'HS011', class: '12A2', grade: 12, phone: '0901234577', address: 'Quận 10, TP.HCM' },
      { id: 12, name: 'Lý Thị M', studentCode: 'HS012', class: '12A2', grade: 12, phone: '0901234578', address: 'Quận 11, TP.HCM' },
    ];
    setAllStudents(mockStudents);
  }, []);

  // Khởi tạo tempSelected từ selectedStudents khi modal mở
  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedStudents]);
      setSearchTerm('');
    }
  }, [isOpen, selectedStudents]);

  // Lọc học sinh theo tìm kiếm
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kiểm tra học sinh đã được chọn chưa
  const isSelected = (studentId) => {
    return tempSelected.some(s => s.id === studentId);
  };

  // Toggle chọn/bỏ chọn học sinh
  const handleToggleStudent = (student) => {
    if (isSelected(student.id)) {
      setTempSelected(tempSelected.filter(s => s.id !== student.id));
    } else {
      setTempSelected([...tempSelected, student]);
    }
  };

  // Chọn tất cả học sinh hiện tại (trong kết quả tìm kiếm)
  const handleSelectAll = () => {
    const newSelected = [...tempSelected];
    filteredStudents.forEach(student => {
      if (!isSelected(student.id)) {
        newSelected.push(student);
      }
    });
    setTempSelected(newSelected);
  };

  // Bỏ chọn tất cả
  const handleDeselectAll = () => {
    setTempSelected([]);
  };

  // Xác nhận và lưu
  const handleConfirm = () => {
    onStudentsChange(tempSelected);
    onClose();
  };

  if (!isOpen) return null;

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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Chọn học sinh
                </h2>
                <p className="text-sm text-gray-600">
                  Đã chọn: <span className="font-semibold text-primary-600">{tempSelected.length}</span> học sinh
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

          {/* Search và Actions */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Box */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã học sinh, lớp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>
                Kết quả: <strong className="text-gray-900">{filteredStudents.length}</strong> học sinh
              </span>
              {searchTerm && (
                <span className="text-primary-600">
                  Đang lọc theo: "<strong>{searchTerm}</strong>"
                </span>
              )}
            </div>
          </div>

          {/* Student List */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-12 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Chọn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã HS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên học sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khối
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student, index) => {
                      const selected = isSelected(student.id);
                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selected ? 'bg-primary-50' : ''
                          }`}
                          onClick={() => handleToggleStudent(student)}
                        >
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => handleToggleStudent(student)}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Khối {student.grade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.phone}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Không tìm thấy học sinh nào</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Danh sách học sinh trống'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Đã chọn <strong className="text-primary-600">{tempSelected.length}</strong> học sinh
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
