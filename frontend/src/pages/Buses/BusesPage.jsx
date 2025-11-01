import { BusFront, Check, Plus, PlusCircle, RefreshCcw, SquarePen, Trash2, Users, Wrench, X } from "lucide-react";
import BusListItem from '../../components/common/BusListItem';
import { useEffect, useState } from "react";


export default function BusesPage() {
  const [buses, setBuses] = useState([]); // Danh sách xe
  const [filteredBuses, setFilteredBuses] = useState([]); // Danh sách xe sau lọc 
  const [searchTerm, setSearchTerm] = useState(''); // search Text
  const [statusFilter, setStatusFilter] = useState('all'); // Bộ lọc trạng thái
  const [routeFilter, setRouteFilter] = useState('all'); // Bộ lọc router
  const [isCreating, setIsCreating] = useState(false); // Trạng thái tạo
  const [editingBus, setEditingBus] = useState(null); // Dữ liệu sửa
  const [newBus, setNewBus] = useState({                // Giả lập dữ liệu thêm mới
    number: '',
    licensePlate: '',
    capacity: '',
    model: '',
    year: '',
    route: '',
    driver: '',
    status: 'active',
    fuelType: 'diesel'
  });

  const handleCreateBus = () => { // Hàm xử lý thêm 
    if (!newBus.number || !newBus.licensePlate || !newBus.capacity) {
      alert('Vui lòng điền đầy đủ thông tin cơ bản!');
      return;
    }

    const selectedRoute = routes.find(r => r.id.toString() === newBus.route);
    const selectedDriver = drivers.find(d => d.id.toString() === newBus.driver);

    const bus = {
      id: Math.max(...buses.map(b => b.id)) + 1,
      ...newBus,
      capacity: parseInt(newBus.capacity),
      year: parseInt(newBus.year),
      route: selectedRoute?.name || '',
      routeCode: selectedRoute?.code || '',
      driver: selectedDriver?.name || '',
      driverLicense: selectedDriver?.license || '',
      mileage: '0 km',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyTrips: 0,
      monthlyRevenue: '0 VND',
      fuelConsumption: '0',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBuses([...buses, bus]);
    setNewBus({
      number: '',
      licensePlate: '',
      capacity: '',
      model: '',
      year: '',
      route: '',
      driver: '',
      status: 'active',
      fuelType: 'diesel'
    });
    setIsCreating(false);
    alert('Đã thêm xe buýt mới thành công!');
  };

  const handleDeleteBus = (id) => { // Hàm xử lý xóa
    if (confirm('Bạn có chắc muốn xóa xe buýt này?')) {
      setBuses(buses.filter(bus => bus.id !== id));
      alert('Đã xóa xe buýt thành công!');
    }
  };
  const handleUpdateBus = () => { // Hàm xử lý sửa
    if (!editingBus.number || !editingBus.licensePlate || !editingBus.capacity) {
      alert('Vui lòng điền đầy đủ thông tin cơ bản!');
      return;
    }

    const selectedRoute = routes.find(r => r.id.toString() === editingBus.route);
    const selectedDriver = drivers.find(d => d.id.toString() === editingBus.driver);

    setBuses(buses.map(bus =>
      bus.id === editingBus.id
        ? {
          ...editingBus,
          capacity: parseInt(editingBus.capacity),
          year: parseInt(editingBus.year),
          route: selectedRoute?.name || '',
          routeCode: selectedRoute?.code || '',
          driver: selectedDriver?.name || '',
          driverLicense: selectedDriver?.license || ''
        }
        : bus
    ));
    setEditingBus(null);
    alert('Đã cập nhật xe buýt thành công!');
  };

  // Giả lập dữ liệu
  const routes = [
    { id: 1, name: 'Bến Thành - Sân Bay', code: 'BT-SB-01' },
    { id: 2, name: 'Quận 1 - Quận 7', code: 'Q1-Q7-02' },
    { id: 3, name: 'Thủ Đức - Quận 3', code: 'TD-Q3-03' },
    { id: 4, name: 'Gò Vấp - Bình Thạnh', code: 'GV-BT-04' }
  ];

  const drivers = [
    { id: 1, name: 'Nguyễn Văn A', license: 'B2-123456' },
    { id: 2, name: 'Trần Văn B', license: 'B2-789012' },
    { id: 3, name: 'Lê Văn C', license: 'B2-345678' },
    { id: 4, name: 'Phạm Văn D', license: 'B2-901234' }
  ];
  useEffect(() => {
    const demoBuses = [
      {
        id: 1,
        number: 'BUS-001',
        licensePlate: '51B-123.45',
        capacity: 40,
        model: 'Thaco TB120S',
        year: 2022,
        route: 'Bến Thành - Sân Bay',
        routeCode: 'BT-SB-01',
        driver: 'Nguyễn Văn A',
        driverLicense: 'B2-123456',
        status: 'active',
        fuelType: 'diesel',
        mileage: '45,230 km',
        lastMaintenance: '2024-09-15',
        nextMaintenance: '2024-11-15',
        dailyTrips: 4,
        monthlyRevenue: '12,500,000 VND',
        fuelConsumption: '8.5 L/100km',
        createdAt: '2022-03-15'
      },
      {
        id: 2,
        number: 'BUS-002',
        licensePlate: '51B-678.90',
        capacity: 35,
        model: 'Hyundai County',
        year: 2021,
        route: 'Quận 1 - Quận 7',
        routeCode: 'Q1-Q7-02',
        driver: 'Trần Văn B',
        driverLicense: 'B2-789012',
        status: 'active',
        fuelType: 'diesel',
        mileage: '62,150 km',
        lastMaintenance: '2024-08-20',
        nextMaintenance: '2024-10-20',
        dailyTrips: 3,
        monthlyRevenue: '10,200,000 VND',
        fuelConsumption: '9.2 L/100km',
        createdAt: '2021-05-10'
      },
      {
        id: 3,
        number: 'BUS-003',
        licensePlate: '51B-234.56',
        capacity: 45,
        model: 'Isuzu NQR75',
        year: 2023,
        route: 'Thủ Đức - Quận 3',
        routeCode: 'TD-Q3-03',
        driver: 'Lê Văn C',
        driverLicense: 'B2-345678',
        status: 'maintenance',
        fuelType: 'CNG',
        mileage: '28,900 km',
        lastMaintenance: '2024-10-01',
        nextMaintenance: '2024-10-15',
        dailyTrips: 0,
        monthlyRevenue: '0 VND',
        fuelConsumption: '12.5 m³/100km',
        createdAt: '2023-01-20'
      },
      {
        id: 4,
        number: 'BUS-004',
        licensePlate: '51B-789.01',
        capacity: 32,
        model: 'Ford Transit',
        year: 2020,
        route: '',
        routeCode: '',
        driver: '',
        driverLicense: '',
        status: 'inactive',
        fuelType: 'diesel',
        mileage: '89,450 km',
        lastMaintenance: '2024-06-10',
        nextMaintenance: '2024-12-10',
        dailyTrips: 0,
        monthlyRevenue: '0 VND',
        fuelConsumption: '7.8 L/100km',
        createdAt: '2020-08-05'
      },
      {
        id: 5,
        number: 'BUS-005',
        licensePlate: '51B-345.67',
        capacity: 50,
        model: 'Daewoo BU120',
        year: 2024,
        route: 'Gò Vấp - Bình Thạnh',
        routeCode: 'GV-BT-04',
        driver: 'Phạm Văn D',
        driverLicense: 'B2-901234',
        status: 'active',
        fuelType: 'electric',
        mileage: '5,200 km',
        lastMaintenance: '2024-09-01',
        nextMaintenance: '2024-12-01',
        dailyTrips: 2,
        monthlyRevenue: '8,800,000 VND',
        fuelConsumption: '1.2 kWh/km',
        createdAt: '2024-02-28'
      }
    ];
    setBuses(demoBuses);
  }, []);

  // Render lại sau khi tìm 
  useEffect(() => {
    let filtered = buses;

    if (searchTerm) {
      filtered = filtered.filter(bus =>
        bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.driver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bus => bus.status === statusFilter);
    }

    if (routeFilter !== 'all') {
      filtered = filtered.filter(bus => bus.routeCode === routeFilter);
    }

    setFilteredBuses(filtered);
  }, [buses, searchTerm, statusFilter, routeFilter]);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <span><BusFront /> </span>
              <span>Quản lý xe bus</span>
            </h1>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span><PlusCircle></PlusCircle></span>
            <span>Thêm xe mới</span>
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bus */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl"><BusFront></BusFront></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng xe</p>
                <p className="text-2xl font-bold text-gray-900">{buses.length}</p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl"><Check></Check></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buses.filter(b => b.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          {/* Bảo trì */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl"><Wrench /></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bảo trì</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buses.filter(b => b.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>

          {/* Tổng sức chứa */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl"><Users></Users></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng sức chứa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buses.reduce((sum, bus) => sum + bus.capacity, 0)}
                  {/* array.reduce((lưu gtri tổng, phần tử trong Arr) => { ... }, gtri ban đầu) */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm và bộ lọc */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Thanh tìm kiếm */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã xe, biển số, tài xế..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bộ lọc trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="repair">Sửa chữa</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Bộ lọc tuyến đường */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuyến</label>
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.code}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút làm mới */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRouteFilter('all');
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

        {/* Danh sách xe hiển thị sau lọc (list view) */}
        <div className="space-y-3">
          {filteredBuses.map((bus, index) => (
            <BusListItem 
              key={bus.id} 
              bus={bus} 
              index={index}
              onEdit={() => setEditingBus(bus)} 
              onDelete={() => handleDeleteBus(bus.id)} 
            />
          ))}
        </div>

        {/* Info khi không có gì để lọc */}
        {filteredBuses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mt-4">
              Không tìm thấy xe buýt nào phù hợp
            </p>
          </div>
        )}

        {/* Dialog tạo/ sửa */}
        {(isCreating || editingBus) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingBus ? 'Sửa thông tin xe buýt' : 'Thêm xe buýt mới'}
                </h3>
                {/* Nút tắt */}
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingBus(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X></X>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mã xe*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã xe *</label>
                  <input
                    type="text"
                    value={editingBus ? editingBus.number : newBus.number}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, number: e.target.value });
                      } else {
                        setNewBus({ ...newBus, number: e.target.value });
                      }
                    }}
                    placeholder="VD: BUS-001"
                    disabled={!!editingBus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Biển số xe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe *</label>
                  <input
                    type="text"
                    value={editingBus ? editingBus.licensePlate : newBus.licensePlate}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, licensePlate: e.target.value });
                      } else {
                        setNewBus({ ...newBus, licensePlate: e.target.value });
                      }
                    }}
                    placeholder="VD: 51B-123.45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Hãng xe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe</label>
                  <input
                    type="number"
                    value={editingBus ? editingBus.model : newBus.model}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, year: e.target.value });
                      } else {
                        setNewBus({ ...newBus, year: e.target.value });
                      }
                    }}
                    placeholder="Hyundai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Năm sản xuất */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
                  <input
                    type="number"
                    value={editingBus ? editingBus.year : newBus.year}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, year: e.target.value });
                      } else {
                        setNewBus({ ...newBus, year: e.target.value });
                      }
                    }}
                    placeholder="2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sức chứa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa *</label>
                  <input
                    type="number"
                    value={editingBus ? editingBus.capacity : newBus.capacity}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, capacity: e.target.value });
                      } else {
                        setNewBus({ ...newBus, capacity: e.target.value });
                      }
                    }}
                    placeholder="40"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={editingBus ? editingBus.status : newBus.status}
                    onChange={(e) => {
                      if (editingBus) {
                        setEditingBus({ ...editingBus, status: e.target.value });
                      } else {
                        setNewBus({ ...newBus, status: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="repair">Sửa chữa</option>
                    <option value="inactive">Ngưng hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                {/* Nút Ok */}
                <button
                  onClick={editingBus ? handleUpdateBus : handleCreateBus}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingBus ? 'Cập nhật' : 'Thêm xe'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingBus(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div >
    </>
  )
};