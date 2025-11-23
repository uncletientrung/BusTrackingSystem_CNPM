import { MapPinned, Route, Search, UserCheck, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CTRouteAPI, StopAPI, StudentAPI } from "../../api/apiServices";

export default function ScheduleStudentSelector({
  selectedStudents = [],
  onClose,
  setListSelectedStudent,
  selectedRouteId
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [stops, setStops] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const [listStudent, listStop, listCTTD] = await Promise.all([StudentAPI.getAllStudent(),
        StopAPI.getAllStops(), CTRouteAPI.getCTTTById(selectedRouteId)]);
        const filerListStudent = listStudent.filter(std => listCTTD.some(ct => std.diemdung == ct.madd))
        setAllStudents(filerListStudent);
        setStops(listStop);
      } catch (error) {
        alert("Lỗi lấy dữ liệu học sinh ở ScheduleStudentSelector " + error)
      }
    })();
  }, []);

  useEffect(() => { // Khởi tạo selectedList từ selectedStudents khi modal mở
    setSelectedList([...selectedStudents]);
    setSearchTerm('');
  }, [selectedStudents]);

  // Lọc học sinh theo tìm kiếm
  const filteredStudents = allStudents.filter(student =>
    student.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.mahs.toString().includes(searchTerm.toLowerCase()) ||
    student.lop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kiểm tra học sinh đã được chọn chưa
  const isSelected = (studentId) => {
    return selectedList.some(s => s.mahs === studentId);
  };

  const handleToggleStudent = (student) => {
    if (isSelected(student.mahs)) {
      setSelectedList(selectedList.filter(s => s.mahs !== student.mahs));
    } else {
      setSelectedList([...selectedList, student]);
    }
  };
  const handleSelectAll = () => {
    const newSelected = [...selectedList];
    filteredStudents.forEach(student => {
      if (!isSelected(student.mahs)) {
        newSelected.push(student);
      }
    });
    setSelectedList(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedList([]);
  };
  const handleConfirm = () => {
    setListSelectedStudent(selectedList);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Chọn học sinh
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
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

            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>
                Kết quả: <strong className="text-gray-900">{filteredStudents.length}</strong> học sinh
              </span>
            </div>
          </div>

          {/* Table */}
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
                        Mã HS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên học sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điểm xuống
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const selected = isSelected(student.mahs);
                      const diemtra = stops.find(stop => stop.madd == student.diemdung).tendiemdung;
                      return (
                        <tr
                          key={student.mahs}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected ? 'bg-primary-50' : ''
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.mahs}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.hoten}</div>
                            <div className="text-sm text-gray-500">{student.diachi}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.lop}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="text-sm text-gray-900 flex items-center">
                              <MapPinned className="h-4 w-4 mr-2 text-gray-900" />
                               {diemtra}
                            </div>
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
              </div>
            )}
          </div>

          {/* Chân trang */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Đã chọn <strong className="text-primary-600">{selectedList.length}</strong> học sinh
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
