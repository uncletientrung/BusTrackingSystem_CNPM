import { Bus, RouteIcon, Users, } from "lucide-react";
import { getRoleFromMaNq } from "../../utils/AccountRole";
import { BusAPI, RouteAPI, StudentAPI, ScheduleAPI, } from "../../api/apiServices";
import { useEffect, useState } from "react";
import Imgbus1 from "../../assets/screenHeader.jpg";
import Imgbus2 from "../../assets/sidebar.jpg";
import Imgbus3 from "../../assets/6.jpg";

const headerImages = [Imgbus1, Imgbus2, Imgbus3];
export default function DashboardPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % headerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [listBus, listRoute, listStudent, listSchedule] = await Promise.all([
          BusAPI.getAllBus(),
          RouteAPI.getAllRoute(),
          StudentAPI.getAllStudent(),
          ScheduleAPI.getAllSchedule(),
        ]);
        setBuses(listBus);
        setRoutes(listRoute);
        setStudents(listStudent);
        setSchedules(listSchedule);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    })();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 17) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <>
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-8 border-4 border-yellow-500">
        {headerImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentImgIndex === index ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",      // QUAN TRỌNG NHẤT: đổi từ "center 65%" → "center"
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-5xl font-bold drop-shadow-2xl mb-2">
            {getGreeting()}, {currentUser?.tendangnhap || "Bạn"}!
          </h1>
        </div>

        <div className="absolute top-4 right-6 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-400">
          <p className="text-yellow-300 font-bold text-lg">
            Welcome to the Smart School Bus Tracking System
          </p>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {headerImages.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${currentImgIndex === index ? "w-8 bg-yellow-400" : "w-2 bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {getRoleFromMaNq(currentUser.manq) === "admin" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng số xe</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{buses.length}</p>
                  </div>
                  <Bus className="h-12 w-12 text-blue-600 opacity-80" />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {buses.filter(b => b.trangthai === 1).length} đang chạy •{" "}
                  {buses.filter(b => b.trangthai !== 1).length} dừng hoạt động
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tuyến đường</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{routes.length}</p>
                  </div>
                  <RouteIcon className="h-12 w-12 text-green-600 opacity-80" />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {routes.filter(r => r.trangthai === 1).length} hoạt động
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Học sinh</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-purple-600 opacity-80" />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {students.filter(s => s.trangthai === 1).length} đang đi học
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Điều hành vận tải hôm nay</h3>
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">
                  {schedules.filter(s => new Date(s.thoigianbatdau).toDateString() === new Date().toDateString()).length}
                </p>
                <p className="text-xl text-gray-600 mt-2">lịch trình đang diễn ra</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}