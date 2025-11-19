import {
  CirclePlus,
  Edit,
  Eye,
  Filter,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Plus,
  PlusCircle,
  Search,
  Trash2,
  User,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountAPI, UserAPI } from "../../api/apiServices";

export default function UsersPage() {
  const navigate = useNavigate(); // Dùng để chuyển hướng trang (hook)
  const [users, setUsers] = useState([]); // Danh sách user
  const [accounts, setAccounts] = useState([]); // Danh sách account
  const [filteredUsers, setFilteredUsers] = useState([]); // Danh sách user sau lọc
  const [searchTerm, setSearchTerm] = useState(""); // Ký tự tìm kiếm
  const [selectedRole, setSelectedRole] = useState("all"); // Bộ lọc role
  const [selectedStatus, setSelectedStatus] = useState("all"); // Bộ lọc trạng thái
  const [showCreateModal, setShowCreateModal] = useState(false); // Trạng thái tạo user
  const [showEditModal, setShowEditModal] = useState(false); // Trạng thái sửa
  const [editingUser, setEditingUser] = useState(null); // Đối tượng user sửa
  const [newUser, setNewUser] = useState({
    // Giả lập dữ liệu sửa
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    sex: "male",
    birthday: "",
    confirmPassword: "",
    role: "parent",
    status: "active",
    address: "",
  });

  // Tải dữ liệu từ API
  useEffect(() => {
    UserAPI.getAllUsers()
      .then((listUser) => {
        setUsers(listUser);
        setFilteredUsers(listUser);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu từ Page của User:", error);
      });
    AccountAPI.getAllAccount()
      .then((listAccount) => setAccounts(listAccount))
      .catch((err) => console.error(err));
  }, []);
  // useEffect để lọc danh sách hiển thị
  useEffect(() => {
    let filtered = users;

    // Filter theo từ khóa search
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      if (term) {
        filtered = filtered.filter((user) => {
          const name = (user.hoten || "").toLowerCase();
          const email = (user.email || "").toLowerCase();
          const phone = (user.sdt || "").toString();

          return (
            name.includes(term) || email.includes(term) || phone.includes(term)
          );
        });
      }
    }

    // Filter theo role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => {
        // Lấy account tương ứng với user
        const account = accounts.find((acc) => acc.matk === user.mand);
        if (!account) return false; // nếu chưa có account thì không hiển thị
        const roleMap = { 1: "admin", 2: "driver", 3: "parent" };
        return roleMap[account.manq] === selectedRole;
      });
    }

    // Filter theo trạng thái
    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => {
        const account = accounts.find((acc) => acc.matk === user.mand);
        if (!account) return false;
        return (
          (account.trangthai === 1 ? "active" : "inactive") === selectedStatus
        );
      });
    }

    setFilteredUsers(filtered);
  }, [users, accounts, searchTerm, selectedRole, selectedStatus]);

  const handleCreateUser = async () => {
    try {
      if (newUser.password !== newUser.confirmPassword) {
        alert("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
      }

      const result = await UserAPI.createUser(newUser);
      const { user, account } = result || {};

      if (!user || !account) {
        alert("Tạo người dùng thất bại!");
        return;
      }

      // Giữ nguyên cấu trúc dữ liệu như backend trả về
      const newUserFromAPI = {
        ...user, // có hoten, sdt, email, diachi, mand, trangthai...
      };

      // Cập nhật danh sách users và accounts
      setUsers((prev) => [...prev, newUserFromAPI]);
      if (account) {
        setAccounts((prev) => [...prev, account]);
      }

      // Reset form + đóng modal
      setShowCreateModal(false);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        sex: "male",
        birthday: "",
        confirmPassword: "",
        role: "parent",
        status: "active",
        address: "",
      });

      alert("Thêm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      alert("Có lỗi xảy ra: " + (error.message || error));
    }
  };

  const handleEditUser = async () => {
    try {
      // 1. Kiểm tra mật khẩu (nếu có nhập)
      if (editingUser.password || editingUser.confirmPassword) {
        if (editingUser.password !== editingUser.confirmPassword) {
          alert("Mật khẩu và xác nhận mật khẩu không khớp!");
          return;
        }
      }

      // 2. Chuẩn bị dữ liệu gửi lên backend
      const userUpdateData = {
        name: editingUser.hoten || editingUser.name,
        birthday: editingUser.ngaysinh || editingUser.birthday || null,
        phone: editingUser.sdt || editingUser.phone,
        email: editingUser.email,
        address: editingUser.diachi || editingUser.address || "",
        sex: editingUser.sex, // "male" | "female"
        username: editingUser.username,
        role: editingUser.role, // "admin" | "driver" | "parent"
        status: editingUser.status, // "active" | "inactive"
      };

      // Nếu có đổi mật khẩu → gửi lên
      if (editingUser.password && editingUser.password.trim() !== "") {
        userUpdateData.password = editingUser.password;
      }

      // 3. Gọi API cập nhật
      const result = await UserAPI.updateUser(editingUser.mand, userUpdateData);
      const { user: updatedUser, account: updatedAccount } = result;

      if (!updatedUser) {
        alert("Cập nhật thất bại!");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.mand === updatedUser.mand ? { ...updatedUser } : u))
      );

      if (updatedAccount) {
        setAccounts((prev) =>
          prev.map((a) =>
            a.matk === updatedAccount.matk ? { ...updatedAccount } : a
          )
        );
      }

      // 5. Đóng modal + thông báo thành công
      setShowEditModal(false);
      setEditingUser(null);
      alert("Cập nhật người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      alert("Cập nhật thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleDeleteUser = async (mand) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác!"
      )
    ) {
      return;
    }

    try {
      await UserAPI.deleteUser(mand);
      setUsers((prev) => prev.filter((u) => u.mand !== mand));
      setAccounts((prev) => prev.filter((a) => a.matk !== mand));
      setFilteredUsers((prev) => prev.filter((u) => u.mand !== mand));
      alert("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      alert("Xóa thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  const getRoleName = (role) => {
    // Hàm lấy tên Role
    const roleMap = {
      1: "Quản trị viên",
      2: "Tài xế",
      3: "Phụ huynh",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    // Lấy màu Role
    const colorMap = {
      1: "bg-red-100 text-red-800",
      2: "bg-green-100 text-green-800",
      3: "bg-yellow-100 text-yellow-800",
    };
    return colorMap[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    // Lấy màu trạng thái
    return status === 1
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const stats = [
    // Statistics
    {
      name: "Tổng người dùng",
      value: users.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Đang hoạt động",
      value: accounts.filter((a) => a.trangthai === 1).length,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      name: "Tạm khóa",
      value: accounts.filter((a) => a.trangthai === 0).length,
      icon: UserX,
      color: "bg-red-500",
    },
    {
      name: "Tài xế",
      value: accounts.filter((u) => u?.manq === 2).length,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý người dùng
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span>
              <CirclePlus className="h-5 w-5 text-white" />
            </span>
            <span>Thêm người dùng</span>
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
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
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
                {filteredUsers.map((user) => {
                  const account = accounts.find(
                    (acc) => acc.matk === user.mand
                  );
                  return (
                    <tr key={user.mand} className="hover:bg-gray-50">
                      {/* Dữ liệu cột Info người dùng */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.hoten}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.diachi}
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
                          {user.sdt}
                        </div>
                      </td>

                      {/* Dữ liệu tài khoản */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {account ? account.tendangnhap : ""}{" "}
                          {/* Render chưa kịp*/}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <KeyRound className="h-4 w-4 mr-2 text-gray-400" />
                          {account ? account.matkhau : ""}{" "}
                          {/* Render chưa kịp*/}
                        </div>
                      </td>

                      {/* Dữ liệu vai trò */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            account ? account.manq : 1
                          )}`}
                        >
                          {getRoleName(account ? account.manq : 1)}
                        </span>
                      </td>

                      {/* Dữ liệu trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            account ? account.trangthai : 1
                          )}`}
                        >
                          {account && account.trangthai === 1
                            ? "Hoạt động"
                            : "Tạm khóa"}
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
                              const account = accounts.find(
                                (acc) => acc.matk === user.mand
                              );
                              setEditingUser({
                                mand: user.mand,
                                name: user.hoten || "",
                                email: user.email || "",
                                phone: user.sdt || "",
                                address: user.diachi || "",
                                birthday: user.ngaysinh || "",
                                sex: user.gioitinh === 1 ? "male" : "female",
                                username: account?.tendangnhap || "",
                                password: "",
                                confirmPassword: "",
                                role:
                                  account?.manq === 1
                                    ? "admin"
                                    : account?.manq === 2
                                    ? "driver"
                                    : "parent",
                                status:
                                  account?.trangthai === 1
                                    ? "active"
                                    : "inactive",
                              });
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Nút xóa */}
                          <button
                            onClick={() => handleDeleteUser(user.mand)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    Thêm người dùng mới
                  </h3>
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ô Giới tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính *
                      </label>
                      <select
                        value={newUser.sex}
                        onChange={(e) =>
                          setNewUser({ ...newUser, sex: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>

                    {/* Ô Ngày sinh*/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh *
                      </label>
                      <input
                        type="date"
                        placeholder="Ngày sinh"
                        value={newUser.birthday}
                        onChange={(e) =>
                          setNewUser({ ...newUser, birthday: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, phone: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, username: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            confirmPassword: e.target.value,
                          })
                        }
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
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewUser({ ...newUser, status: e.target.value })
                        }
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Chỉnh sửa người dùng
                </h3>

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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ô Giới tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính *
                      </label>
                      <select
                        value={editingUser.sex}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            sex: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>

                    {/* Ô Ngày sinh*/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh *
                      </label>
                      <input
                        type="date"
                        placeholder="Ngày sinh"
                        value={editingUser.birthday}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            birthday: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            phone: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            username: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            password: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            confirmPassword: e.target.value,
                          })
                        }
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
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          address: e.target.value,
                        })
                      }
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
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
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
                        Trạng thái *
                      </label>
                      <select
                        value={editingUser.status}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            status: e.target.value,
                          })
                        }
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
  );
}
