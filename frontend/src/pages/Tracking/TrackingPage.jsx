import { CircleCheck, FlagTriangleRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleMap from "../../components/Map/SimpleMap";
import { BusAPI, CTRouteAPI, CTScheduleAPI, NotificationAPI, RouteAPI, ScheduleAPI, StopAPI, StudentAPI, TrackingAPI, UserAPI } from "../../api/apiServices";

export default function TrackingPage() {
  const [selectedTrackingId, setSelectedTrackingId] = useState(0); // lịch trình được theo dõi
  const [users, setUsers] = useState([])
  const [routes, setRoutes] = useState([])
  const [schedules, setSchedule] = useState([])
  const [stops, setStops] = useState([])
  const [buses, setBuses] = useState([])
  const [students, setStudents] = useState([])
  const [dsTheoDoi, setDSTheoDoi] = useState([]) // Danh sách đầy các lịch trình có thể theo dõi
  const [selectedTracking, setSelectedTracking] = useState([]); // Danh sách đầy đủ các thông tin chi tiết
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    (async () => {
      try {
        const [listUser, listRoute, listSchedule, listStop, listBus, listStudent] = await Promise.all([
          UserAPI.getAllUsers(), RouteAPI.getAllRoute(), ScheduleAPI.getAllSchedule(), StopAPI.getAllStops(),
          BusAPI.getAllBus(), StudentAPI.getAllStudent()]);
        setUsers(listUser); setRoutes(listRoute); setSchedule(listSchedule);
        setStops(listStop); setBuses(listBus); setStudents(listStudent);

        const newDS = listSchedule.map(schedule => {
          const bus = listBus.find(b => b.maxe == schedule.maxe);
          const route = listRoute.find(r => r.matd == schedule.matd);
          const driver = listUser.find(u => u.mand == schedule.matx);
          return {
            malt: schedule.malt, matx: schedule.matx, matd: schedule.matd,
            maxe: schedule.maxe, thoigianbatdau: schedule.thoigianbatdau,
            thoigianketthuc: schedule.thoigianketthuc, tonghocsinh: schedule.tonghocsinh,
            trangthai: schedule.trangthai,
            bienso: bus.bienso,
            tentuyen: route.tentuyen,
            hoten: driver.hoten
          };
        });
        setDSTheoDoi(newDS);

      } catch (error) {
        console.error('Lỗi khi tải dữ liệu :', error);
      }
    })();
  }, []);

  const handleSelecteTracking = async (malt) => {
    setSelectedTrackingId(malt);
    const schedule = schedules.find(sch => sch.malt == malt)
    try {
      const listTracking = await TrackingAPI.getTrackingByIdLT(malt)
      const dsTrackingDayDu = listTracking.map(tracking => {
        const stop = stops.find(s => s.madd == tracking.madd);
        return {
          malt: malt,
          matd: tracking.matd, madd: tracking.madd, thutu: tracking.thutu, trangthai: tracking.trangthai,
          tendiemdung: stop.tendiemdung, vido: stop.vido, kinhdo: stop.kinhdo,
          diachi: stop.diachi,
          thoigianbatdau: schedule.thoigianbatdau, thoigianketthuc: schedule.thoigianketthuc
        }
      });
      setSelectedTracking(dsTrackingDayDu);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu chi tiết:', error);
    }
  }

  const selectedBusData = dsTheoDoi.find(tracking => tracking.malt === selectedTrackingId);

  const confirmStop = async (malt, thutu, tendiemdung, matd, madd) => {
    try {
      const CTSchedule = await CTScheduleAPI.getCTLTById(malt);  // Xử lý gửi thông báo
      const listPHTrongSchedule = students.filter(std => CTSchedule.some(ct => ct.mahs === std.mahs))
        .map(std => std.maph);
      const now = new Date().toISOString();
      const DSFormThongBao = listPHTrongSchedule.map(maph => ({
        matx: currentUser.matk,
        maph: maph,
        thoigiantao: now,
        thoigiangui: now,
        tieude: thutu == 1 ? "Bắt đầu xuất phát chuyến đi" : `Đã đến ${tendiemdung}`,
        noidung: thutu == 1 ? `Con đã được đón ở ${tendiemdung} và bắt đầu đi`
          : `Đã đến trạm ${tendiemdung}, cha mẹ chú ý đưa/ đón con mình`,
        loaithongbao: "Lịch trình",
        mucdouutien: "Bình thường",
        trangthai: 2
      }));
      if (window.confirm("Gửi thông báo này cho phụ huynh")) {
        // await NotificationAPI.insertNhieuNotification({ DSFormThongBao });
        // Xử lý cập nhật tuyến đã đến
        const updateStatus = { matd: matd, madd: madd, trangthai: 1 };
        await TrackingAPI.updateStatus(malt, updateStatus);
        setSelectedTracking(prev => prev.map(item =>
          item.matd === matd && item.madd === madd && item.malt == malt
            ? { ...item, trangthai: 1 }
            : item
        )
        );
      }

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu chi tiết:', error);
    }
  };

  const Markers = selectedTracking.map((item) => {
    const xacNhan = item.trangthai == 1;
    return {
      vido: item.vido,
      kinhdo: item.kinhdo,
      thutu: item.thutu,
      title: item.tendiemdung,
      trangthai: item.trangthai,
      diachi: item.diachi,
      thoigianbatdau: item.thoigianbatdau,
      thoigianketthuc: item.thoigianketthuc,
      popup: `
      <div style="font-family: Arial, sans-serif; min-width: 240px; padding: 4px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
          ${item.tendiemdung || 'Không có tên'}
        </h3>
        
        <div style="margin-bottom: 8px; padding: 6px 10px; background: ${xacNhan ? '#ecfdf5' : '#fffbeb'}; 
                    border-left: 4px solid ${xacNhan ? '#059669' : '#d97706'}; border-radius: 4px;">
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">
            <strong>Địa chỉ:</strong><br/>
            <span style="color: #111827;">${item.diachi}</span>
          </p>
        </div>
        <p style="
          margin: 8px 0 0;
          padding: 6px 10px;
          background: ${xacNhan ? '#059669' : '#d97706'};
          color: white;
          border-radius: 4px;
          font-weight: 600;
          text-align: center;
          font-size: 14px;
        ">
          ${xacNhan ? '✓ Đã đến' : '→ Sắp đến'}
        </p>
      </div>
    `
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary-600" />
              <span>Theo dõi xe buýt</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Chọn theo dõi:</label>
            <select
              value={selectedTrackingId}
              onChange={(e) => handleSelecteTracking(Number(e.target.value))}
              className="w-full max-w-md px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm"
              style={{ appearance: 'none' }}
            >
              <option value={0}>Chọn lịch trình theo dõi</option>
              {dsTheoDoi.map((item) => (
                <option key={item.malt} value={item.malt} className="py-3">
                  SCH-{item.malt} • TD-{item.matd}: {item.tentuyen}
                  {'\n'}• Tài xế: {item.hoten} • Biển số: {item.bienso}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedBusData && (
          <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
              <div><strong>Mã lịch:</strong> SCH-{selectedBusData.malt}</div>
              <div><strong>Mã tuyến:</strong> TD-{selectedBusData.matd}</div>
              <div><strong>Tuyến:</strong> {selectedBusData.tentuyen}</div>
              <div><strong>Tài xế:</strong> {selectedBusData.hoten}</div>
              <div><strong>Biển số:</strong> {selectedBusData.bienso}</div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
            <div className="flex-1">
              <SimpleMap
                key={selectedTrackingId}
                center={[10.8231, 106.6297]}
                zoom={13}
                markers={Markers}
                selectedTrackingId={selectedTrackingId}        // Thêm dòng này
                onArriveAtStop={confirmStop}                   // Tự động xác nhận khi xe đến gần (tùy chọn)
                className="w-full h-full rounded-b-xl"
              />
            </div>
          </div>
        </div>

        {/* Thanh thông báo */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
            <div className="p-4 bg-blue-600 text-white rounded-t-xl">
              <h1 className="text-lg font-semibold">Xác nhận điểm đến</h1>
            </div>

            <div className="p-4 bg-gray-50 border-b">
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  {selectedTracking.filter(ct => ct.trangthai == 1).length}
                </span>
                <span className="text-gray-500"> / {selectedTracking.length}</span>
                <p className="text-sm text-gray-600">
                  Điểm đã hoàn thành
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(selectedTracking.filter(ct => ct.trangthai == 1).length / selectedTracking.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedTracking.map((ct, index) => {
                const isConfirmed = ct.trangthai == 1;
                const text = (index + 1 == 1) ? "Bắt đầu chạy" : "Thông báo đã đến";
                return (
                  <div
                    key={ct.madd}
                    className={`p-4 rounded-lg border-2 transition-all ${isConfirmed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${isConfirmed ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{ct.tendiemdung}</span>
                      </div>
                    </div>

                    {!isConfirmed ? (
                      <button
                        onClick={() => confirmStop(ct.malt, ct.thutu, ct.tendiemdung, ct.matd, ct.madd)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>
                          {text}
                        </span>
                      </button>
                    ) : (
                      <div className="text-center py-2 bg-green-100 rounded-md">
                        <span className="text-green-700 font-medium text-sm">Hoàn thành</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}