import { useState, useEffect } from "react";
import { Calendar, CirclePlus, RefreshCcw, BusFront, CircleCheck, Hourglass, AlertTriangle, CalendarCheck, SquarePen, Eye, Trash2 } from "lucide-react";
import ScheduleModal from "../Schedule/ScheduleModal";
import ScheduleDetail from "../Schedule/ScheduleDetail";
import ScheduleStudentSelector from "../../components/Schedule/ScheduleStudentSelector";
import { BusAPI, RouteAPI, ScheduleAPI, UserAPI } from "../../api/apiServices";
import toLocalString from "../../utils/DateFormated";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const ngay1 = new Date();
  ngay1.setDate(1);
  const [selectedDate, setSelectedDate] = useState(ngay1.toISOString().split('T')[0]);
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date().toISOString().split('T')[0]);
  // Lấy ngày giờ của Date, chuyển thành ISO là "2025-10-10T16:53:02.123Z", cắt từ T thành 2 item, lấy yyyy/MM/dd
  const [selectedRoute, setSelectedRoute] = useState("-1");

  const [users, setUsers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  // Các trạng thái
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sch, usr, rt, bs] = await Promise.all([
          ScheduleAPI.getAllSchedule(),
          UserAPI.getAllUsers(),
          RouteAPI.getAllRoute(),
          BusAPI.getAllBus()
        ]);
        setSchedules(sch);
        setUsers(usr);
        setRoutes(rt);
        setBuses(bs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...schedules];

    if (selectedDate && selectedDateEnd) {
      const dStart = new Date(selectedDate);
      const dEnd = new Date(selectedDateEnd);
      if (dStart > dEnd) {
        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc")
      } else {
        filtered = filtered.filter(s => {
          if (!s.thoigianbatdau) return false;
          const ngaykhoihanh = new Date(s.thoigianbatdau);
          return (
            ngaykhoihanh.getTime() >= dStart.getTime() &&
            ngaykhoihanh.getTime() <= dEnd.getTime()
          );
        });
      }

    }

    if (selectedRoute !== "-1") {
      filtered = filtered.filter(s => s.matd === parseInt(selectedRoute));
    }

    setFilteredSchedules(filtered);
  }, [selectedDate, selectedRoute, schedules, selectedDateEnd]);

  const getStatusColor = (status) => {
    const map = {
      3: 'bg-green-100 text-green-800', 2: 'bg-blue-100 text-blue-800',
      1: 'bg-yellow-100 text-yellow-800', 0: 'bg-red-100 text-red-800',
      '-1': 'bg-gray-100 text-gray-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const map = { 3: 'Hoàn thành', 2: 'Đang chạy', 1: 'Đã lên lịch', 0: 'Hủy bỏ', '-1': 'Trễ giờ' };
    return map[status] || status;
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailOpen(true);
  };

  const handleSave = (scheduleData) => {
    console.log(scheduleData);

  }

  const handleRefresh = () => window.location.reload();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch trình</h1>
          </div>
          <button
            onClick={handleAddSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <CirclePlus className="h-5 w-5" />
            Tạo lịch trình mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg"><BusFront className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng chuyến</p>
              <p className="text-2xl font-bold">{filteredSchedules.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-green-500 rounded-lg"><CircleCheck className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
              <p className="text-2xl font-bold">{filteredSchedules.filter(s => s.trangthai === 3).length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-orange-400 rounded-lg"><Hourglass className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đang chạy</p>
              <p className="text-2xl font-bold">{filteredSchedules.filter(s => s.trangthai === 2).length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-red-500 rounded-lg"><AlertTriangle className="h-6 w-6 text-white" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Trễ giờ</p>
              <p className="text-2xl font-bold">{filteredSchedules.filter(s => s.trangthai === -1).length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={selectedDateEnd}
                onChange={(e) => setSelectedDateEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuyến đường</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="-1">Tất cả tuyến</option>
                {routes.map(r => (
                  <option key={r.matd} value={r.matd}>{r.tentuyen}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRefresh}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <RefreshCcw className="h-5 w-5" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* bảng */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe buýt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuyến đường</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khởi hành</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến nơi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tài xế</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành khách</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((item) => {
                  const bus = buses.find(bus => bus.maxe === item.maxe) || "Không tìm thấy";
                  const route = routes.find(route => route.matd === item.matd) || "Không tìm thấy";
                  const user = users.find(user => user.mand === item.matx) || "Không tìm thấy";

                  return (
                    <tr key={item.malt} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              <BusFront></BusFront>
                            </span>
                          </div>

                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {bus.bienso}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {route.tentuyen}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{toLocalString(item.thoigianbatdau)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{toLocalString(item.thoigianketthuc)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.hoten}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.tonghocsinh}/{bus.soghe || 999}
                        </div>

                        {/* Thanh Progress */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.tonghocsinh / bus.soghe || 999) * 100}%` }}
                          >
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap"> {/* Màu trạng thái */}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.trangthai)}`}>
                          {getStatusText(item.trangthai)}
                        </span>
                      </td>

                      {/* Thanh hành động */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Xem số học sinh"
                          >
                            <Eye className="h-4 w-4"></Eye>
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Sửa lịch trình"
                          >
                            <SquarePen className="h-4 w-4"></SquarePen>
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Xóa lịch trình">
                            <Trash2 className="h-4 w-4"></Trash2>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <CalendarCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Không có lịch trình nào</p>
                <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Tạo lịch trình mới
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ScheduleModal
          isOpen={isCreateModalOpen || isEditModalOpen}
          schedule={editingSchedule}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSchedule(null);
          }}
          onSave={handleSave}
          routes={routes}
          buses={buses}
          drivers={users.filter(u => u.manq === 2)} // Tài xế
          isStudentSelectorOpen={isStudentSelectorOpen}
          setIsStudentSelectorOpen={setIsStudentSelectorOpen}
          onSuccess={() => window.location.reload()} // reload tạm, bạn có thể cải thiện bằng refetch
        />
      )}

      <ScheduleDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        schedule={selectedSchedule}
        routes={routes}
        buses={buses}
        users={users}
      />

      <ScheduleStudentSelector
        selectedStudents={isEditModalOpen ? editingSchedule?.students : []}
        onStudentsChange={(students) => {
          if (isEditModalOpen && editingSchedule) {
            setEditingSchedule({ ...editingSchedule, students });
          }
        }}
        isOpen={isStudentSelectorOpen}
        onClose={() => setIsStudentSelectorOpen(false)}
      />
    </>
  );
}