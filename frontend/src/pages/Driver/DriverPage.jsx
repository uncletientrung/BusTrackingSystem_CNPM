import {
  AlertCircle,
  Bus,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Route,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ScheduleAPI,
  StudentAPI,
  AccountAPI,
  BusAPI,
  RouteAPI,
  CTRouteAPI,
  StopAPI,
} from "../../api/apiServices";

export default function DriverPage() {
  const [schedule, setSchedule] = useState([]); // Dánh sách lịch trình
  const [currentTrip, setCurrentTrip] = useState(null); // Lịch hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái Loading

  // y tuong ban dau, lay du lieu tu backend ve, lay matk == mand lam ma tai xe, sau do duyet qua tung lich trinh, so sanh tim mand==matx co trong lich trinh, neu co thi lay tat ca du lieu lien quan
  // lam sao de biet duoc mand==matx o day? lay tu sessionStorage hien dang luu thong tin tai khoan dang dang nhap
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const driverId = currentUser ? currentUser.matk : null; // day chinh la mand, ma khi dang nhap la tai xe

  // const logBus = async (maxebus) => {
  //   try {
  //     // Lấy danh sách
  //     const buses = await BusAPI.getAllBus();

  //     // Tìm bus cần in
  //     const bus = buses.find((b) => b.maxe === maxebus);
  //     if (!bus) {
  //       console.log("Không tìm thấy xe!");
  //       return;
  //     }

  //     console.log("===== THÔNG TIN XE =====");
  //     console.log("Mã xe:", bus.maxe);
  //     console.log("Bien so:", bus.bienso);
  //     console.log("Hãng xe:", bus.hangxe);
  //   } catch (error) {
  //     console.log("Lỗi khi lấy chi tiết tuyến:", error);
  //   }
  // };
  // const logRouteDetail = async (matd) => {
  //   try {
  //     // 1. Lấy danh sách tuyến
  //     const routes = await RouteAPI.getAllRoute();

  //     // 2. Lấy chi tiết tuyến
  //     const ctRoute = await CTRouteAPI.getCTTTById(matd);

  //     // 3. Lấy danh sách điểm dừng
  //     const stops = await StopAPI.getAllStops();

  //     // Tìm tuyến cần in
  //     const route = routes.find((r) => r.matd === matd);
  //     if (!route) {
  //       console.log("Không tìm thấy tuyến đường!");
  //       return;
  //     }

  //     console.log("===== THÔNG TIN TUYẾN =====");
  //     console.log("Mã tuyến:", route.matd);
  //     console.log("Tên tuyến:", route.tentuyen);
  //     console.log("Độ dài:", route.tongquangduong + " km");

  //     if (!ctRoute || ctRoute.length === 0) {
  //       console.log("Không có chi tiết tuyến đường!");
  //       return;
  //     }

  //     // Sắp xếp theo thứ tự điểm dừng
  //     const sortedCT = ctRoute.sort((a, b) => a.thutu - b.thutu);

  //     console.log("===== CHI TIẾT ĐIỂM DỪNG =====");

  //     sortedCT.forEach((item, index) => {
  //       const stop = stops.find((s) => s.madd === item.madd);

  //       console.log(`-- Điểm ${index + 1} --`);
  //       console.log("Thứ tự:", item.thutu);
  //       console.log("Mã điểm:", item.madd);
  //       console.log("Tên điểm:", stop?.tendiemdung || "Không tìm thấy");
  //       console.log("Địa chỉ:", stop?.diachi || "Không rõ");
  //       console.log("---------------------");
  //     });
  //   } catch (error) {
  //     console.log("Lỗi khi lấy chi tiết tuyến:", error);
  //   }
  // };

  // useEffect(() => {
  //   logBus(2);
  //   logRouteDetail(1); // truyền vào mã tuyến đường muốn xem
  // }, []);

  useEffect(() => {
    const loadDriverData = async () => {
      if (!driverId) {
        console.log("Chưa đăng nhập tài xế");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // lay toanf bo lich trinh co trong db, sau do loc ra lich trinh nao cua tai xe moi dang nhap
        const allSchedules = await ScheduleAPI.getAllSchedule();
        const driverSchedules = allSchedules.filter(
          (sch) => sch.matx == driverId
        );

        if (driverSchedules.length === 0) {
          // ko lay ra dc phan tu nao, thi lich trinh bang 0
          setSchedule([]);
          setCurrentTrip(null);
          setLoading(false);
          return;
        }

        // lay danh sach xe , tuyen duong, diem dung ra
        const [buses, routes, stops] = await Promise.all([
          BusAPI.getAllBus(),
          RouteAPI.getAllRoute(),
          StopAPI.getAllStops(),
        ]);

        const busMap = Object.fromEntries(buses.map((b) => [b.maxe, b]));
        const routeMap = Object.fromEntries(routes.map((r) => [r.matd, r]));
        const stopMap = Object.fromEntries(stops.map((s) => [s.madd, s]));

        //lay ngay hom nay
        const today = new Date().toISOString().slice(0, 10);

        //loc ra cac lich trinh co thoi gian bat dau trong ngay hom nay
        const todaySchedules = driverSchedules.filter((sch) =>
          sch.thoigianbatdau.startsWith(today)
        );

        if (todaySchedules.length === 0) {
          // tai xe khong co lich hom nay
          setSchedule([]);
          setCurrentTrip(null);
          setLoading(false);
          return;
        }

        // lay ra cac bien trong ca lam viec
        const shifts = [];

        for (const sch of todaySchedules) {
          const startTime = new Date(sch.thoigianbatdau).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          const endTime = new Date(sch.thoigianketthuc).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          const isMorning = new Date(sch.thoigianbatdau).getHours() < 12;

          const bus = busMap[sch.maxe] || { bienso: "N/A", hangxe: "Xe buýt" };
          const route = routeMap[sch.matd] || {
            tentuyen: "Chưa đặt tên",
            tongquangduong: 0,
          };

          // lay cac diem dung tu chi tiet diem dung thong qua ma tuyen duong trong lich trinh
          let stopsList = [];
          try {
            const chiTietDiemDung = await CTRouteAPI.getCTTTById(sch.matd);
            const sorted = chiTietDiemDung.sort((a, b) => a.thutu - b.thutu);

            stopsList = sorted.map((ct, diemDenThu_i) => {
              const stop = stopMap[ct.madd] || {};
              const [h, m] = startTime.split(":").map(Number); //lay gio phut bat dau
              const estMins = h * 60 + m + diemDenThu_i * 15; // thoi gian uoc luong den diem dung thu i tinh tu thoi diem bat dau: doi gio bat dau ra thanh phut gio*60+phut, diemDenThu_i * 15: gia su moi diem dung cach nhau 15p
              const estH = Math.floor(estMins / 60) % 24; // thanh gio va phut
              const estMin = estMins % 60;

              return {
                id: ct.madd,
                name: stop.tendiemdung || `Điểm ${ct.thutu}`,
                time: `${estH.toString().padStart(2, "0")}:${estMin
                  .toString()
                  .padStart(2, "0")}`,
                status: "scheduled",
              };
            });
          } catch (err) {
            console.log("loi khi tai diem dung" + err);
            stopsList = [
              {
                id: 0,
                name: "Lỗi tải điểm dừng",
                time: "--:--",
                status: "scheduled",
              },
            ];
          }
          // sau khi co day du cac thong tin, bo no vo ca lam
          shifts.push({
            id: `shift-${sch.malt}`,
            type: isMorning ? "morning" : "afternoon",
            startTime,
            endTime,
            status:
              sch.trangthai === 2
                ? "in-progress"
                : sch.trangthai === 3
                ? "completed"
                : "scheduled",
            bus: {
              licensePlate: bus.bienso,
              model: bus.hangxe,
            },
            route: {
              name: route.tentuyen,
              distance: route.tongquangduong
                ? `${route.tongquangduong} km`
                : "N/A",
            },
            students: sch.tonghocsinh || 0,
            stops: stopsList,
          });
        }

        // tim chuyen hien tai dang dien ra
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes(); // lay gio va phut hien tai chuyen sang phut
        const currentShift = shifts.find((shift) => {
          const [giobd, phutbd] = shift.startTime.split(":").map(Number); //lay gio va phut cua gio bat dau cua ca truc
          const [giokt, phutkt] = shift.endTime.split(":").map(Number);
          return (
            currentMins >= giobd * 60 + phutbd &&
            currentMins <= giokt * 60 + phutkt
          ); //kiem tra coi phut hien tai co nam trong khonag thoi gian cua ca khong
        });

        // cap nhat
        setSchedule([
          {
            date: today,
            shifts,
            _uniqueKey: `${today}-${Date.now()}`,
          },
        ]);
        setCurrentTrip(currentShift || null);
      } catch (error) {
        console.error("Lỗi load dữ liệu tài xế:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDriverData();
  }, [driverId]); // khi dang nhap lai

  const getShiftTypeLabel = (type) => {
    // Lấy text dưa trên ca
    return type === "morning" ? "Ca sáng" : "Ca chiều";
  };

  const getShiftTypeColor = (type) => {
    // Lấy màu ca
    return type === "morning"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-purple-100 text-purple-800";
  };

  const getStatusColor = (status) => {
    // Lấy màu trạng thái thời gian almf
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "scheduled":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    // Lấy icon trạng thái
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "in-progress":
        return <Clock className="w-5 h-5" />;
      case "scheduled":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    // Chuyển sang trạng thái Loading
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  // neu ko co lich hom nay, thi hien giao dien khong co
  if (schedule.length === 0) {
    return (
      <>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lịch trình của tôi
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          {/* Không có lịch trình */}
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hôm nay bạn không có lịch trình
            </h2>
            <p className="text-gray-600">
              Hãy nghỉ ngơi thật tốt và sẵn sàng cho những chuyến xe tiếp theo
              nhé!
            </p>
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Nghỉ ngơi thoải mái
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // neu co lich trinh thi hien cai nay
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lịch trình của tôi
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>

        {/* Chuyến hiện tại */}
        {currentTrip && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Chuyến đang thực hiện
                </h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center">
                    <Bus className="w-4 h-4 mr-2" />
                    <span>{currentTrip.bus.licensePlate}</span>
                  </div>
                  <div className="flex items-center">
                    <Route className="w-4 h-4 mr-2" />
                    <span>{currentTrip.route.name}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getShiftTypeColor(
                    currentTrip.type
                  )}`}
                >
                  {getShiftTypeLabel(currentTrip.type)}
                </div>
                <p className="mt-2 text-blue-100">
                  {currentTrip.startTime} - {currentTrip.endTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lịch trình hằng ngày */}
        <div className="space-y-6">
          {schedule.map((day) => (
            <div key={day._uniqueKey} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {new Date(day.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {day.shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getShiftTypeColor(
                            shift.type
                          )}`}
                        >
                          {getShiftTypeLabel(shift.type)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center ${getStatusColor(
                          shift.status
                        )}`}
                      >
                        {getStatusIcon(shift.status)}
                        <span className="ml-1 text-sm font-medium">
                          {shift.status === "completed" && "Hoàn thành"}
                          {shift.status === "in-progress" && "Đang thực hiện"}
                          {shift.status === "scheduled" && "Đã lên lịch"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {shift.bus.licensePlate}
                          </p>
                          <p className="text-xs text-gray-500">
                            {shift.bus.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Route className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {shift.route.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {shift.route.distance}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {shift.students} học sinh
                          </p>
                          <p className="text-xs text-gray-500">Dự kiến</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Lộ trình:
                      </h4>
                      <div className="space-y-2">
                        {shift.stops.map((stop, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  stop.status === "completed"
                                    ? "bg-green-500"
                                    : stop.status === "in-progress"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">
                                  {stop.name}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {stop.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
