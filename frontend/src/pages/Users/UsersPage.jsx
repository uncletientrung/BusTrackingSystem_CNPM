import { CirclePlus, Edit, Eye, Filter, KeyRound, Mail, MapPin, Phone, Plus, PlusCircle, Search, Trash2, User, UserCheck, Users, UserX, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UsersPage() {
  const navigate = useNavigate() // Dùng để chuyển hướng trang (hook)
  const [users, setUsers] = useState([]) // Danh sách user
  const [filteredUsers, setFilteredUsers] = useState([]) // Danh sách user sau lọc
  const [searchTerm, setSearchTerm] = useState('') // Ký tự tìm kiếm
  const [selectedRole, setSelectedRole] = useState('all') // Bộ lọc role
  const [selectedStatus, setSelectedStatus] = useState('all') // Bộ lọc trạng thái
  const [showCreateModal, setShowCreateModal] = useState(false) // Trạng thái tạo user
  const [showEditModal, setShowEditModal] = useState(false) // Trạng thái sửa
  const [editingUser, setEditingUser] = useState(null) // Đối tượng user sửa
  const [newUser, setNewUser] = useState({ // Giả lập dữ liệu sửa 
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    status: 'active',
    address: ''
  })

  // Demo data
  const demoUsers = [
    {
      id: 1,
      name: 'Nguyễn Văn Admin',
      email: 'admin@busmanager.com',
      phone: '0901234567',
      username: '0901234567',
      password: '123012',
      role: 'admin',
      status: 'active',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      createdAt: '2024-01-15',
      lastLogin: '2024-10-04'
    },
    {
      id: 2,
      name: 'Trần Thị Dispatch',
      email: 'dispatch@busmanager.com',
      phone: '0902345678',
      username: '0902345678',
      password: '123012',
      role: 'dispatch',
      status: 'active',
      address: '456 Đường DEF, Quận 2, TP.HCM',
      createdAt: '2024-02-01',
      lastLogin: '2024-10-03'
    },
    {
      id: 3,
      name: 'Lê Văn Tài Xế',
      email: 'driver1@busmanager.com',
      phone: '0902345678',
      username: '0902345678',
      password: '123012',
      role: 'driver',
      status: 'active',
      address: '789 Đường GHI, Quận 3, TP.HCM',
      createdAt: '2024-02-15',
      lastLogin: '2024-10-04'
    },
    {
      id: 4,
      name: 'Phạm Thị Phụ Huynh',
      email: 'parent1@gmail.com',
      phone: '0904567890',
      username: '0902345678',
      password: '123012',
      role: 'parent',
      status: 'active',
      address: '321 Đường JKL, Quận 4, TP.HCM',
      createdAt: '2024-03-01',
      lastLogin: '2024-10-02'
    },
    {
      id: 5,
      name: 'Hoàng Văn Driver 2',
      email: 'driver2@busmanager.com',
      phone: '0905678901',
      username: '0902345678',
      password: '123012',
      role: 'driver',
      status: 'inactive',
      address: '654 Đường MNO, Quận 5, TP.HCM',
      createdAt: '2024-03-15',
      lastLogin: '2024-09-30'
    }
  ]

  useEffect(() => { // Nạp giả lập dữ liệu
    setUsers(demoUsers)
    setFilteredUsers(demoUsers)
  }, [])

  useEffect(() => { // Khởi tạo tìm kiếm mỗi lần render
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedRole, selectedStatus])


  const handleCreateUser = () => { // Hàm handle khi tạo user
    const user = {
      id: users.length + 1,
      ...newUser,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null
    }
    setUsers([...users, user])
    setShowCreateModal(false)
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'parent',
      status: 'active',
      address: ''
    })
  }

  const handleEditUser = () => { // Hàm handle khi sửa User
    setUsers(users.map(user =>
      user.id === editingUser.id ? editingUser : user
    ))
    setShowEditModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (id) => { // Hàm handle khi xóa User
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  const getRoleName = (role) => { // Hàm lấy tên Role
    const roleMap = {
      admin: 'Quản trị viên',
      driver: 'Tài xế',
      parent: 'Phụ huynh'
    }
    return roleMap[role] || role
  }

  const getRoleColor = (role) => { // Lấy màu Role
    const colorMap = {
      admin: 'bg-red-100 text-red-800',
      driver: 'bg-green-100 text-green-800',
      parent: 'bg-yellow-100 text-yellow-800'
    }
    return colorMap[role] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => { // Lấy màu trạng thái
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const stats = [ // Statistics
    {
      name: 'Tổng người dùng',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Đang hoạt động',
      value: users.filter(u => u.status === 'active').length,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: 'Tạm khóa',
      value: users.filter(u => u.status === 'inactive').length,
      icon: UserX,
      color: 'bg-red-500'
    },
    {
      name: 'Tài xế',
      value: users.filter(u => u.role === 'driver').length,
      icon: Users,
      color: 'bg-purple-500'
    }
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ô tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bộ lọc Role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="dispatch">Điều phối</option>
              <option value="driver">Tài xế</option>
              <option value="parent">Phụ huynh</option>
            </select>

            {/* Bộ lọc trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>

            {/* Label kết quả tìm kiếm */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Tìm thấy {filteredUsers.length} kết quả
            </div>
          </div>
        </div>

        {/* Khởi tạo bảng User */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Tạo Header cho cột */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tài khoản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>

              {/* Thêm dữ liệu vào Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* Dữ liệu cột Info người dùng */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.address}
                        </div>
                      </div>
                    </td>

                    {/* Dữ liệu thông tin liên hệ */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>

                    {/* Dữ liệu tài khoản */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <KeyRound className="h-4 w-4 mr-2 text-gray-400" />
                        {user.password}
                      </div>
                    </td>

                    {/* Dữ liệu vai trò */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>

                    {/* Dữ liệu trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>

                    {/* Các thao tác */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Nút xem chi tiết */}
                        <button
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Nút sửa */}
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Nút xóa */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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

        {/* Dialog thêm User */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Title Thêm */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Thêm người dùng mới</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nội dung thêm */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Họ tên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên *
                      </label>
                      <input
                        type="text"
                        placeholder="Họ và tên đầy đủ"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="Địa chỉ email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>


                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Tài khoản */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tài khoản *
                      </label>
                      <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Mật khẩu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu *
                      </label>
                      <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu *
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <textarea
                      placeholder="Địa chỉ"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Chọn Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò *
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="parent">Phụ huynh</option>
                        <option value="driver">Tài xế</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>

                    {/* Trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái *
                      </label>
                      <select
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm khóa</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Nút đóng và thêm */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 
                      px-4 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateUser}
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

        {/* Dialog sửa User */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Title */}
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa người dùng</h3>

                {/* Nút đóng X */}
                <button
                  onClick={() => setEditingUser(false)}
                  className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X></X>
                </button>

                {/* Ô họ tên */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tài khoản *
                      </label>
                      <input
                        type="text"
                        placeholder="Họ tên"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ô Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ô số phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Tài khoản */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tài khoản *
                      </label>
                      <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={editingUser.username}
                        onChange={(e) => setNewUser({ ...editingUser, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Mật khẩu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu *
                      </label>
                      <input
                        type="text"
                        placeholder="Mật khẩu"
                        value={editingUser.password}
                        onChange={(e) => setNewUser({ ...editingUser, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu *
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập lại mật khẩu"
                        value={editingUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...editingUser, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Ô địa chỉ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ *
                    </label>
                    <textarea
                      type="text"
                      placeholder="Địa chỉ"
                      value={editingUser.address}
                      onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Ô chọn Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò *
                      </label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="parent">Phụ huynh</option>
                        <option value="driver">Tài xế</option>
                        <option value="dispatch">Điều phối</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>

                    {/* Ô trạng thái */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò *
                      </label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm khóa</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 
                              px-4 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleEditUser}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 
                              rounded-lg font-medium transition-colors"
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