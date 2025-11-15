import { BusFront, PlusCircle, Search, SquarePen, Trash2, X, Gauge, Users, Fuel, User, TruckElectric } from "lucide-react";
import { useEffect, useState } from "react";
import { BusAPI } from "../../api/apiServices";
import BusModal from "./BusModal";

export default function BusesPage() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const busesPerPage = 10;

  useEffect(() => {
    (async () => {
      try {
        const listBus = await BusAPI.getAllBus();
        setBuses(listBus);
        setFilteredBuses(listBus);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Bus:', error);
      }
    })();
  }, []);

  // Filter theo search
  useEffect(() => {
    const filtered = buses.filter((bus) =>
      bus.maxe.toString().includes(searchTerm.toLowerCase()) ||
      bus.bienso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.hangxe.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuses(filtered);
    setCurrentPage(1);
  }, [searchTerm, buses]);

  // Phân trang
  const indexOfLastBus = currentPage * busesPerPage;
  const indexOfFirstBus = indexOfLastBus - busesPerPage;
  const currentBuses = filteredBuses.slice(indexOfFirstBus, indexOfLastBus); // Lấy phần tử từ a-b
  const totalPages = Math.ceil(filteredBuses.length / busesPerPage); //  ceil là làm tròn lên 

  const handleAddBus = () => {
    setEditingBus(null);
    setIsModalOpen(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setIsModalOpen(true);
  };

  const handleDeleteBus = async (maxe) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe buýt này?')) {
      try {
        await BusAPI.deleteBus(maxe);
        setBuses(buses.filter((bus) => bus.maxe !== maxe));
      } catch (error) {
        alert(error.message || 'Xóa thất bại!');
      }
    }
  };

  const handleSaveBus = async (busData) => {
    let newBus;
    if (editingBus) {       // Cập nhật
      console.log(busData);

      await BusAPI.updateBus(editingBus.maxe, busData);
      setBuses(buses.map((bus) =>
        bus.maxe === editingBus.maxe ? { ...bus, ...busData } : bus // { ...bus, ...busData } trộn data cũ sang data mới
      ));
    } else {  // Thêm mới
      newBus = await BusAPI.createBus(busData);
      setBuses(prev => [...prev, newBus.bus]);
    }

    setIsModalOpen(false);
    setEditingBus(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BusFront className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý xe buýt</h1>
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
                placeholder="Tìm kiếm theo mã xe, biển số, hãng xe..."
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
            onClick={handleAddBus}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <PlusCircle className="h-6 w-6" />
            <span>Thêm xe mới</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
          <span>Tổng số: <strong className="text-gray-900">{buses.length}</strong> xe</span>
          {searchTerm && (
            <span>Kết quả tìm kiếm: <strong className="text-gray-900">{filteredBuses.length}</strong> xe</span>
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
                  Mã xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hiệu suất vận hành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>

            {/* Phần Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBuses.length > 0 ? (
                currentBuses.map((bus) => (
                  <tr key={bus.maxe} className="hover:bg-gray-50 transition-colors">
                    {/* Mã xe */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-lg">
                          <BusFront className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            BUS-{bus.maxe}
                          </div>
                          <div className="text-sm font-medium text-gray-900 flex items-center mt-1">
                            <Gauge className="h-3 w-3 mr-1" />
                            {bus.bienso}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Thông tin */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{bus.hangxe} ({bus.namsanxuat})</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        {bus.soghe} chỗ
                      </div>
                    </td>


                    {/* Hiệu suất vận hành*/}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <TruckElectric className="h-4 w-4 mr-1 text-gray-500" />
                        {'Vận tốc: ' + bus.vantoctrungbinh + ' km/h' || 'Chưa có'}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${bus.trangthai === 1 ? 'bg-green-100 text-green-800' :
                        bus.trangthai === 2 ? 'bg-yellow-100 text-yellow-800' :
                          bus.trangthai === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {bus.trangthai === 1 ? 'Hoạt động' :
                          bus.trangthai === 2 ? 'Bảo trì' :
                            bus.trangthai === 3 ? 'Sửa chữa' : 'Ngưng'}
                      </span>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditBus(bus)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus.maxe)}
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
                    <BusFront className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy xe buýt nào</p>
                    <p className="mt-1">
                      {searchTerm
                        ? 'Thử tìm kiếm với từ khóa khác'
                        : 'Bắt đầu bằng cách thêm xe mới'}
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
                Hiển thị <span className="font-medium">{indexOfFirstBus + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastBus, filteredBuses.length)}
                </span>{' '}
                trong tổng số <span className="font-medium">{filteredBuses.length}</span> xe
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
        <BusModal
          bus={editingBus}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBus}
          buses={buses}
        />
      )}

    </div>
  );
}