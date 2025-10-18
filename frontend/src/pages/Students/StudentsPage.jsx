import { Check, CheckCircle, CirclePlus, Clock, Edit, Eye, Filter, GraduationCap, Phone, Plus, PlusCircle, Route, Search, Trash2, Users2, X, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function StudentsPage() {
  const navigate = useNavigate() // Dùng để chuyển hướng trang (hook)
  const [students, setStudents] = useState([]) // Danh sách học sinh
  const [filteredStudents, setFilteredStudents] = useState([]) // Danh sách học sinh sau lọc
  const [searchTerm, setSearchTerm] = useState('') // Ký tự tìm
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedRoute, setSelectedRoute] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false) // Trạng thái thêm student
  const [showEditModal, setShowEditModal] = useState(false) // Trạng thái sửa student
  const [editingStudent, setEditingStudent] = useState(null) // Đối tượng sửa
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    grade: '1',
    parentName: '',
    parentPhone: '',
    address: '',
    route: '',
    pickupPoint: '',
    dropdownPoint: '',
    sex: '',
    birthday: '',
    status: 'active'
  })

  // Giả lập dữ liệu
  const demoStudents = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      studentId: 'HS001',
      grade: '1',
      parentName: 'Nguyễn Thị Bình',
      parentPhone: '0901234567',
      parentEmail: 'parent1@gmail.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      route: 'Tuyến A',
      routeId: 'route-1',
      pickupPoint: 'Điểm đón A1 - Chợ Bến Thành',
      dropdownPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      pickupTime: '07:00',
      dropoffTime: '16:30',
      status: 'active',
      avatar: null,
      sex: 'Nam',
      birthday: '2024-01-15',
      emergencyContact: '0987654321',
      medicalNotes: 'Không có',
      createdAt: '2024-01-15',
      attendance: {
        present: 45,
        absent: 3,
        late: 2
      }
    },
    {
      id: 2,
      name: 'Trần Thị Bảo',
      studentId: 'HS002',
      grade: '2',
      parentName: 'Trần Văn Cường',
      parentPhone: '0902345678',
      parentEmail: 'parent2@gmail.com',
      address: '456 Đường DEF, Quận 2, TP.HCM',
      route: 'Tuyến B',
      routeId: 'route-2',
      pickupPoint: 'Điểm đón B2 - Trường THCS Nam Sài Gòn',
      dropdownPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      pickupTime: '07:15',
      dropoffTime: '16:45',
      status: 'active',
      avatar: null,
      sex: 'Nam',
      birthday: '2024-01-15',
      emergencyContact: '0987654322',
      medicalNotes: 'Dị ứng với đậu phộng',
      createdAt: '2024-02-01',
      attendance: {
        present: 42,
        absent: 5,
        late: 3
      }
    },
    {
      id: 3,
      name: 'Lê Văn Cao',
      studentId: 'HS003',
      grade: '3',
      parentName: 'Lê Thị Dung',
      parentPhone: '0903456789',
      parentEmail: 'parent3@gmail.com',
      address: '789 Đường GHI, Quận 3, TP.HCM',
      route: 'Tuyến A',
      routeId: 'route-1',
      pickupPoint: 'Điểm đón A3 - Công viên Tao Đàn',
      dropdownPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      pickupTime: '07:30',
      dropoffTime: '17:00',
      status: 'inactive',
      avatar: null,
      sex: 'Nam',
      birthday: '2024-01-15',
      emergencyContact: '0987654323',
      medicalNotes: 'Không có',
      createdAt: '2024-02-15',
      attendance: {
        present: 38,
        absent: 8,
        late: 4
      }
    },
    {
      id: 4,
      name: 'Phạm Thị Diễm',
      studentId: 'HS004',
      grade: '1',
      parentName: 'Phạm Văn Em',
      parentPhone: '0904567890',
      parentEmail: 'parent4@gmail.com',
      address: '321 Đường JKL, Quận 4, TP.HCM',
      route: 'Tuyến C',
      routeId: 'route-3',
      pickupPoint: 'Điểm đón C1 - Chợ Tân Định',
      dropdownPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      pickupTime: '06:45',
      dropoffTime: '16:15',
      status: 'active',
      sex: 'Nam',
      birthday: '2024-01-15',
      avatar: null,
      emergencyContact: '0987654324',
      medicalNotes: 'Cần thuốc hen suyễn',
      createdAt: '2024-03-01',
      attendance: {
        present: 40,
        absent: 6,
        late: 4
      }
    },
    {
      id: 5,
      name: 'Hoàng Văn Phong',
      studentId: 'HS005',
      grade: '4',
      parentName: 'Hoàng Thị Giang',
      parentPhone: '0905678901',
      parentEmail: 'parent5@gmail.com',
      address: '654 Đường MNO, Quận 5, TP.HCM',
      route: 'Tuyến B',
      routeId: 'route-2',
      pickupPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      dropdownPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
      pickupTime: '07:00',
      dropoffTime: '16:30',
      status: 'active',
      sex: 'Nam',
      birthday: '2024-01-15',
      avatar: null,
      emergencyContact: '0987654325',
      medicalNotes: 'Không có',
      createdAt: '2024-03-15',
      attendance: {
        present: 44,
        absent: 4,
        late: 2
      }
    }
  ]

  const routes = [
    { id: 'route-1', name: 'Tuyến A' },
    { id: 'route-2', name: 'Tuyến B' },
    { id: 'route-3', name: 'Tuyến C' }
  ]

  useEffect(() => {
    // Filter students based on user role
    let filteredByRole = demoStudents
    // if (user?.role === 'parent') {
    //    // In real app, this would filter by parent's children
    //    filteredByRole = demoStudents.filter(student =>
    //       student.parentEmail === user.email
    //    )
    // }
    setStudents(filteredByRole)
    setFilteredStudents(filteredByRole)
  }, [])

  useEffect(() => { // Lọc dữ liệu dựa trên tìm kiếm
    let filtered = students
    if (searchTerm) { // Tìm dựa trên search
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentPhone.includes(searchTerm)
      )
    }
    // Tìm dựa trên lớp
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade === selectedGrade)
    }
    // Tìm dựa trên tuyến
    if (selectedRoute !== 'all') {
      filtered = filtered.filter(student => student.routeId === selectedRoute)
    }
    // Tìm dựa trên trạng thái
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(student => student.status === selectedStatus)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedGrade, selectedRoute, selectedStatus])

  const handleCreateStudent = () => { // Hàm xử lý thêm student
    const student = {
      id: students.length + 1,
      ...newStudent,
      createdAt: new Date().toISOString().split('T')[0],
      attendance: {
        present: 0,
        absent: 0,
        late: 0
      },
      emergencyContact: '',
      medicalNotes: 'Không có'
    }
    setStudents([...students, student])
    setShowCreateModal(false)
    setNewStudent({
      name: '',
      studentId: '',
      grade: '1',
      parentName: '',
      parentPhone: '',
      address: '',
      route: '',
      pickupPoint: '',
      status: 'active'
    })
  }
  const toggleStudentStatus = (id) => {
    setStudents(students.map(student =>
      student.id === id
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ))
  }

  const handleEditStudent = () => { // Hàm xử lý sửa
    setStudents(students.map(student =>
      student.id === editingStudent.id ? editingStudent : student
    ))
    setShowEditModal(false)
    setEditingStudent(null)
  }

  const handleDeleteStudent = (id) => { // Hàm xử lý xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      setStudents(students.filter(student => student.id !== id))
    }
  }


  const getStatusColor = (status) => { // Màu trạng thái 
    return status === 'active'
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
      value: students.filter(s => s.status === 'active').length,
      icon: Check,
      color: 'bg-green-500'
    },
    {
      name: 'Tạm nghỉ',
      value: students.filter(s => s.status === 'inactive').length,
      icon: XCircle,
      color: 'bg-red-500'
    }
  ]


  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý học sinh</h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý thông tin và theo dõi học sinh
            </p>
          </div>
          {/* Nút thêm học sinh */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >

            <span>
              <CirclePlus className="h-5 w-5 text-white" />
            </span>
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
            </select>

            {/* Bộ lọc tuyến */}
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả tuyến</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>

            {/* Bộ lọc trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="inactive">Tạm nghỉ</option>
            </select>

            {/* Text số kết quả tìm thấy */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Tìm thấy {filteredStudents.length} kết quả
            </div>
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
                    Tuyến đường
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
                  <tr key={student.id} className="hover:bg-gray-50">
                    {/* Nội dung cột học sinh */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">MSHS: {student.studentId} • Lớp {student.grade}</div>
                        </div>
                      </div>
                    </td>

                    {/* Nội dung cột phụ huy */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.parentName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {student.parentPhone}
                      </div>
                    </td>

                    {/* Nội dung cột tuyến */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Route className="h-4 w-4 mr-2 text-gray-400" />
                        {student.route}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {student.pickupTime} - {student.dropoffTime}
                      </div>
                    </td>

                    {/* Nội dung cột trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status === 'active' ? 'Đang học' : 'Tạm nghỉ'}
                      </span>
                    </td>

                    {/* Nội dung cột thao tác */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Nút xem chi tiết */}
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4"></Eye>
                        </button>

                        {/* Nút đổi status */}
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          className={`${student.status === 'active' ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'}`}
                          title={student.status === 'active' ? 'Tạm nghỉ' : 'Kích hoạt'}
                        >
                          {student.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
                          onClick={() => handleDeleteStudent(student.id)}
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

        {/* Dialog thêm học sinh */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm học sinh mới</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X></X>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Ô mã học sinh */}
                  <input
                    type="text"
                    placeholder="Mã học sinh"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô họ tên */}
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô mã học sinh */}
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={newStudent.birthday}
                    onChange={(e) => setNewStudent({ ...newStudent, birthday: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô giới tính */}
                  <select
                    value={newStudent.sex}
                    onChange={(e) => setNewStudent({ ...newStudent, sex: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>

                  {/* Chọn lớp */}
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
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

                  {/* Ô ẩn */}
                  <p></p>

                  {/* Ô số điện thoại phụ huynh */}
                  <input
                    type="tel"
                    placeholder="Số điện thoại phụ huynh"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô tên phụ huynh */}
                  <input
                    type="text"
                    placeholder="Tên phụ huynh"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô chọn tuyến đường */}
                  <select
                    value={newStudent.route}
                    onChange={(e) => setNewStudent({ ...newStudent, route: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tuyến đường</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.name}>{route.name}</option>
                    ))}
                  </select>

                  {/* Ô ẩn */}
                  <p></p>

                  {/* Ô điểm đón */}
                  <input
                    type="text"
                    placeholder="Điểm đón"
                    value={newStudent.pickupPoint}
                    onChange={(e) => setNewStudent({ ...newStudent, pickupPoint: e.target.value })}
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô điểm dừng trả */}
                  <input
                    type="text"
                    placeholder="Điểm dừng"
                    value={newStudent.dropdownPoint}
                    onChange={(e) => setNewStudent({ ...newStudent, dropdownPoint: e.target.value })}
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô địa chỉ */}
                  <textarea
                    placeholder="Địa chỉ nhà"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />

                </div>


                {/* Nút tắt và thêm */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 
                              px-4 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={handleCreateStudent}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 
                              rounded-lg font-medium transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dialog sửa học sinh */}
        {showEditModal && editingStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa thông tin học sinh</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X></X>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Ô mã học sinh*/}
                  <input
                    type="text"
                    placeholder="Mã số học sinh"
                    value={editingStudent.studentId}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô họ và tên */}
                  <input
                    type="text"
                    placeholder="Họ tên học sinh"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô mã học sinh */}
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={editingStudent.birthday}
                    onChange={(e) => setNewStudent({ ...editingStudent, birthday: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô giới tính */}
                  <select
                    value={editingStudent.sex}
                    onChange={(e) => setNewStudent({ ...editingStudent, sex: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>

                  {/* Ô chọn lớp*/}
                  <select
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">Lớp 1</option>
                    <option value="2">Lớp 2</option>
                    <option value="3">Lớp 3</option>
                    <option value="4">Lớp 4</option>
                    <option value="5">Lớp 5</option>
                  </select>

                  {/* Ô ẩn */}
                  <p></p>

                  {/* Ô tên phụ huynh */}
                  <input
                    type="text"
                    placeholder="Tên phụ huynh"
                    value={editingStudent.parentName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô số phụ huynh */}
                  <input
                    type="tel"
                    placeholder="Số điện thoại phụ huynh"
                    value={editingStudent.parentPhone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />


                  {/* Ô chọn tuyến đường */}
                  <select
                    value={editingStudent.route}
                    onChange={(e) => setEditingStudent({ ...editingStudent, route: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tuyến đường</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.name}>{route.name}</option>
                    ))}
                  </select>

                  {/* Ô ẩn */}
                  <p></p>

                  {/* Ô điểm đón */}
                  <input
                    type="text"
                    placeholder="Điểm đón"
                    value={editingStudent.pickupPoint}
                    onChange={(e) => setNewStudent({ ...editingStudent, pickupPoint: e.target.value })}
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô điểm dừng trả */}
                  <input
                    type="text"
                    placeholder="Điểm dừng"
                    value={editingStudent.dropdownPoint}
                    onChange={(e) => setNewStudent({ ...editingStudent, dropdownPoint: e.target.value })}
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô địa chỉ */}
                  <textarea
                    placeholder="Địa chỉ"
                    value={editingStudent.address}
                    onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />

                  {/* Ô điểm đón */}
                  <input
                    type="text"
                    placeholder="Điểm đón"
                    value={editingStudent.pickupPoint}
                    onChange={(e) => setEditingStudent({ ...editingStudent, pickupPoint: e.target.value })}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Nút hủy và cập nhật */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleEditStudent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
};