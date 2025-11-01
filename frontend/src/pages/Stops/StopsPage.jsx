import { MapPin, PlusCircle, Search, SquarePen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import StopModal from "./StopModal";
import { getAll } from "../../api/StopAPI";

export default function StopsPage() {
  const [stops, setStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const stopsPerPage = 10;

  // Gọi API tải dữ liệu
  useEffect(() => {
    getAll()
      .then((listStop) => {
        console.log('Dữ liệu từ API:', listStop);
        setStops(listStop);
        setFilteredStops(listStop);
      })
      .catch((error) => {
        console.error('Lỗi khi tải dữ liệu điểm dừng:', error);
      });
  }, []);

  // Filter stops based on search term
  useEffect(() => {
    const filtered = stops.filter((stop) =>
      stop.tendiemdung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.madd?.toString().includes(searchTerm) ||
      stop.diachi?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStops(filtered);
    setCurrentPage(1);
  }, [searchTerm, stops]);

  // Pagination
  const indexOfLastStop = currentPage * stopsPerPage;
  const indexOfFirstStop = indexOfLastStop - stopsPerPage;
  const currentStops = filteredStops.slice(indexOfFirstStop, indexOfLastStop);
  const totalPages = Math.ceil(filteredStops.length / stopsPerPage);

  const handleAddStop = () => {
    setEditingStop(null);
    setIsModalOpen(true);
  };

  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setIsModalOpen(true);
  };

  const handleDeleteStop = (madd) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm dừng này?')) {
      setStops(stops.filter((stop) => stop.madd !== madd));
      setFilteredStops(filteredStops.filter((stop) => stop.madd !== madd));
    }
  };

  const handleSaveStop = (stopData) => {
    if (editingStop) {
      // Cập nhật
      setStops(stops.map((stop) =>
        stop.madd === editingStop.madd ? { ...stop, ...stopData } : stop
      ));
    } else {
      // Thêm mới
      const newId = Math.max(...stops.map((s) => s.madd), 0) + 1;
      const newStop = {
        ...stopData,
        madd: newId,
      };
      setStops([...stops, newStop]);
    }
    setIsModalOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý điểm dừng</h1>
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
                placeholder="Tìm kiếm theo tên, mã hoặc địa chỉ..."
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
            onClick={handleAddStop}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <PlusCircle className="h-6 w-6" />
            <span>Thêm điểm dừng</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
          <span>Tổng số: <strong className="text-gray-900">{stops.length}</strong> điểm dừng</span>
          {searchTerm && (
            <span>Kết quả tìm kiếm: <strong className="text-gray-900">{filteredStops.length}</strong> điểm dừng</span>
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
                  Mã điểm dừng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên điểm dừng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tọa độ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStops.length > 0 ? (
                currentStops.map((stop) => (
                  <tr key={stop.madd} className="hover:bg-gray-50 transition-colors">
                    {/* Mã điểm dừng */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">STOP-{stop.madd}</div>
                        </div>
                      </div>
                    </td>

                    {/* Tên */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{stop.tendiemdung}</div>
                    </td>

                    {/* Địa chỉ */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{stop.diachi || 'N/A'}</div>
                    </td>

                    {/* Tọa độ */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Lat: {stop.vido ? parseFloat(stop.vido).toFixed(6) : 'N/A'}</div>
                        <div className="text-gray-500">Lng: {stop.kinhdo ? parseFloat(stop.kinhdo).toFixed(6) : 'N/A'}</div>
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStop(stop)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.madd)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy điểm dừng nào</p>
                    <p className="mt-1">
                      {searchTerm
                        ? 'Thử tìm kiếm với từ khóa khác'
                        : 'Bắt đầu bằng cách thêm điểm dừng mới'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{indexOfFirstStop + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastStop, filteredStops.length)}
                </span>{' '}
                trong tổng số <span className="font-medium">{filteredStops.length}</span> điểm dừng
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
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === index + 1
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
        <StopModal
          stop={editingStop}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStop}
        />
      )}
    </div>
  );
} 