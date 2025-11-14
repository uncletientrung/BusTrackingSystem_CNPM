import { Eye, RouteIcon, PlusCircle, Search, SquarePen, Trash2, X, EthernetPort, RulerDimensionLine, LucideGpu } from "lucide-react";
import { useEffect, useState } from "react";
import { CTRouteAPI, RouteAPI, StopAPI } from "../../api/apiServices";
import RouteForm from "./RouteForm";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]); // Danh sách tuyến
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Danh sách tuyến sau lọc
  const [searchTerm, setSearchTerm] = useState(''); // Text Search
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [editingRoute, setEditingRoute] = useState(null); // Tuyến đang sửa
  const [currentPage, setCurrentPage] = useState(1); // Phân trang
  const routesPerPage = 10; // Số tuyến mỗi trang
  const [stops, setStops] = useState([]); // Danh sách điểm dừng


  // Giả lập dữ liệu ban đầu (giữ nguyên như cũ)
  useEffect(() => {
    (async () => {
      try {
        const [listRoute, listStop] = await Promise.all([RouteAPI.getAllRoute(),
        StopAPI.getAllStops()]);
        setRoutes(listRoute);
        setStops(listStop);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Route: ', error);
      }
    })();
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
    if (!route?.matd) return;
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
    if (!route?.matd) return;
    setEditingRoute({ ...route, __readOnly: true }); // Đánh dấu chỉ đọc
    setIsModalOpen(true);
  };

  // Lưu tuyến (thêm hoặc sửa)
  const handleSaveRoute = async (routeData) => {
    try {
      // if (editingRoute) { // Cập nhật
      //   setRoutes(routes.map((r) =>
      //   r.id === editingRoute.id
      //     ? { ...r, ...routeData, lastUpdated: new Date().toISOString().split('T')[0] }
      //     : r
      // ));
      // } else {   // Thêm mới

      await RouteAPI.createRoute(routeData);
      const [listRoute,] = await Promise.all([RouteAPI.getAllRoute(),
      StopAPI.getAllStops()]);
      setRoutes(listRoute);
      setIsModalOpen(false);
    } catch (error) {
      alert("Lỗi tạo tuyến ở Page: " + error.message);
    }
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
              listStop={stops}
              onSave={handleSaveRoute}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}