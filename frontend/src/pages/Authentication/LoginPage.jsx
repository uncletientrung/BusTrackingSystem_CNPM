import { Eye, EyeOff, LogIn } from 'lucide-react' // Thư viện Icon trạng thái đăng nhập, xuất
import { Link } from 'react-router-dom' // Thư viện Thẻ link 
import { useState } from 'react'
import './LoginPage.css'  

export default function LoginPage() {
    const [showPassword, setShowPassword]= useState(false);
   return (
      <>        
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-icon">
                        <LogIn className="w-6 h-6"></LogIn>  {/* Hình cái mũi tên vào trong */}
                       
                    </div>
                    <h2 className='login-title'>Sign in to your account</h2>
                    <p className="login-subtitle">Bus Tracking System</p>
                </div>

                <form action="" className="login-form">
                    <div className="input-group">
                        <input  id="email"
                                type="email" 
                                autoComplete='email' 
                                placeholder='Email address'
                                className="input"/>
                        {/* Chưa viết error */}
                    </div>

                    <div className='input-group password-wrapper'>
                        <input id='password' 
                               type={showPassword ? "text" : "password"} 
                               placeholder='Password'
                               className="input"
                                />
                        {/* Show mật khẩu */}
                        <button type='button' 
                                className='password-toggle' 
                                onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className='login-icon-pasword' /> : <Eye className='login-icon-pasword'/> }
                        </button>
                        {/*  Chưa viết Error */}
                    </div>

                    <div className="flex items-center justify-between">
                        <Link to="/register" className='login-link'>
                            Don't have an account? Sign up
                        </Link>
                    </div>

                    <button type='submit'
                            className='btn-primary'>
                        <LogIn className="w-4 h-4 mr-2" />Sign in        
                    </button>
                </form>
            </div>
        </div>
      </>
   )
};