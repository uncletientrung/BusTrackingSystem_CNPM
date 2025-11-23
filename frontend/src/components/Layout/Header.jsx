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

                        <div className="ml-4 lg:ml-0">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} 
                            </h1>

                            
                        </div>
                    </div>

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

                                    <a href="/profile" 
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropMenu(false) } 
                                    > {/* set = false Để khi quay lại không lỗi */}
                                        <User className="mr-3 h-4 w-4"></User>
                                        Hồ sơ cá nhân
                                    </a>

                                    <button onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="mr-3 h-4 w-4"></LogOut>
                                        Đăng xuất
                                    </button>
                                </div>
                            )} {/* END Dropdown Menu */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Nếu ấn ra ngoài cũng sẽ tắt */}
            {showDropMenu && ( 
                <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropMenu(false)}
                />
            )}
        </header>
      </>
   )
};