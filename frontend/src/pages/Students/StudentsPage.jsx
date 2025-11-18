import { Check, CheckCircle, CirclePlus, Edit, Eye, Phone, Route, Search, Trash2, Users2, XCircle, GraduationCap, Bus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { StudentAPI, StopAPI, UserAPI } from "../../api/apiServices"
import StudentModal from "./StudentModal" // Import modal chứa form thêm/sửa

export default function StudentsPage() {
  const navigate = useNavigate() // Dùng để chuyển hướng trang (hook)
  const [students, setStudents] = useState([]) // Danh sách học sinh
  const [filteredStudents, setFilteredStudents] = useState([]) // Danh sách học sinh sau lọc
  const [searchTerm, setSearchTerm] = useState('') // Ký tự tìm
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedPickUp, setSelectedPickUp] = useState(-1)
  const [selectedDropOff, setSelectedDropOff] = useState(-1)
  const [selectedStatus, setSelectedStatus] = useState(-1)
  const [showCreateModal, setShowCreateModal] = useState(false) // Trạng thái thêm student
  const [showEditModal, setShowEditModal] = useState(false) // Trạng thái sửa student
  const [editingStudent, setEditingStudent] = useState(null) // Đối tượng sửa
  const [stops, setStops] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    StudentAPI.getAllStudent().then((listStudent) => {
      setStudents(listStudent)
      setFilteredStudents(listStudent)
    }).catch((error) => {
      console.error('Lỗi khi tải dữ liệu học sinh:', error)
    })

    // Lấy hết điểm dừng (Cách viết 1)
    StopAPI.getAllStops().then(listStop => setStops(listStop))
      .catch((error) => {
        console.error('Lỗi khi tải dữ liệu điểm dừng ở học sinh:', error)
      })

      // Lấy hết User (Cách viết 2)
      ; (async () => {
        try {
          const listUser = await UserAPI.getAllUsers()
          setUsers(listUser)
        } catch (error) {
          console.error('Lỗi khi tải dữ liệu user ở học sinh:', error)
        }
      })()
  }, [])

  useEffect(() => { // Lọc dữ liệu dựa trên tìm kiếm
    let filtered = students
    if (searchTerm) { // Tìm dựa trên search
      filtered = filtered.filter(student =>
        student.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mahs.toString().includes(searchTerm.toLowerCase()) ||
        student.sdt.includes(searchTerm)
      )
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.lop === selectedGrade)
    }
    if (selectedPickUp !== -1) {
      filtered = filtered.filter(student => student.diemdon === selectedPickUp)
    }
    if (selectedDropOff !== -1) {
      filtered = filtered.filter(student => student.diemdung === selectedDropOff)
    }
    if (selectedStatus !== -1) {
      filtered = filtered.filter(student => student.trangthai === selectedStatus)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedGrade, selectedPickUp, selectedDropOff, selectedStatus])

  const handleDeleteStudent = async (mahs) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        await StudentAPI.deleteStudent(mahs);
        setStudents(students.filter(student => student.mahs !== mahs))
      } catch (error) {
        alert(error.message || 'Xóa thất bại!');
      }

    }
  }

  const getStatusColor = (status) => {
    return status === 1
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  // Thống kê nhanh
  const stats = [
    {
      name: 'Tổng học sinh',
      value: students.length,
      icon: Users2,
      color: 'bg-blue-500'
    },
    {
      name: 'Đang học',
      value: students.filter(std => std.trangthai == 1).length,
      icon: Check,
      color: 'bg-green-500'
    },
    {
      name: 'Tạm nghỉ',
      value: students.filter(s => s.trangthai == 0).length,
      icon: XCircle,
      color: 'bg-red-500'
    }
  ]

  const handleSaveStudent = async (StudentData) => {
    if (editingStudent) {
      await StudentAPI.updateStudent(editingStudent.mahs, StudentData);
      setStudents(students.map(student =>
        student.mahs == editingStudent.mahs ? { ...student, ...StudentData } : student));

    } else {
      let newStudent = await StudentAPI.createStudent(StudentData);
      setStudents(prev => [...prev, newStudent.student]);
    }
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingStudent(null);
  }
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
            </div>
          </div>
          {/* Nút thêm học sinh */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <CirclePlus className="h-5 w-5 text-white" />
            <span>Thêm học sinh</span>
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tìm kiếm và bộ lọc */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Text tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bộ lọc lớp */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả lớp</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>

            {/* Bộ lọc điểm đón */}
            <select
              value={selectedPickUp.toString()}
              onChange={(e) => setSelectedPickUp(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-1">Tất cả điểm đón</option>
              {stops.map(stop => (
                <option key={stop.madd} value={stop.madd.toString()}>{stop.tendiemdung}</option>
              ))}
            </select>

            {/* Bộ lọc điểm trả */}
            <select
              value={selectedDropOff.toString()}
              onChange={(e) => setSelectedDropOff(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-1">Tất cả điểm trả</option>
              {stops.map(stop => (
                <option key={stop.madd} value={stop.madd.toString()}>{stop.tendiemdung}</option>
              ))}
            </select>

            {/* Bộ lọc trạng thái */}
            <select
              value={selectedStatus.toString()}
              onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="-1">Tất cả trạng thái</option>
              <option value="1">Đang học</option>
              <option value="0">Tạm nghỉ</option>
            </select>
          </div>
        </div>

        {/* Bảng học sinh */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Header của Table */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm đón/ trả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>

              {/* Body của Table */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.mahs} className="hover:bg-gray-50">
                    {/* Nội dung cột học sinh */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.hoten}</div>
                          <div className="text-sm text-gray-500">MSHS: {student.mahs} • Lớp {student.lop}</div>
                        </div>
                      </div>
                    </td>

                    {/* Nội dung cột phụ huynh */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {users.find(user => user.mand == student.maph)?.hoten || "Chưa có"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {users.find(user => user.mand == student.maph)?.sdt || "Chưa có"}
                      </div>
                    </td>

                    {/* Nội dung điểm đón / trả */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Route className="h-4 w-4 mr-2 text-gray-900" />
                        Điểm đón: {stops.find(stop => stop.madd === student.diemdon)?.tendiemdung || "Chưa có"}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <Route className="h-4 w-4 mr-2 text-gray-900" />
                        Điểm trả: {stops.find(stop => stop.madd === student.diemdung)?.tendiemdung || "Chưa có"}
                      </div>
                    </td>

                    {/* Nội dung cột trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.trangthai)}`}>
                        {student.trangthai === 1 ? 'Đang học' : 'Tạm nghỉ'}
                      </span>
                    </td>

                    {/* Nội dung cột thao tác */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Nút xem chi tiết */}
                        <button
                          onClick={() => navigate(`/students/${student.mahs}`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Nút sửa học sinh */}
                        <button
                          onClick={() => {
                            setEditingStudent(student)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Nút xóa học sinh */}
                        <button
                          onClick={() => handleDeleteStudent(student.mahs)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(showCreateModal || showEditModal) && (
          <StudentModal
            isOpen={showCreateModal || showEditModal}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setEditingStudent(null);
            }}
            mode={showEditModal ? 'edit' : 'create'}
            student={editingStudent}
            stops={stops}
            users={users}
            onSave={handleSaveStudent}
          />
        )}
      </div>
    </>
  )
}