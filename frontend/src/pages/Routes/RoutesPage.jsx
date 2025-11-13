import { Eye, RouteIcon, PlusCircle, Search, SquarePen, Trash2, X, BusFront, Clock, MapPin, EthernetPort, RulerDimensionLine } from "lucide-react";
import { useEffect, useState } from "react";
import StopSelector from "../../components/Routes/StopSelector";
import { calculateRouteDistance, estimateTravelTime } from "../../utils/distanceCalculator";
import { CTRouteAPI, RouteAPI, StopAPI } from "../../api/apiServices";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]); // Danh sách tuyến
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Danh sách tuyến sau lọc
  const [searchTerm, setSearchTerm] = useState(''); // Text Search
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [editingRoute, setEditingRoute] = useState(null); // Tuyến đang sửa
  const [currentPage, setCurrentPage] = useState(1); // Phân trang
  const routesPerPage = 10; // Số tuyến mỗi trang
  const [availableStops, setAvailableStops] = useState([]); // Danh sách điểm dừng có sẵn


  // Giả lập dữ liệu ban đầu (giữ nguyên như cũ)
  useEffect(() => {
    (async () => {
      try {
        const [listRoute] = await Promise.all([RouteAPI.getAllRoute(),
        ]);
        setRoutes(listRoute);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Route: ', error);
      }
    })();

    // Danh sách điểm dừng có sẵn
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
    ];
    setAvailableStops(demoStops);
  }, []);

  // Lọc theo search
  useEffect(() => {
    const filtered = routes.filter((route) =>
      route.tentuyen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.matd.toString().includes(searchTerm.toLowerCase()) ||
      route.mota.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
    setCurrentPage(1);
  }, [searchTerm, routes]);

  // Phân trang
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);
  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Mở modal thêm
  const handleAddRoute = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  // Xóa tuyến
  const handleDeleteRoute = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến này?')) {
      setRoutes(routes.filter((r) => r.id !== id));
    }
  };

  // Xem chi tiết (chỉ đọc)
  const handleViewRoute = async (route) => {
    setEditingRoute({ ...route, __readOnly: true }); // Đánh dấu chỉ đọc
    setIsModalOpen(true);
  };

  // Lưu tuyến (thêm hoặc sửa)
  const handleSaveRoute = (routeData) => {
    if (editingRoute) {
      // Cập nhật
      setRoutes(routes.map((r) =>
        r.id === editingRoute.id
          ? { ...r, ...routeData, lastUpdated: new Date().toISOString().split('T')[0] }
          : r
      ));
    } else {
      // Thêm mới
      const newId = Math.max(...routes.map((r) => r.id), 0) + 1;
      const newRoute = {
        ...routeData,
        id: newId,
        busCount: 0,
        dailyTrips: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setRoutes([...routes, newRoute]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <RouteIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tuyến đường</h1>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã tuyến hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddRoute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <PlusCircle className="h-6 w-6" />
            <span>Thêm tuyến mới</span>
          </button>
        </div>

        {/* Stats nhỏ */}
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
          <span>Tổng số: <strong className="text-gray-900">{routes.length}</strong> tuyến</span>
          {searchTerm && (
            <span>Kết quả tìm kiếm: <strong className="text-gray-900">{filteredRoutes.length}</strong> tuyến</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã tuyến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên tuyến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRoutes.length > 0 ? (
                currentRoutes.map((route) => (
                  <tr key={route.matd} className="hover:bg-gray-50 transition-colors">
                    {/* Mã tuyến */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-lg">
                          <RouteIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">TD-{route.matd}</div>
                        </div>
                      </div>
                    </td>

                    {/* Tên tuyến */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{route.tentuyen}</div>
                    </td>

                    {/* Thông tin */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EthernetPort className="h-4 w-4 mr-1 text-gray-400" />
                        {route.mota}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <RulerDimensionLine className="h-4 w-4 mr-1 text-gray-400" />
                        Quãng đường:{" " + route.tongquangduong} km
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${route.trangthai === 1 ? 'bg-green-100 text-green-800' :
                        route.trangthai === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {route.trangthai === 1 ? 'Hoạt động' :
                          route.trangthai === 2 ? 'Bảo trì' : 'Ngưng'}
                      </span>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Xem */}
                        <button
                          onClick={() => handleViewRoute(route)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Sửa */}
                        <button
                          onClick={() => handleEditRoute(route)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>

                        {/* Xóa */}
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <RouteIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy tuyến nào</p>
                    <p className="mt-1">
                      {searchTerm
                        ? 'Thử tìm kiếm với từ khóa khác'
                        : 'Bắt đầu bằng cách thêm tuyến mới'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{indexOfFirstRoute + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastRoute, filteredRoutes.length)}
                </span>{' '}
                trong tổng số <span className="font-medium">{filteredRoutes.length}</span> tuyến
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg ${currentPage === index + 1
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            {/* Form */}
            <RouteForm
              route={editingRoute}
              availableStops={availableStops}
              onSave={handleSaveRoute}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RouteForm({ route, availableStops, onSave, onCancel }) {
  const isReadOnly = route?.__readOnly === true; // Kiểm tra chế độ XEM
  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState({ // Form xem/ sửa/ thêm
    name: route ? route.tentuyen : '',
    code: route?.matd || '',
    description: route?.mota || '',
    stops: [],
    status: route?.trangthai || -1,
    distance: route?.tongquangduong || 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [dsCTTD, listStop] = await Promise.all([CTRouteAPI.getCTTTById(Number(route.matd))
          , StopAPI.getAllStops()]);
        setFormData(prev => ({ ...prev, stops: dsCTTD }));
        setStops(listStop);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Chi tiết Route: ', error);
      }
    })();
  }, [route])

  const [errors, setErrors] = useState({});

  // Chỉ validate khi KHÔNG phải chế độ xem
  const validate = () => {
    if (isReadOnly) return true;
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên tuyến không được để trống';
    if (!formData.code.trim()) newErrors.code = 'Mã tuyến không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStopsChange = (stops) => {
    if (isReadOnly) return;
    const distance = calculateRouteDistance(stops);
    const time = estimateTravelTime(parseFloat(distance));
    setFormData(prev => ({
      ...prev,
      stops,
      distance,
      estimatedTime: time
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Modal */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <RouteIcon className="h-7 w-7 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {isReadOnly
              ? 'Xem chi tiết tuyến đường'
              : route
                ? 'Chỉnh sửa tuyến đường'
                : 'Thêm tuyến đường mới'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mã tuyến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mã tuyến {isReadOnly ? '' : '*'}
          </label>
          <input
            type="text"
            value={"TD-" + formData.code}
            onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, code: e.target.value }))}
            disabled={isReadOnly || !!route}
            placeholder="VD: BT-SB-01"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.code ? 'border-red-300' : 'border-gray-300'
              } ${isReadOnly || route ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
          {errors.code && !isReadOnly && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
        </div>

        {/* Tên tuyến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên tuyến {isReadOnly ? '' : '*'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isReadOnly}
            placeholder="VD: Bến Thành - Sân Bay"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
              } ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            readOnly={isReadOnly}
          />
          {errors.name && !isReadOnly && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          value={formData.description}
          onChange={(e) => !isReadOnly && setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          disabled={isReadOnly}
          placeholder="Mô tả chi tiết về tuyến đường..."
          className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors resize-none ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          readOnly={isReadOnly}
        />
      </div>

      {/* Khoảng cách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng cách <span className="text-xs text-blue-600">(Tự động)</span>
          </label>
          <input
            type="text"
            value={formData.distance || 'Chưa có điểm dừng'}
            readOnly
            disabled
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          {isReadOnly ? (
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {formData.status === 1 ? 'Hoạt động' : 'Ngưng hoạt động'}
            </div>
          ) : (
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Ngưng hoạt động</option>
            </select>
          )}
        </div>
      </div>

      {/* Danh sách điểm dừng */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Điểm dừng ({formData.stops.length})

        </label>
        {isReadOnly ? (
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-50 border border-gray-300 rounded-lg">
            {formData.stops.length > 0 ? (
              formData.stops.map((stop, idx) => (
                <div key={stop.madd} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-medium text-primary-600">{idx + 1}.</span>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{stops.find(s => s.madd == stop.madd).tendiemdung}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Chưa có điểm dừng</p>
            )}
          </div>
        ) : (
          <StopSelector
            selectedStops={formData.stops}
            onStopsChange={handleStopsChange}
            availableStops={availableStops}
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          {isReadOnly ? 'Đóng' : 'Hủy'}
        </button>

        {/* ẨN NÚT LƯU KHI XEM */}
        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            {route ? 'Cập nhật' : 'Tạo tuyến'}
          </button>
        )}
      </div>
    </div>
  );
}