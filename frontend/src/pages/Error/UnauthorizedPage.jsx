import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Không có quyền truy cập
            </h2>
            <p className="mt-4 text-gray-600">
              Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="group relative flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  )
};