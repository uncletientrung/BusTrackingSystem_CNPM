import { Bell, LogOut, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/apiServices";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [showDropMenu, setShowDropMenu] = useState(false);

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      driver: "bg-green-100 text-green-800",
      parent: "bg-purple-100 text-purple-800",
      unknown: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors.unknown;
  };

  const getRoleInfo = (manq) => {
    const roles = {
      1: { key: "admin", name: "Admin" },
      2: { key: "driver", name: "Tài xế" },
      3: { key: "parent", name: "Phụ huynh" },
    };
    return roles[manq] || { key: "unknown", name: "Không xác định" };
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const driverId = currentUser ? currentUser.matk : null;

  const [nguoiDangDangNhap, setNguoiDangDangNhap] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const listUser = await UserAPI.getAllUsers();
      const user = listUser.find((u) => u.mand == driverId);
      setNguoiDangDangNhap(user);
    };
    fetchUser();
  }, [driverId]);

  const role = getRoleInfo(currentUser?.manq);
  const roleColor = getRoleColor(role.key);

  const getInitials = (name) => {
    if (!name) return "FL";
    const parts = name.split(" ");
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left */}
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h1>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropMenu(!showDropMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getInitials(nguoiDangDangNhap?.hoten)}
                    </span>
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {nguoiDangDangNhap?.hoten || "Đang tải..."}
                    </p>

                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColor}`}
                    >
                      {role.name}
                    </span>
                  </div>
                </button>

                {showDropMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">
                        {currentUser.tendangnhap}
                      </p>
                    </div>

                    <a
                      href="/profile"
                      onClick={() => setShowDropMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Hồ sơ cá nhân
                    </a>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showDropMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropMenu(false)}
          />
        )}
      </header>
    </>
  );
}
