import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react' // Thư viện Icon trạng thái đăng nhập, xuất
import { Link, useNavigate } from 'react-router-dom' // Thư viện Thẻ link 
import { useState } from 'react'
import { auth } from '../../hooks/auth'
import './LoginPage.css'  

export default function LoginPage() {
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Ngăn chặn reload lại trang khi gửi form
    const { setAuth } = auth(); // Lấy hàm setAuth từ auth hook
    
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            if (username === "admin@gmail.com" && password === "123") {
                // Giả lập đăng nhập admin với tất cả các quyền
                const adminData = {
                    user: {
                        id: 1,
                        email: "admin@gmail.com",
                        name: "Administrator",
                        role: "ADMIN",
                        permissions: [
                            "VIEW_DASHBOARD",
                            "MANAGE_USERS",
                            "MANAGE_DRIVERS",
                            "MANAGE_STUDENTS",
                            "MANAGE_BUSES",
                            "MANAGE_ROUTES",
                            "MANAGE_STOPS",
                            "MANAGE_SCHEDULES",
                            "VIEW_TRACKING",
                            "MANAGE_NOTIFICATIONS",
                            "VIEW_CHAT",
                            "MANAGE_PROFILE",
                            "VIEW_REPORTS",
                            "SYSTEM_SETTINGS"
                        ],
                        avatar: null,
                        phone: "0123456789",
                        createdAt: new Date().toISOString()
                    },
                    accessToken: "mock-admin-access-token-" + Date.now(),
                    refreshToken: "mock-admin-refresh-token-" + Date.now()
                };
                
                // Lưu thông tin admin vào auth store
                setAuth(adminData);
                
                // Lưu trạng thái đăng nhập (vd: localStorage)
                localStorage.setItem("isLoggedIn", "true");
                
                console.log("✅ Đăng nhập admin thành công với quyền:", adminData.user.permissions);
                
                navigate("/dashboard");
            } else {
                alert("Sai tài khoản hoặc mật khẩu!");
                setIsLoading(false);
            }
        }, 800);
    };

    const [showPassword, setShowPassword]= useState(false);
   return (
      <>        
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo-wrapper">
                        <img src="/bus-logo.svg" alt="Bus Logo" className="login-logo" />
                    </div>
                    <h2 className='login-title'>Chào Mừng Trở Lại!</h2>
                    <p className="login-subtitle">Đăng nhập vào Hệ Thống Theo Dõi Xe Buýt</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">
                            <Mail className="label-icon" />
                            Địa chỉ Email
                        </label>
                        <input  id="email"
                                type="email" 
                                autoComplete='email' 
                                    placeholder='Nhập email của bạn'
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="password" className="input-label">
                            <Lock className="label-icon" />
                            Mật khẩu
                        </label>
                        <div className="password-input-wrapper">
                            <input id='password' 
                                   type={showPassword ? "text" : "password"} 
                                   placeholder='Nhập mật khẩu của bạn'
                                   className="input password-input"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required />
                            {/* Show mật khẩu */}
                            <button type='button' 
                                    className='password-toggle' 
                                    onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className='password-icon' /> : <Eye className='password-icon'/> }
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" className="checkbox" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                    </div>

                    <button type='submit'
                            className='btn-primary'
                            disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Đang đăng nhập...
                            </>
                        ) : (
                            <>
                                <LogIn className="btn-icon" />
                                Đăng nhập        
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
      </>
   )
};