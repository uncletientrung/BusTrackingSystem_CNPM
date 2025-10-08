import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link } from 'react-router-dom' // Thư viện Thẻ link 
import { useState } from "react";
import "./RegisterPage.css"

export default function RegisterPage() {
   
    const [showPassword, setShowPassword]= useState(false);
   return (
      <>
        <div className="register-container">
            <div className="register-wrapper"> 
                <div className="register-header">

                    <div className="register-icon">
                        <UserPlus style={{ width: "1.5rem", height: "1.5rem"}}></UserPlus>
                    </div>
                    <h2 className="register-title"> Create your account</h2>
                    <p className="register-subtitle"> Bus Tracking System</p>
                </div>

                <form action="" className="register-form">
                    <div className="space-y-4">
                        <div className="input-grid">
                            <div>
                                <label htmlFor="firtName" className="label">First Name</label>
                                <input  id="firstName"
                                        type="text"
                                        className="input"
                                        placeholder="First Name"
                                        />
                                {/* Chưa xử lý error ở đây */}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="label">Last Name</label>
                                <input  id="lastName"
                                        type="text"
                                        className="input"
                                        placeholder="Last Name"
                                        />
                                {/* Chưa xử lý error ở đây */}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="label">Email Address</label>
                            <input  id="email"
                                    type="email"
                                    className="input"
                                    placeholder="Email Address"
                                    />
                            {/* Chưa xử lý error ở đây */}
                        </div>

                        <div>
                            <label htmlFor="phone" className="label">Phone Number</label>
                            <input  id="phone"
                                    type="tel"
                                    className="input"
                                    placeholder="Phone Number"
                                    />
                            {/* Chưa xử lý error ở đây */}
                        </div>

                        <div>
                            <label htmlFor="role" className="label">Role</label>
                            <select id="role" className="input">
                                <option value="parent">Parent</option>
                                <option value="driver">Driver</option>
                            </select>
                        </div>

                        <div className="password-wrapper">
                            <label htmlFor="password" className="label">Password</label>
                            <input  id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    placeholder="Password"
                                    />
                            <button type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="register-icon-pasword" /> : <Eye className="register-icon-pasword" /> }
                            </button>
                            {/* Chưa xử lý error ở đây */}
                        </div>
                        

                        <div className="confirmPassword-wrapper">
                            <label htmlFor="password" className="label">Password</label>
                            <input  id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    className="input"
                                    placeholder="Confirm Password"
                                    />
                            {/* Chưa xử lý error ở đây */}
                        </div>

                    </div>
                    <div>
                        <Link to="/login" className="register-link">Already have an account? Sign in</Link>
                    </div>

                    <button type="submit" className="btn-primary">
                        <>
                            <UserPlus className="register-icon-submit" /> Create account
                        </>
                    </button>
                </form>
            </div>
        </div>
      </>
   )
};