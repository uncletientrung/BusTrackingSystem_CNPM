import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react"; // Thư viện Icon trạng thái đăng nhập, xuất
import { Link, useNavigate } from "react-router-dom"; // Thư viện Thẻ link
import { useEffect, useState } from "react";
// import { auth } from '../../hooks/auth'
import "./LoginPage.css";
import { AccountAPI } from "../../api/apiServices";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccount] = useState([]);
  const navigate = useNavigate();
  // const { setAuth } = auth(); // Lấy hàm setAuth từ auth hook

  // Lấy toàn bộ tài khoản từ API
  useEffect(() => {
    AccountAPI.getAllAccount()
      .then((listAccount) => {
        setAccount(listAccount);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập đăng nhập lâu
    setTimeout(() => {
      const user = accounts.find(
        (acc) => acc.tendangnhap == username && acc.matkhau == password
      );
      if (user) {
        sessionStorage.setItem("currentUser", JSON.stringify(user)); //lưu toàn bộ thông tin user, bao gồm quyền
        sessionStorage.setItem("isLoggedIn", "true");
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

        if (currentUser.trangthai === 0) {
          alert("Tài khoản đã bị khóa");
          return;
        } else {
          navigate("/dashboard");
        }
      } else {
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    }, 800);

    setIsLoading(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-header">
            <div className="login-logo-wrapper">
              <img src="/bus-logo.svg" alt="Bus Logo" className="login-logo" />
            </div>
            <h2 className="login-title">Chào Mừng Trở Lại!</h2>
            <p className="login-subtitle">
              Đăng nhập vào Hệ Thống Theo Dõi Xe Buýt
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                <Mail className="label-icon" />
                Tên đăng nhập
              </label>
              <input
                id="email"
                type="text"
                autoComplete="email"
                placeholder="Nhập email của bạn"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                <Lock className="label-icon" />
                Mật khẩu
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  className="input password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Show mật khẩu */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="password-icon" />
                  ) : (
                    <Eye className="password-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" className="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
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
  );
}
