import { BusFront, Check, Plus, RefreshCcw, Users, Wrench } from "lucide-react";
import { useState } from "react";


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

   const handleCreateBus = () => {
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

   const getStatusColor = (status) => { // Lấy màu trạng thái
      switch (status) {
         case 'active': return 'bg-green-100 text-green-800';
         case 'maintenance': return 'bg-yellow-100 text-yellow-800';
         case 'inactive': return 'bg-red-100 text-red-800';
         case 'repair': return 'bg-orange-100 text-orange-800';
         default: return 'bg-gray-100 text-gray-800';
      }
   };

   const getStatusText = (status) => { // Chuyển đổi text trạng thái
      switch (status) {
         case 'active': return 'Hoạt động';
         case 'maintenance': return 'Bảo trì';
         case 'inactive': return 'Ngưng hoạt động';
         case 'repair': return 'Sửa chữa';
         default: return status;
      }
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
                  <p className="text-gray-600 mt-1">Quản lý đội xe buýt và thông tin vận hành</p>
               </div>

               <button
                  onClick={() => setIsCreating(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
               >
                  <span><Plus></Plus></span>
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
                        {routes.map((route) =>(
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

            {/* Danh sách xe */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredBuses.map((bus) => (
                  <div key={bus.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  
                  </div>
               ))}
            </div>
         </div>
      </>
   )
};