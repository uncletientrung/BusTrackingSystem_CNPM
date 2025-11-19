import { X } from "lucide-react";
import toLocalString from "../../utils/DateFormated";
import { useEffect, useState } from "react";
import { CTScheduleAPI, StopAPI, StudentAPI } from "../../api/apiServices";

export default function ScheduleDetail({ onClose, schedule, routes, buses, users }) {

  const route = routes.find(r => r.matd === schedule.matd) || {};
  const bus = buses.find(b => b.maxe === schedule.maxe) || {};
  const driver = users.find(u => u.mand === schedule.matx) || {};
  const [DSHocSinhTrongLT, setDSHocSinhTrongLT] = useState([]);
  const [stops, setStops] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const [listSTD, listCTLT, listStop] = await Promise.all([StudentAPI.getAllStudent(),
        CTScheduleAPI.getCTLTById(schedule.malt), StopAPI.getAllStops()]);
        const result = listSTD.filter(std => listCTLT.some(ct => ct.mahs == std.mahs));
        setDSHocSinhTrongLT(result);
        setStops(listStop);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ở ModalDetail lịch trình:", error);
      }
    })();
  }, [schedule.malt])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b px-8 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Chi tiết lịch trình - Mã:<span className="text-blue-600">SCH-{schedule.malt}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Tài xế</p>
              <p className="text-1xl font-bold text-blue-600">{driver.hoten}</p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Biển số xe</p>
              <p className="text-1xl font-bold text-blue-600">{bus.bienso || "Chưa có"}</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Tuyến đướng</p>
              <p className="text-1xl font-bold text-blue-600">{route.tentuyen || "Chưa có"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Giờ khởi hành</p>
              <p className="text-1xl font-bold text-black-600">
                {toLocalString(schedule.thoigianbatdau)}
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Giờ dự kiến đến</p>
              <p className="text-1xl font-bold text-black-600">
                {toLocalString(schedule.thoigianketthuc)}
              </p>
            </div>
          </div>

          {/* Danh sách học sinh */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách học sinh ({DSHocSinhTrongLT.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-5 py-3 text-sm font-medium text-gray-700">Mã HS</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-700">Họ tên</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-700">Lớp</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-700">Điểm đón/trả</th>
                  </tr>
                </thead>
                <tbody>
                  {DSHocSinhTrongLT.map((std) => {
                    const diemdon = stops.find(stop => stop.madd == std.diemdon);
                    const diemtra = stops.find(stop => stop.madd == std.diemdung);
                    return (
                      <tr key={std.mahs} className="border-b hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm">{std.mahs}</td>
                        <td className="px-5 py-4 font-medium">{std.hoten}</td>
                        <td className="px-5 py-4 font-medium ">{std.lop}</td>
                        <td className="px-5 py-4 font-medium ">
                          <span>Điểm đón: {diemdon.tendiemdung}</span> <br />
                          <span>Điểm trả: {diemtra.tendiemdung}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t px-8 py-5">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}