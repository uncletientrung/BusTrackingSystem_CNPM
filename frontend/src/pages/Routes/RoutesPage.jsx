import { BusFront, Check, PlusCircle, RefreshCcw, RouteIcon, Search, SquarePen, Trash2, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import StopSelector from "../../components/Routes/StopSelector";
import { calculateRouteDistance, estimateTravelTime } from "../../utils/distanceCalculator";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Danh sách router sau lọc
  const [searchTerm, setSearchTerm] = useState(''); // Text Search
  const [statusFilter, setStatusFilter] = useState('all'); // Trạng thái lọc
  const [isCreating, setIsCreating] = useState(false); // Trạng thái tạo
  const [editingRoute, setEditingRoute] = useState(null); // Đối tượng sửa
  const [newRoute, setNewRoute] = useState({ // Giả lập dữ liệu ban đầu lúc tạo
    name: '',
    code: '',
    description: '',
    distance: '',
    estimatedTime: '',
    stops: [],
    status: 'active',
    fare: ''
  });
  const [availableStops, setAvailableStops] = useState([]); // Danh sách điểm dừng có sẵn

  // Demo routes data
  useEffect(() => {
    const demoRoutes = [
      {
        id: 1,
        name: 'Bến Thành - Sân Bay',
        code: 'BT-SB-01',
        description: 'Tuyến từ bến xe Bến Thành đến sân bay Tân Sơn Nhất',
        distance: '15.2 km',
        estimatedTime: '45 phút',
        stops: [
          { id: 1, name: 'Bến xe Bến Thành', order: 1, lat: 10.8231, lng: 106.6297 },
          { id: 2, name: 'Chợ Tân Định', order: 2, lat: 10.7890, lng: 106.6850 },
          { id: 3, name: 'Công viên Tao Đàn', order: 3, lat: 10.7769, lng: 106.6909 },
          { id: 4, name: 'Sân bay Tân Sơn Nhất', order: 4, lat: 10.8187, lng: 106.6519 }
        ],
        status: 'active',
        fare: '15,000 VND',
        busCount: 3,
        dailyTrips: 12,
        createdAt: '2024-01-15',
        lastUpdated: '2024-10-01'
      },
      {
        id: 2,
        name: 'Quận 1 - Quận 7',
        code: 'Q1-Q7-02',
        description: 'Tuyến kết nối trung tâm Quận 1 với Quận 7',
        distance: '18.5 km',
        estimatedTime: '60 phút',
        stops: [
          { id: 5, name: 'Nhà thờ Đức Bà', order: 1, lat: 10.7798, lng: 106.6990 },
          { id: 6, name: 'Cầu Sài Gòn', order: 2, lat: 10.7624, lng: 106.6832 },
          { id: 7, name: 'TTTM Crescent Mall', order: 3, lat: 10.7292, lng: 106.7197 }
        ],
        status: 'active',
        fare: '18,000 VND',
        busCount: 2,
        dailyTrips: 8,
        createdAt: '2024-02-10',
        lastUpdated: '2024-09-28'
      },
      {
        id: 3,
        name: 'Thủ Đức - Quận 3',
        code: 'TD-Q3-03',
        description: 'Tuyến từ Thủ Đức về trung tâm Quận 3',
        distance: '22.8 km',
        estimatedTime: '75 phút',
        stops: [
          { id: 8, name: 'ĐH Quốc gia TP.HCM', order: 1, lat: 10.8700, lng: 106.8030 },
          { id: 9, name: 'Chợ Thủ Đức', order: 2, lat: 10.8506, lng: 106.7717 },
          { id: 10, name: 'Bệnh viện Chợ Rẫy', order: 3, lat: 10.7554, lng: 106.6665 }
        ],
        status: 'maintenance',
        fare: '20,000 VND',
        busCount: 1,
        dailyTrips: 6,
        createdAt: '2024-03-05',
        lastUpdated: '2024-10-02'
      },
      {
        id: 4,
        name: 'Gò Vấp - Bình Thạnh',
        code: 'GV-BT-04',
        description: 'Tuyến nối liền Gò Vấp và Bình Thạnh',
        distance: '12.3 km',
        estimatedTime: '40 phút',
        stops: [
          { id: 11, name: 'Chợ Gò Vấp', order: 1, lat: 10.8142, lng: 106.6438 },
          { id: 12, name: 'Đầm Sen', order: 2, lat: 10.7889, lng: 106.6542 },
          { id: 13, name: 'Vincom Bình Thạnh', order: 3, lat: 10.8012, lng: 106.7109 }
        ],
        status: 'inactive',
        fare: '12,000 VND',
        busCount: 0,
        dailyTrips: 0,
        createdAt: '2024-01-20',
        lastUpdated: '2024-08-15'
      }
    ];
    setRoutes(demoRoutes);

    // Demo available stops data
    const demoStops = [
      { id: 1, code: 'ST-001', name: 'Bến xe Bến Thành', latitude: 10.8231, longitude: 106.6297, address: '1 Phạm Ngũ Lão, Quận 1, TP.HCM' },
      { id: 2, code: 'ST-002', name: 'Chợ Tân Định', latitude: 10.7890, longitude: 106.6850, address: '120 Hai Bà Trưng, Quận 1, TP.HCM' },
      { id: 3, code: 'ST-003', name: 'Công viên Tao Đàn', latitude: 10.7769, longitude: 106.6909, address: 'Trương Định, Quận 1, TP.HCM' },
      { id: 4, code: 'ST-004', name: 'Sân bay Tân Sơn Nhất', latitude: 10.8187, longitude: 106.6519, address: 'Trường Sơn, Tân Bình, TP.HCM' },
      { id: 5, code: 'ST-005', name: 'Nhà thờ Đức Bà', latitude: 10.7798, longitude: 106.6990, address: '01 Công xã Paris, Quận 1, TP.HCM' },
      { id: 6, code: 'ST-006', name: 'Cầu Sài Gòn', latitude: 10.7624, longitude: 106.6832, address: 'Võ Văn Kiệt, Quận 1, TP.HCM' },
      { id: 7, code: 'ST-007', name: 'TTTM Crescent Mall', latitude: 10.7292, longitude: 106.7197, address: '101 Tôn Dật Tiên, Quận 7, TP.HCM' },
      { id: 8, code: 'ST-008', name: 'ĐH Quốc gia TP.HCM', latitude: 10.8700, longitude: 106.8030, address: 'Linh Trung, Thủ Đức, TP.HCM' },
      { id: 9, code: 'ST-009', name: 'Chợ Thủ Đức', latitude: 10.8506, longitude: 106.7717, address: 'Võ Văn Ngân, Thủ Đức, TP.HCM' },
      { id: 10, code: 'ST-010', name: 'Bệnh viện Chợ Rẫy', latitude: 10.7554, longitude: 106.6665, address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM' },
      { id: 11, code: 'ST-011', name: 'Chợ Gò Vấp', latitude: 10.8142, longitude: 106.6438, address: 'Quang Trung, Gò Vấp, TP.HCM' },
      { id: 12, code: 'ST-012', name: 'Đầm Sen', latitude: 10.7889, longitude: 106.6542, address: 'Hòa Bình, Quận 11, TP.HCM' },
      { id: 13, code: 'ST-013', name: 'Vincom Bình Thạnh', latitude: 10.8012, longitude: 106.7109, address: 'Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM' },
    ];
    setAvailableStops(demoStops);
  }, []);

  // Tìm kiếm và lọc dữ liệu
  useEffect(() => {
    let filtered = routes;

    if (searchTerm) {
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(route => route.status === statusFilter);
    }

    setFilteredRoutes(filtered);
  }, [routes, searchTerm, statusFilter]);

  const handleCreateRoute = () => {
    if (!newRoute.name || !newRoute.code) {
      alert('Vui lòng điền tên tuyến và mã tuyến!');
      return;
    }

    const route = {
      id: Math.max(...routes.map(r => r.id)) + 1,
      ...newRoute,
      stops: [],
      busCount: 0,
      dailyTrips: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setRoutes([...routes, route]);
    setNewRoute({
      name: '',
      code: '',
      description: '',
      distance: '',
      estimatedTime: '',
      stops: [],
      status: 'active',
      fare: ''
    });
    setIsCreating(false);
    alert('Đã tạo tuyến mới thành công!');
  };

  const handleUpdateRoute = () => { // Handle khi sửa tuyến
    if (!editingRoute.name || !editingRoute.code) {
      alert('Vui lòng điền tên tuyến và mã tuyến!');
      return;
    }
    setRoutes(routes.map(route =>
      route.id === editingRoute.id
        ? { ...editingRoute, lastUpdated: new Date().toISOString().split('T')[0] }
        : route
    ));
    setEditingRoute(null);
    alert('Đã cập nhật tuyến thành công!');
  };

  const handleDeleteRoute = (id) => { // Handle khi xóa dữ liệu
    if (confirm('Bạn có chắc muốn xóa tuyến này?')) {
      setRoutes(routes.filter(route => route.id !== id));
      alert('Đã xóa tuyến thành công!');
    }
  };

  const getStatusColor = (status) => { // Màu trạng thái
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => { // Text trạng thái
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'inactive': return 'Ngưng hoạt động';
      default: return status;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Text header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <span><RouteIcon /></span>
              <span>Quản lý tuyến đường</span>
            </h1>
            <p className="text-gray-600 mt-1">Quản lý các tuyến xe buýt và điểm dừng</p>
          </div>

          {/* Nút thêm */}
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span> <PlusCircle /></span>
            <span>Thêm tuyến mới</span>
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Thống kê Tuyến */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl"><RouteIcon /></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng tuyến</p>
                <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              </div>
            </div>
          </div>

          {/* Thống kê đang hoạt động */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl"><Check /></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {routes.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          {/* Thống kê bảo trì */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl"><Wrench /></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đang bảo trì</p>
                <p className="text-2xl font-bold text-gray-900">
                  {routes.filter(r => r.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>

          {/* Thống kê tổng xe đang hoạt động */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl"><BusFront /></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng xe hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {routes.reduce((sum, route) => sum + route.busCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ô Tìm kiếm và bộ lọc */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ô tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập tên tuyến, mã tuyến hoặc mô tả..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ô chọn trạng thái */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="maintenance">Đang bảo trì</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Nút làm mới */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
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

        {/* Danh dánh tuyến */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Tên tuyến và mã tuyến */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(route.status)}`}>
                        {getStatusText(route.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Mã: {route.code}</p>
                    <p className="text-sm text-gray-700">{route.description}</p>
                  </div>
                </div>

                {/* Nội dung Route */}
                <div className="space-y-3 mb-4">
                  {/* Khoảng cách */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Khoảng cách:</span>
                    <span className="font-medium">{route.distance}</span>
                  </div>

                  {/* Thời gian dự kiến */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thời gian dự kiến:</span>
                    <span className="font-medium">{route.estimatedTime}</span>
                  </div>

                  {/* Số điểm dừng */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số điểm dừng:</span>
                    <span className="font-medium">{route.stops.length} điểm</span>
                  </div>

                  {/* Số xe hoạt động trên tuyến */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số xe hoạt động:</span>
                    <span className="font-medium">{route.busCount} xe</span>
                  </div>
                </div>

                {/* Nút sửa và xóa */}
                <div className="flex space-x-2">
                  {/* Nút sửa */}
                  <button
                    onClick={() => setEditingRoute(route)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm 
                                                   font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span> <SquarePen /></span>
                    <span>Sửa</span>
                  </button>

                  {/* Nút xóa */}
                  <button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm 
                                                font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span> <Trash2 /></span>
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nếu không tìm thấy tuyến nào */}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mt-4">
              Không tìm thấy tuyến nào
            </p>
          </div>
        )}

        {/* Dialog tạo Route */}
        {(isCreating || editingRoute) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              {/* Title và nút X */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRoute ? 'Sửa tuyến đường' : 'Tạo tuyến mới'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingRoute(null);
                  }}
                  className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X></X>
                </button>
              </div>

              {/* Body của Dialog */}
              <div className="space-y-4">
                {/* Mã tuyến */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã tuyến *</label>
                  <input
                    type="text"
                    value={editingRoute ? editingRoute.code : newRoute.code}
                    onChange={(e) => {
                      if (editingRoute) {
                        setEditingRoute({ ...editingRoute, code: e.target.value });
                      } else {
                        setNewRoute({ ...newRoute, code: e.target.value });
                      }
                    }}
                    disabled={editingRoute}
                    placeholder="VD: BT-SB-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tên tuyến */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên tuyến *</label>
                  <input
                    type="text"
                    value={editingRoute ? editingRoute.name : newRoute.name}
                    onChange={(e) => {
                      if (editingRoute) {
                        setEditingRoute({ ...editingRoute, name: e.target.value });
                      } else {
                        setNewRoute({ ...newRoute, name: e.target.value });
                      }
                    }}
                    placeholder="VD: Bến Thành - Sân Bay"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                              focus:ring-blue-500"
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={editingRoute ? editingRoute.description : newRoute.description}
                    onChange={(e) => {
                      if (editingRoute) {
                        setEditingRoute({ ...editingRoute, description: e.target.value });
                      } else {
                        setNewRoute({ ...newRoute, description: e.target.value });
                      }
                    }}
                    placeholder="Mô tả chi tiết về tuyến đường..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Nội dung chi tiết */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Khoảng cách - Tự động tính */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khoảng cách
                      <span className="ml-2 text-xs text-blue-600 font-normal">
                        (Tự động tính)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editingRoute ? editingRoute.distance : newRoute.distance}
                      readOnly
                      placeholder="Thêm điểm dừng để tính tự động"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Thời gian dự kiến - Tự động tính */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian dự kiến
                      <span className="ml-2 text-xs text-blue-600 font-normal">
                        (Tự động tính)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editingRoute ? editingRoute.estimatedTime : newRoute.estimatedTime}
                      readOnly
                      placeholder="Tự động tính dựa trên khoảng cách"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Nội dung chi tiết *2 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Trạng thái */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      value={editingRoute ? editingRoute.status : newRoute.status}
                      onChange={(e) => {
                        if (editingRoute) {
                          setEditingRoute({ ...editingRoute, status: e.target.value });
                        } else {
                          setNewRoute({ ...newRoute, status: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="inactive">Ngưng hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Stop Selector - Chọn từ danh sách điểm dừng có sẵn */}
                <div className="mt-6">
                  <StopSelector
                    selectedStops={editingRoute ? editingRoute.stops : newRoute.stops}
                    onStopsChange={(stops) => {
                      // Auto calculate distance and time
                      const distance = calculateRouteDistance(stops);
                      const distanceNum = parseFloat(distance);
                      const time = estimateTravelTime(distanceNum);

                      if (editingRoute) {
                        setEditingRoute({
                          ...editingRoute,
                          stops,
                          distance,
                          estimatedTime: time
                        });
                      } else {
                        setNewRoute({
                          ...newRoute,
                          stops,
                          distance,
                          estimatedTime: time
                        });
                      }
                    }}
                    availableStops={availableStops}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                {/* Nút đóng */}
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingRoute(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>

                {/* Nút tạo */}
                <button
                  onClick={editingRoute ? handleUpdateRoute : handleCreateRoute}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingRoute ? 'Cập nhật' : 'Tạo tuyến'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
};