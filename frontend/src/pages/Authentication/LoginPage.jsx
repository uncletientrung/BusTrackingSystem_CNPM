import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react' // Thư viện Icon trạng thái đăng nhập, xuất
import { Link, useNavigate } from 'react-router-dom' // Thư viện Thẻ link 
import { useState } from 'react'
import './LoginPage.css'  

export default function LoginPage() {
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Ngăn chặn reload lại trang khi gửi form
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            if (username === "admin@gmail.com" && password === "123") {
                // Lưu trạng thái đăng nhập (vd: localStorage)
                localStorage.setItem("isLoggedIn", "true");
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
                    <h2 className='login-title'>Welcome Back!</h2>
                    <p className="login-subtitle">Sign in to Bus Tracking System</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">
                            <Mail className="label-icon" />
                            Email Address
                        </label>
                        <input  id="email"
                                type="email" 
                                autoComplete='email' 
                                placeholder='Enter your email'
                                className="input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required />
                    </div>

                    <div className='input-group'>
                        <label htmlFor="password" className="input-label">
                            <Lock className="label-icon" />
                            Password
                        </label>
                        <div className="password-input-wrapper">
                            <input id='password' 
                                   type={showPassword ? "text" : "password"} 
                                   placeholder='Enter your password'
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
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type='submit'
                            className='btn-primary'
                            disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="btn-icon" />
                                Sign in        
                            </>
                        )}
                    </button>

                    <div className="signup-prompt">
                        Don't have an account?{' '}
                        <Link to="/register" className="signup-link">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
      </>
   )
};