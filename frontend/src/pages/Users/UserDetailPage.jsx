import { ArrowLeft, Mail, MapPin, Phone, User, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAPI, AccountAPI } from "../../api/apiServices";

export default function UserDetailPage() {
  const { id } = useParams(); // mand từ URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mand = Number(id);

        const [usersRes, accountsRes] = await Promise.all([
          UserAPI.getAllUsers(),
          AccountAPI.getAllAccount(),
        ]);

        const foundUser = usersRes.find((u) => u.mand === mand);
        const foundAccount = accountsRes.find((a) => a.matk === mand);

        setUser(foundUser || null);
        setAccount(foundAccount || null);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Hàm hỗ trợ hiển thị
  const getRoleName = (manq) => {
    const map = { 1: "Quản trị viên", 2: "Tài xế", 3: "Phụ huynh" };
    return map[manq] || "Không xác định";
  };

  const getRoleColor = (manq) => {
    const map = {
      1: "bg-red-100 text-red-800",
      2: "bg-green-100 text-green-800",
      3: "bg-yellow-100 text-yellow-800",
    };
    return map[manq] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Không tìm thấy người dùng
        </h2>
        <p className="mt-2 text-gray-600">ID: {id}</p>
        <button
          onClick={() => navigate("/users")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 ml-0">
      {/* Header */}
      <button
        onClick={() => navigate("/users")}
        className="flex items-center text-white bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Thông tin người dùng
      </h1>

      {/* Card chính */}
      <div className="bg-white rounded-2xl shadow p-10 w-full min-h-96">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-16 w-16 text-gray-500" />
          </div>

          {/* Thông tin */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.hoten}</h2>
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                    account?.manq
                  )}`}
                >
                  {getRoleName(account?.manq)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    account?.trangthai === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {account?.trangthai === 1 ? "Đang hoạt động" : "Tạm khóa"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-base">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span>{user.email || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                <span>{user.sdt || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <span>Tên đăng nhập: {account?.tendangnhap || "Chưa có"}</span>
              </div>
              <div className="flex items-center md:col-span-2">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span>{user.diachi || "Chưa cập nhật địa chỉ"}</span>
              </div>
            </div>

            {/* Thông tin thêm nếu có */}
            {(user.ngaysinh || user.gioitinh !== undefined) && (
              <div className="border-t pt-4 mt-4 text-sm text-gray-600 space-y-1">
                {user.ngaysinh && (
                  <p>
                    Ngày sinh:{" "}
                    {new Date(user.ngaysinh).toLocaleDateString("vi-VN")}
                  </p>
                )}
                {user.gioitinh !== undefined && (
                  <p>Giới tính: {user.gioitinh === 1 ? "Nam" : "Nữ"}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
