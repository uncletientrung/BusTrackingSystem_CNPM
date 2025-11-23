<<<<<<< HEAD
import { Bell, LogOut, Menu, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { getRoleFromMaNq } from "../../utils/AccountRole"

export default function Header({onMenuClick}) {
    const navigate = useNavigate(); // Giả lập đăng xuất
    const [showDropMenu, setShowDropMenu] =useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const getRoleColor = (role) => { // Chỉnh sửa màu role 
        const colors = {
        admin: 'bg-red-100 text-red-800',
        dispatch: 'bg-blue-100 text-blue-800',
        driver: 'bg-green-100 text-green-800',
        parent: 'bg-purple-100 text-purple-800'
        }
        return colors[role] || 'bg-gray-100 text-gray-800'
    }

    const getRoleLabel = (manq) => {
        const roleLabels = {
            1: 'Quản trị viên',
            2: 'Tài xế',
            3: 'Phụ huynh'
        };
        return roleLabels[manq] || 'Người dùng';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn"); // xóa trạng thái đăng nhập
        sessionStorage.removeItem('currentUser');
        navigate("/login");
    };

    const userRole = currentUser ? getRoleFromMaNq(currentUser.manq) : null;
   return (
      <>
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Info bên trái */}
                    <div className="flex items-center">
                        <button onClick={onMenuClick}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500
                                 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset
                                 focus:ring-primary-500"
                                >
                            <Menu className="h-6 w-6"></Menu>
                        </button>
=======
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
>>>>>>> dd80ad239dc76d3dd8cf35dfc80209ff1f97a615

  const getRoleStyle = (manq) => {
    switch (manq) {
      case 1: return { bg: "bg-blue-600", text: "text-white", label: "Quản trị viên" };
      case 2: return { bg: "bg-gradient-to-r from-emerald-500 to-teal-600", text: "text-white", label: "Tài xế" };
      case 3: return { bg: "bg-gradient-to-r from-indigo-500 to-purple-600", text: "text-white", label: "Phụ huynh" };
      default: return { bg: "bg-gray-400", text: "text-white", label: "Không xác định" };
    }
  };

  const roleStyle = currentUser ? getRoleStyle(currentUser.manq) : { bg: "bg-gray-400", text: "text-white", label: "Đang tải..." };

<<<<<<< HEAD
                    {/* Info bên phải */}
                    <div className="flex items-center space-x-4">
                        {/* Thông báo */}
                         <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                            <Bell className="h-6 w-6"/>
                        </button>
                        
                        {/* User menu */}
                        <div className="relative">
                            <button onClick={() => setShowDropMenu(!showDropMenu)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 
                                                    focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center 
                                                    justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {currentUser ? getInitials(currentUser.tendangnhap) : 'U'}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {currentUser?.tendangnhap || 'Người dùng'}
                                    </p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full 
                                        text-xs font-medium ${getRoleColor(userRole)}`}>
                                        {currentUser ? getRoleLabel(currentUser.manq) : 'Người dùng'}
                                    </span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showDropMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md 
                                                shadow-lg py-1 z-50 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm text-gray-500">{currentUser?.tendangnhap || 'Không có thông tin'}</p>
                                    </div>
=======
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
>>>>>>> dd80ad239dc76d3dd8cf35dfc80209ff1f97a615

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