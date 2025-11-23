import { Bell, Home, LogOut, MapPin, Menu, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserAPI } from "../../api/apiServices";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropMenu, setShowDropMenu] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const driverId = currentUser?.matk;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!driverId) return;
      try {
        const users = await UserAPI.getAllUsers();
        const user = users.find(u => u.mand == driverId);
        setUserInfo(user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [driverId]);

  const getRoleStyle = (manq) => {
    switch (manq) {
      case 1: return { bg: "bg-blue-600", text: "text-white", label: "Quản trị viên" };
      case 2: return { bg: "bg-gradient-to-r from-emerald-500 to-teal-600", text: "text-white", label: "Tài xế" };
      case 3: return { bg: "bg-gradient-to-r from-indigo-500 to-purple-600", text: "text-white", label: "Phụ huynh" };
      default: return { bg: "bg-gray-400", text: "text-white", label: "Không xác định" };
    }
  };

  const roleStyle = currentUser ? getRoleStyle(currentUser.manq) : { bg: "bg-gray-400", text: "text-white", label: "Đang tải..." };

  const getInitials = (name) => {
    if (!name) return "XD";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;
  const activeButton = "bg-blue-600 text-white shadow-lg ring-4 ring-blue-200";

  return (
    <>
      <header className="fixed top-0 inset-x-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="relative flex items-center justify-center h-16 px-4">
          <button
            onClick={onMenuClick}
            className="absolute left-4 lg:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigate("/dashboard")}
              className={`p-3 rounded-full transition-all duration-300 ${isActive("/dashboard") || location.pathname === "/"
                ? activeButton
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Home className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigate("/tracking")}
              className={`p-3 rounded-full transition-all duration-300 ${isActive("/tracking")
                ? activeButton
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <MapPin className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigate("/notifications")}
              className={`relative p-3 rounded-full transition-all duration-300 ${isActive("/notifications")
                ? activeButton
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute right-4">
            <button
              onClick={() => setShowDropMenu(!showDropMenu)}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className={`w-11 h-11 ${roleStyle.bg} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white`}>
                <span className={`text-sm font-bold ${roleStyle.text}`}>
                  {getInitials(userInfo?.hoten)}
                </span>
              </div>

              <div className="hidden lg:block text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  {userInfo?.hoten || "Đang tải..."}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleStyle.bg} ${roleStyle.text} shadow-sm`}>
                    {roleStyle.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropMenu ? "rotate-180" : ""}`} />
                </div>
              </div>
            </button>

            {showDropMenu && (
              <>
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <p className="font-semibold text-lg">{userInfo?.hoten || "Người dùng"}</p>
                    <p className="text-sm opacity-90">@{currentUser?.tendangnhap || "user"}</p>
                  </div>

                  <div className="py-2">
                    <a
                      href="/profile"
                      onClick={() => setShowDropMenu(false)}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-all"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Hồ sơ cá nhân</span>
                    </a>

                    <hr className="my-2 border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 w-full transition-all text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                </div>

                <div className="fixed inset-0 z-40" onClick={() => setShowDropMenu(false)} />
              </>
            )}
          </div>
        </div>
      </header>

      <div className="h-16" />
    </>
  );
}