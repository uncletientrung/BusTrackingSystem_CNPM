import { useState, useEffect } from "react"
import { AlertTriangle, BusFront, CalendarCheck, CheckCircle, CircleCheck, CirclePlus, Hourglass, RefreshCcw, SquarePen, Trash2, UserPlus, Users, X } from "lucide-react"
import ScheduleStudentSelector from "../../components/Schedule/ScheduleStudentSelector"


export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  //    // Lấy ngày giờ của Date, chuyển thành ISO là "2025-10-10T16:53:02.123Z", cắt từ T thành 2 item, lấy yyyy/MM/dd
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [lichTrinh, setLichTrinh] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    busNumber: '', // Mã số xe
    route: '',      // Tuyến
    departureTime: '', // Giờ khởi hành
    arrivalTime: '', // Giờ cập bến
    driverId: '',   // Mã tài xế
    status: 'scheduled',
    students: []    // Danh sách học sinh
  });
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false); // Modal chọn học sinh
  const [editingScheduleId, setEditingScheduleId] = useState(null); // ID lịch trình đang sửa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang sửa
  const [editingSchedule, setEditingSchedule] = useState(null); // Dữ liệu lịch trình đang sửa
  const [isViewingStudents, setIsViewingStudents] = useState(false); // Trạng thái xem số học sinh
  const [selectedScheduleForStudents, setSelectedScheduleForStudents] = useState(null); // Lịch trình được chọn để xem học sinh

  // Giả lập dữ liệu
  const demoRoutes = [
    { id: 1, name: 'Bến Thành - Sân Bay', code: 'BT-SB' },
    { id: 2, name: 'Quận 1 - Quận 7', code: 'Q1-Q7' },
    { id: 3, name: 'Thủ Đức - Quận 3', code: 'TD-Q3' }
  ];

  const demoBuses = [
    { id: 1, number: 'BUS-001', capacity: 40, status: 'active' },
    { id: 2, number: 'BUS-002', capacity: 35, status: 'active' },
    { id: 3, number: 'BUS-003', capacity: 45, status: 'maintenance' }
  ];

  const demoDrivers = [
    { id: 1, name: 'Nguyễn Văn A', license: 'B2-123456', phone: '0901234567' },
    { id: 2, name: 'Trần Văn B', license: 'B2-789012', phone: '0907654321' },
    { id: 3, name: 'Lê Văn C', license: 'B2-345678', phone: '0903456789' }
  ];

  // Giả lập dữ liệu học sinh theo tuyến
  const demoStudentsData = [
    { id: 1, name: 'Nguyễn Văn A', studentCode: 'HS001', class: '10A1', routeId: 1, routeName: 'Bến Thành - Sân Bay' },
    { id: 2, name: 'Trần Thị B', studentCode: 'HS002', class: '10A2', routeId: 1, routeName: 'Bến Thành - Sân Bay' },
    { id: 3, name: 'Lê Văn C', studentCode: 'HS003', class: '11A1', routeId: 1, routeName: 'Bến Thành - Sân Bay' },
    { id: 4, name: 'Phạm Thị D', studentCode: 'HS004', class: '10A1', routeId: 2, routeName: 'Quận 1 - Quận 7' },
    { id: 5, name: 'Hoàng Văn E', studentCode: 'HS005', class: '11A2', routeId: 2, routeName: 'Quận 1 - Quận 7' },
    { id: 6, name: 'Vũ Thị F', studentCode: 'HS006', class: '12A1', routeId: 3, routeName: 'Thủ Đức - Quận 3' },
  ];

  //     // Giả lập lịch trình
  useEffect(() => {
    const demoSchedules = [
      {
        id: 1,
        busNumber: 'BUS-001',
        route: 'Bến Thành - Sân Bay',
        departureTime: '06:00',
        arrivalTime: '07:30',
        driver: 'Nguyễn Văn A',
        status: 'running',
        passengers: 25, // Hành khách
        capacity: 40, // Sức chứa
        date: selectedDate
      },
      {
        id: 2,
        busNumber: 'BUS-002',
        route: 'Quận 1 - Quận 7',
        departureTime: '07:00',
        arrivalTime: '08:45',
        driver: 'Trần Văn B',
        status: 'scheduled',
        passengers: 0,
        capacity: 35,
        date: selectedDate
      },
      {
        id: 3,
        busNumber: 'BUS-001',
        route: 'Bến Thành - Sân Bay',
        departureTime: '08:30',
        arrivalTime: '10:00',
        driver: 'Nguyễn Văn A',
        status: 'completed',
        passengers: 38,
        capacity: 40,
        date: selectedDate
      },
      {
        id: 4,
        busNumber: 'BUS-003',
        route: 'Thủ Đức - Quận 3',
        departureTime: '09:15',
        arrivalTime: '11:00',
        driver: 'Lê Văn C',
        status: 'delayed',
        passengers: 20,
        capacity: 45,
        date: selectedDate
      }
    ];

    const filtered = selectedRoute === 'all' // Bộ lọc
      ? demoSchedules
      : demoSchedules.filter(s => s.route.includes(selectedRoute));
    setLichTrinh(filtered);
  }, [selectedDate, selectedRoute]);

  const getStatusColor = (status) => { // Màu trạng thái
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => { // Chuyển đổi text trạng thái
    switch (status) {
      case 'running': return 'Đang chạy';
      case 'completed': return 'Hoàn thành';
      case 'scheduled': return 'Đã lên lịch';
      case 'delayed': return 'Trễ giờ';
      case 'cancelled': return 'Hủy bỏ';
      default: return status;
    }
  };

  //
  const handleCreateSchedule = () => {
    if (!newSchedule.busNumber || !newSchedule.route || !newSchedule.departureTime) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const schedule = {
      id: lichTrinh.length + 1,
      ...newSchedule,
      driver: demoDrivers.find(d => d.id.toString() === newSchedule.driverId)?.name || 'Chưa phân công',
      passengers: 0,
      capacity: demoBuses.find(b => b.number === newSchedule.busNumber)?.capacity || 40,
      date: selectedDate
    };

    setLichTrinh([...lichTrinh, schedule]);
    setNewSchedule({
      busNumber: '',
      route: '',
      departureTime: '',
      arrivalTime: '',
      driverId: '',
      status: 'scheduled'
    });
    setIsCreating(false);
    alert('Đã tạo lịch trình mới thành công!');
  };

  // Hàm mở modal sửa lịch trình
  const handleEditSchedule = (schedule) => {
    const driverId = demoDrivers.find(d => d.name === schedule.driver)?.id || '';
    setEditingSchedule({
      id: schedule.id,
      busNumber: schedule.busNumber,
      route: schedule.route,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      driverId: driverId.toString(),
      status: schedule.status,
      students: schedule.students || []
    });
    setIsEditing(true);
  };

  // Hàm cập nhật lịch trình
  const handleUpdateSchedule = () => {
    if (!editingSchedule.busNumber || !editingSchedule.route || !editingSchedule.departureTime) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const updatedSchedules = lichTrinh.map((schedule) => {
      if (schedule.id === editingSchedule.id) {
        return {
          ...schedule,
          busNumber: editingSchedule.busNumber,
          route: editingSchedule.route,
          departureTime: editingSchedule.departureTime,
          arrivalTime: editingSchedule.arrivalTime,
          driver: demoDrivers.find(d => d.id.toString() === editingSchedule.driverId)?.name || 'Chưa phân công',
          status: editingSchedule.status,
          capacity: demoBuses.find(b => b.number === editingSchedule.busNumber)?.capacity || 40,
          students: editingSchedule.students
        };
      }
      return schedule;
    });

    setLichTrinh(updatedSchedules);
    setIsEditing(false);
    setEditingSchedule(null);
    alert('Cập nhật lịch trình thành công!');
  };

  // Hàm lấy số học sinh theo tuyến
  const getStudentCountByRoute = (routeName) => {
    return demoStudentsData.filter(student => student.routeName === routeName).length;
  };

  // Hàm xem số học sinh trên tuyến
  const handleViewStudents = (schedule) => {
    setSelectedScheduleForStudents(schedule);
    setIsViewingStudents(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <span>
                <CalendarCheck className="h-10 w-10 text-red-500" />
              </span>
              <span>Quản lý lịch trình</span>
            </h1>
          </div>

          {/* Chưa thêm Action */}
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >

            <span>
              <CirclePlus className="h-5 w-5 text-white" />
            </span>
            <span>Tạo lịch trình mới</span>
          </button>
        </div>



        {/* Lọc nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Lọc số bus */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">
                  <BusFront />
                </span>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng chuyến</p>
                <p className="text-2xl font-bold text-gray-900">{lichTrinh.length}</p>
              </div>
            </div>
          </div>

          {/* Lọc hoàn thành */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">
                  <CircleCheck />
                </span>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lichTrinh.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          {/* Lọc đang chạy*/}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">
                  <Hourglass></Hourglass>
                </span>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đang chạy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lichTrinh.filter(s => s.status === 'running').length}
                </p>
              </div>
            </div>
          </div>

          {/* Lọc trễ giờ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">
                  <AlertTriangle></AlertTriangle>
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Trễ giờ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lichTrinh.filter(s => s.status === 'delayed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div> {/* CBB ngày */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày
              </label>
              <input type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2
                                                focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div> {/* CBB tuyến đường */}
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuyến đường</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2
                                                focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả tuyến</option>
                {demoRoutes.map((route) => (
                  <option key={route.id} value={route.code}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end"> {/* Nút làm mới */}
              <button
                onClick={() => window.location.reload() /*Reload lại trang hàm JS */}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg 
                                        font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>
                  <RefreshCcw className="h-5 w-5 text-white" />
                </span>
                <span>Làm mới</span>

              </button>
            </div>
          </div>
        </div>

        {/* Danh sách lịch trình */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách lịch trình</h3>
            <p className="text-sm text-gray-600">
              Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <div className="overflow-x-auto"> {/* Tạo row và col của Table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe buýt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tuyến đường
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giờ khởi hành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giờ đến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tài xế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành khách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>

              {/* Thêm dữ liệu vào table */}
              <tbody className="bg-white divide-y divide-gray-200">
                {lichTrinh.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            <BusFront></BusFront>
                          </span>
                        </div>

                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {item.busNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.route}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.departureTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.arrivalTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.driver}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.passengers}/{item.capacity}
                      </div>

                      {/* Thanh Progress */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.passengers / item.capacity) * 100}%` }}
                        >
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap"> {/* Màu trạng thái */}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>

                    {/* Thanh hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewStudents(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-xs flex items-center space-x-1"
                          title="Xem số học sinh"
                        >
                          <Users className="h-4 w-4" />
                          <span>Học sinh</span>
                        </button>
                        <button 
                          onClick={() => handleEditSchedule(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Sửa lịch trình"
                        >
                          <SquarePen></SquarePen>
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Xóa lịch trình">
                          <Trash2></Trash2>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Thông báo không có lịch trình */}
            {lichTrinh.length == 0 && (
              <div className="text-center py-12">
                <div className="flex justify-center items-center">
                  <CalendarCheck className="h-10 w-10 text-black-500 " />
                </div>
                <p className="text-gray-500 text-lg mt-4">Không có lịch trình nào cho ngày đã chọn</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Tạo lịch trình mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tạo Dialog thêm lịch trình */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tạo lịch trình mới</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X></X>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xe buýt</label>
                  <select
                    value={newSchedule.busNumber}
                    onChange={(e) => setNewSchedule({ ...newSchedule, busNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn xe buýt</option>
                    {demoBuses.filter(bus => bus.status === 'active').map((bus) => (
                      <option key={bus.id} value={bus.number}>
                        {bus.number} (Sức chứa: {bus.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến đường</label>
                  <select
                    value={newSchedule.route}
                    onChange={(e) => setNewSchedule({ ...newSchedule, route: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn tuyến đường</option>
                    {demoRoutes.map((route) => (
                      <option key={route.id} value={route.name}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khởi hành</label>
                    <input
                      type="time"
                      value={newSchedule.departureTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, departureTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đến</label>
                    <input
                      type="time"
                      value={newSchedule.arrivalTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, arrivalTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế</label>
                  <select
                    value={newSchedule.driverId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, driverId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn tài xế</option>
                    {demoDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.license}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Danh sách học sinh */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Học sinh trên chuyến
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsStudentSelectorOpen(true)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <UserPlus className="h-4 w-4" />
                      Thêm học sinh
                    </button>
                  </div>

                  {newSchedule.students && newSchedule.students.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                      <div className="text-sm text-gray-600 mb-2">
                        Đã chọn: <strong className="text-primary-600">{newSchedule.students.length}</strong> học sinh
                      </div>
                      {newSchedule.students.map((student) => (
                        <div
                          key={student.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.studentCode} • {student.class}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSchedule({
                                ...newSchedule,
                                students: newSchedule.students.filter(s => s.id !== student.id)
                              });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Chưa có học sinh nào</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Thêm học sinh" để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button

                  onClick={handleCreateSchedule}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Tạo lịch trình
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal sửa lịch trình */}
        {isEditing && editingSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sửa lịch trình</h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingSchedule(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xe buýt</label>
                  <select
                    value={editingSchedule.busNumber}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, busNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn xe buýt</option>
                    {demoBuses.filter(bus => bus.status === 'active').map((bus) => (
                      <option key={bus.id} value={bus.number}>
                        {bus.number} (Sức chứa: {bus.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến đường</label>
                  <select
                    value={editingSchedule.route}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, route: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn tuyến đường</option>
                    {demoRoutes.map((route) => (
                      <option key={route.id} value={route.name}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khởi hành</label>
                    <input
                      type="time"
                      value={editingSchedule.departureTime}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, departureTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đến</label>
                    <input
                      type="time"
                      value={editingSchedule.arrivalTime}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, arrivalTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế</label>
                  <select
                    value={editingSchedule.driverId}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, driverId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn tài xế</option>
                    {demoDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.license}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={editingSchedule.status}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="running">Đang chạy</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="delayed">Trễ giờ</option>
                    <option value="cancelled">Hủy bỏ</option>
                  </select>
                </div>

                {/* Danh sách học sinh */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Học sinh trên chuyến
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsStudentSelectorOpen(true)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <UserPlus className="h-4 w-4" />
                      Thêm học sinh
                    </button>
                  </div>

                  {editingSchedule.students && editingSchedule.students.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                      <div className="text-sm text-gray-600 mb-2">
                        Đã chọn: <strong className="text-blue-600">{editingSchedule.students.length}</strong> học sinh
                      </div>
                      {editingSchedule.students.map((student) => (
                        <div
                          key={student.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">
                                {student.studentCode} • {student.class}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSchedule({
                                ...editingSchedule,
                                students: editingSchedule.students.filter(s => s.id !== student.id)
                              });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Chưa có học sinh nào</p>
                      <p className="text-sm text-gray-400 mt-1">Click "Thêm học sinh" để bắt đầu</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingSchedule(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xem số học sinh */}
        {isViewingStudents && selectedScheduleForStudents && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Thông tin học sinh</span>
                </h3>
                <button
                  onClick={() => {
                    setIsViewingStudents(false);
                    setSelectedScheduleForStudents(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tuyến</p>
                      <p className="text-lg font-bold text-gray-900">{selectedScheduleForStudents.route}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Số học sinh</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {getStudentCountByRoute(selectedScheduleForStudents.route)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Chi tiết:</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Xe buýt:</span>
                      <span className="font-medium text-gray-900">{selectedScheduleForStudents.busNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giờ khởi hành:</span>
                      <span className="font-medium text-gray-900">{selectedScheduleForStudents.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tài xế:</span>
                      <span className="font-medium text-gray-900">{selectedScheduleForStudents.driver}</span>
                    </div>
                  </div>
                </div>

                {/* Hiển thị danh sách học sinh */}
                <div className="max-h-60 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">Danh sách học sinh:</p>
                  <div className="space-y-2">
                    {demoStudentsData
                      .filter(student => student.routeName === selectedScheduleForStudents.route)
                      .map((student) => (
                        <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              {student.studentCode} • {student.class}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsViewingStudents(false);
                    setSelectedScheduleForStudents(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Selector Modal */}
        <ScheduleStudentSelector
          selectedStudents={isEditing ? editingSchedule?.students : newSchedule.students}
          onStudentsChange={(students) => {
            if (isEditing) {
              setEditingSchedule({ ...editingSchedule, students });
            } else {
              setNewSchedule({ ...newSchedule, students });
            }
          }}
          isOpen={isStudentSelectorOpen}
          onClose={() => setIsStudentSelectorOpen(false)}
        />
      </div>
    </>
  )
};