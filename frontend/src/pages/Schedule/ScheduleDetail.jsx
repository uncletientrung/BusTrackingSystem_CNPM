import { X, Users, BusFront } from "lucide-react";

const demoStudents = [
  { id: 1, name: "Nguyễn Văn A", studentCode: "HS001", class: "10A1" },
  { id: 2, name: "Trần Thị B", studentCode: "HS002", class: "10A2" },
];

export default function ScheduleDetail({ isOpen, onClose, schedule, routes = [], buses = [], users = [] }) {
  if (!isOpen || !schedule) return null;

  const route = routes.find(r => r.matd === schedule.matd) || {};
  const bus = buses.find(b => b.maxe === schedule.maxe) || {};
  const driver = users.find(u => u.mand === schedule.matx) || {};

  const studentsOnRoute = demoStudents;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" /> Thông tin học sinh
          </h3>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Tuyến đường</p>
              <p className="font-bold text-lg">{route.tentuyen}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Số học sinh</p>
              <p className="text-3xl font-bold text-blue-600">{studentsOnRoute.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Xe buýt:</span><span className="font-medium">{bus.bienso}</span></div>
          <div className="flex justify-between"><span>Khởi hành:</span><span className="font-medium">{schedule.thoigianbatdau?.split('T')[1]?.slice(0, 5)}</span></div>
          <div className="flex justify-between"><span>Tài xế:</span><span className="font-medium">{driver.hoten}</span></div>
        </div>

        <div className="mt-6">
          <p className="font-medium mb-3">Danh sách học sinh:</p>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {studentsOnRoute.map(s => (
              <div key={s.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.studentCode} • {s.class}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
          Đóng
        </button>
      </div>
    </div>
  );
}