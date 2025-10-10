import {  useState } from "react"
import { BusFront, CalendarCheck, CheckCircle, CircleCheck, CirclePlus, Hourglass, RefreshCcw } from "lucide-react"


export default function SchedulePage() {
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//    // Lấy ngày giờ của Date, chuyển thành ISO là "2025-10-10T16:53:02.123Z", cắt từ T thành 2 item, lấy yyyy/MM/dd
   const [selectedRoute, setSelectedRoute] = useState('all');
   const [lichTrinh, setLichTrinh]= useState([]);
//    const [isCreating, setIsCreating]= useState(false);
//    const [newSchedule, setNewSchedule] = useState({
//     busNumber: '', // Mã số xe
//     route: '',      // Tuyến
//     departureTime: '', // Giờ khởi hành
//     arrivalTime: '', // Giờ cập bến
//     driverId: '',   // Mã tài xế
//     status: 'scheduled'
//     });

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

//     // Giả lập lịch trình
//     useEffect(() => {
//         const demoSchedules = [
//         {
//             id: 1,
//             busNumber: 'BUS-001',
//             route: 'Bến Thành - Sân Bay',
//             departureTime: '06:00',
//             arrivalTime: '07:30',
//             driver: 'Nguyễn Văn A',
//             status: 'running',
//             passengers: 25, // Hành khách
//             capacity: 40, // Sức chứa
//             date: selectedDate
//         },
//         {
//             id: 2,
//             busNumber: 'BUS-002',
//             route: 'Quận 1 - Quận 7',
//             departureTime: '07:00',
//             arrivalTime: '08:45',
//             driver: 'Trần Văn B',
//             status: 'scheduled',
//             passengers: 0,
//             capacity: 35,
//             date: selectedDate
//         },
//         {
//             id: 3,
//             busNumber: 'BUS-001',
//             route: 'Bến Thành - Sân Bay',
//             departureTime: '08:30',
//             arrivalTime: '10:00',
//             driver: 'Nguyễn Văn A',
//             status: 'completed',
//             passengers: 38,
//             capacity: 40,
//             date: selectedDate
//         },
//         {
//             id: 4,
//             busNumber: 'BUS-003',
//             route: 'Thủ Đức - Quận 3',
//             departureTime: '09:15',
//             arrivalTime: '11:00',
//             driver: 'Lê Văn C',
//             status: 'delayed',
//             passengers: 20,
//             capacity: 45,
//             date: selectedDate
//         }
//         ];
        
//         const filtered = selectedRoute === 'all' // Bộ lọc
//             ? demoSchedules 
//             : demoSchedules.filter(s => s.route.includes(selectedRoute));
//         setLichTrinh(filtered);
//     }, [selectedDate, selectedRoute]);

//     const getStatusColor = (status) => { // Màu trạng thái
//         switch (status) {
//         case 'running': return 'bg-blue-100 text-blue-800';
//         case 'completed': return 'bg-green-100 text-green-800';
//         case 'scheduled': return 'bg-yellow-100 text-yellow-800';
//         case 'delayed': return 'bg-red-100 text-red-800';
//         case 'cancelled': return 'bg-gray-100 text-gray-800';
//         default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getStatusText = (status) => { // Chuyển đổi text trạng thái
//         switch (status) {
//         case 'running': return 'Đang chạy';
//         case 'completed': return 'Hoàn thành';
//         case 'scheduled': return 'Đã lên lịch';
//         case 'delayed': return 'Trễ giờ';
//         case 'cancelled': return 'Hủy bỏ';
//         default: return status;
//         }
//     };


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
                    <p className="text-gray-600 mt-1">Lập lịch và theo dõi các chuyến xe buýt</p>
                </div>
                
                {/* Chưa thêm Action */}
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors flex items-center space-x-2"
                > 
                    
                    <span>
                        <CirclePlus className="h-5 w-5 text-white" />
                    </span>
                    <span>Tạo lịch trình mới</span>
                </button>

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
                                {demoRoutes.map((route) =>(
                                    <option key={route.id} value={route.code}>
                                        {route.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end"> {/* Nút làm mới */}
                            <button
                                onClick={() => window.location.reload() /*Reload lại trang hàm JS */} 
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 
                                                rounded-lg font-medium transition-colors"
                            >
                                <RefreshCcw></RefreshCcw>   
                            </button>
                        </div>       
                    </div>
                </div>
                
                {/* Thống kê nhanh */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Thống kê bus */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">
                                    <BusFront/>
                                </span>
                            </div>

                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Tổng chuyến</p>
                                <p className="text-2xl font-bold text-gray-900">{lichTrinh.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Thống kê hoàn thành */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <span className="text-2xl">
                                    <CircleCheck/>
                                </span>
                            </div>
                        </div>

                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {lichTrinh.filter(s => s.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>
                
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
                




            </div>
        </div>
      </>
   )
};