import {
  Bus,
  CheckCircle,
  Clock,
  MapPin,
  RouteIcon,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { getRoleFromMaNq } from "../../utils/AccountRole";
import {
  BusAPI,
  NotificationAPI,
  RouteAPI,
  ScheduleAPI,
  StudentAPI,
} from "../../api/apiServices";
import { useEffect, useState } from "react";
import toLocalString from "../../utils/DateFormated";

export default function DashboardPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const [listBus, listRoute, listStudent, listThongbao, listSchedule] =
          await Promise.all([
            BusAPI.getAllBus(),
            RouteAPI.getAllRoute(),
            StudentAPI.getAllStudent(),
            NotificationAPI.getAllNotification(),
            ScheduleAPI.getAllSchedule(),
          ]);
        setBuses(listBus);
        setRoutes(listRoute);
        setStudents(listStudent);
        setNotifications(listThongbao);
        setSchedules(listSchedule);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    })();
  }, []);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const getGreeting = () => {
    // Trạng thái xin chào
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 17) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <>
      <div className="space-y-6">
        {/* Welcome */}
        <div
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 
                     text-white"
        >
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {currentUser.tendangnhap} {/* user*/}!
          </h1>
        </div>

        {/* Hiển thị theo quyền Admin */}
        {getRoleFromMaNq(currentUser.manq) == "admin" && (
          <>
            {/* Thống kê giả lập */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                {" "}
                {/* Thẻ Bus */}
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Bus className="h-8 w-8 text-primary-600" />
                    </div>

                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Tổng số xe
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {buses.length}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      {buses.filter((bus) => bus.trangthai === 1).length} hoạt
                      động, {buses.filter((bus) => bus.trangthai !== 1).length}{" "}
                      không hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                {" "}
                {/* Thẻ Tuyến */}
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <RouteIcon className="h-8 w-8 text-success-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Tuyến đường
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {routes.length}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      {routes.filter((route) => route.trangthai === 1).length}{" "}
                      hoạt động,{" "}
                      {routes.filter((route) => route.trangthai !== 1).length}{" "}
                      ngưng hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                {" "}
                {/* Thẻ Students */}
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Học sinh
                      </h3>
                      <p className="text-2xl font-semibold text-gray-900">
                        {students.length}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {students.filter((std) => std.trangthai === 1).length} đang
                    đi học,{" "}
                    {students.filter((std) => std.trangthai !== 1).length} tạm
                    nghỉ
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              {" "}
              {/* Panel điều hành vận tải */}
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Điều hành vận tải
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg font-semibold text-orange-600">
                      {buses.length} xe
                    </p>
                    <p className="text-sm text-orange-700">Đang hoạt động</p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-lg font-semibold text-red-600">
                      {
                        notifications.filter(
                          (noti) => noti.mucdouutien === "Cao"
                        ).length
                      }{" "}
                      thông báo
                    </p>
                    <p className="text-sm text-red-700">Cần xử lý</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">
                  Bạn có thể theo dõi và điều phối tất cả các xe buýt, quản lý
                  lịch trình và xử lý các tình huống khẩn cấp.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Hiển thị theo quyền tài xế */}
        {getRoleFromMaNq(currentUser.manq) == "driver" && (
          <div className="card">
            {" "}
            {/* Panel Lịch trình tài xế */}
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Lịch trình hôm nay
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {schedules
                  .filter((schedule) => schedule.matx === currentUser.matk)
                  .sort(
                    (a, b) =>
                      new Date(a.thoigianbatdau) - new Date(b.thoigianbatdau)
                  )
                  .map((schedule) => {
                    if (schedule.matx !== currentUser.matk) return null;
                    const date = new Date(schedule.thoigianbatdau);
                    const route = routes.find(
                      (route) => route.matd == schedule.matd
                    ).tentuyen;
                    const bus = buses.find(
                      (bus) => bus.maxe == schedule.maxe
                    ).bienso;
                    const isMorning = date.getHours() < 12;
                    const today = new Date();
                    const isToday =
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
                    if (!isToday) return null;

                    return (
                      <div key={schedule.thoigianbatdau}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isMorning ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <div>
                            <p
                              className={`font-medium ${
                                isMorning ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              {isMorning ? "Ca sáng" : "Ca chiều"} - {route}
                            </p>

                            <p
                              className={`text-sm ${
                                isMorning ? "text-blue-700" : "text-gray-600"
                              }`}
                            >
                              {
                                toLocalString(schedule.thoigianbatdau).split(
                                  " "
                                )[0]
                              }{" "}
                              -
                              {" " +
                                toLocalString(schedule.thoigianketthuc).split(
                                  " "
                                )[0]}{" "}
                              | Xe: {bus}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              isMorning
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            Đã lên lịch
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-700">
                  <strong>Lưu ý:</strong> Hãy kiểm tra xe trước khi xuất phát và
                  đảm bảo tuân thủ lịch trình.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị theo quyền Parent */}
        {getRoleFromMaNq(currentUser.manq) == "parent" && (
          <div className="card">
            {" "}
            {/* Panel Theo dõi con em */}
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin cơ bản con em trong hệ thống
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-green-900">
                        Nguyễn Minh An
                      </p>
                      <p className="text-sm text-green-700">
                        Xe 29A-12345 • Tuyến A
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">Đã lên xe</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-blue-900">
                        Nguyễn Minh Hà
                      </p>
                      <p className="text-sm text-blue-700">
                        Xe 29B-67890 • Tuyến B
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600">Đang di chuyển</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
