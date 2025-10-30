import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch('password');

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Xử lý gửi dữ liệu đăng ký ở đây
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="register-header text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              <img src="/bus-logo.svg" alt="Bus Logo" style={{ width: "3rem", height: "3rem" }} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Tạo tài khoản của bạn</h2>
            <p className="text-sm text-gray-600">Hệ Thống Theo Dõi Xe Buýt</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 register-form">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Họ</label>
                  <input
                    id="firstName"
                    type="text"
                    {...register("firstName", {
                      required: "Họ là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ phải có ít nhất 2 ký tự"
                      }
                    })}
                    className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Họ"
                  />
                  {/* Chưa xử lý error ở đây */}
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Tên</label>
                  <input
                    id="lastName"
                    type="text"
                    {...register("lastName", {
                      required: "Tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Tên phải có ít nhất 2 ký tự"
                      }
                    })}
                    className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Tên"
                  />
                  {/* Chưa xử lý error ở đây */}
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Địa chỉ email không hợp lệ"
                    }
                  })}
                  className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Địa chỉ Email"
                />
                {/* Chưa xử lý error ở đây */}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    pattern: {
                      value: /^[+]?[\d\s\-()]+$/,
                      message: "Định dạng số điện thoại không hợp lệ"
                    }
                  })}
                  className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Số điện thoại"
                />
                {/* Chưa xử lý error ở đây */}
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                  id="role"
                  {...register("role")}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="parent">Phụ huynh</option>
                  <option value="driver">Tài xế</option>
                </select>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                  className={`mt-1 w-full rounded-md border p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {/* Chưa xử lý error ở đây */}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: value => value === password || "Mật khẩu không khớp"
                  })}
                  className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Xác nhận mật khẩu"
                />
                {/* Chưa xử lý error ở đây */}
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center items-center py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
