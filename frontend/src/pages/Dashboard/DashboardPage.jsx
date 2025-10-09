import { Bus, CheckCircle, Clock, MapPin, RouteIcon, Users, TrendingUp, AlertTriangle } from "lucide-react"



export default function DashboardPage() {
  
  const stats = { // Giả lập thống kê
    totalBuses: 24,
    activeBuses: 18,
    totalRoutes: 12,
    totalStudents: 450,
    onTimePerformance: 85,
    alerts: 3
  }
  

  const recentActivity = [ // Giả lập thông báo
    { id: 1, type: 'info', message: 'Bus #101 completed Route A', time: '2 minutes ago' },
    { id: 2, type: 'warning', message: 'Bus #205 is running 5 minutes late', time: '10 minutes ago' },
    { id: 3, type: 'success', message: 'All morning routes completed successfully', time: '1 hour ago' },
    { id: 4, type: 'info', message: 'New student John Doe assigned to Route B', time: '2 hours ago' }
  ]

  const getGreeting = () => { // Trạng thái xin chào
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-500" />
      default:
        return <Clock className="h-5 w-5 text-primary-500" />
    }
  }

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 
                     text-white">
        <h1 className="text-3xl font-bold">
            {getGreeting()}, người dùng {/* user*/}!
        </h1>
        <p className="mt-2 text-primary-100">
            Welcome to your Bus Management Dashboard
        </p>
      </div>

      {/* Thống kê giả lập */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="card"> {/* Thẻ Bus */}
            <div className="card-body">
               <div className="flex items-center">
                  <div className="flex-shrink-0"> 
                     <Bus className="h-8 w-8 text-primary-600" />
                  </div>

                  <div className="ml-4">
                     <h3 className="text-sm font-medium text-gray-500">Total Buses</h3>
                     <p className="text-2xl font-semibold text-gray-900">{stats.totalBuses}</p>
                  </div>

               </div>
               <div className="mt-4">
                  <span className="text-sm text-gray-600">
                     {stats.activeBuses} active, {stats.totalBuses - stats.activeBuses} inactive
                  </span>
               </div>
            </div>
         </div>

         <div className="card"> {/* Thẻ Tuyến */}
            <div className="card-body">
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <RouteIcon className="h-8 w-8 text-success-600" />
                  </div>
                  <div className="ml-4">
                     <h3 className="text-sm font-medium text-gray-500">Routes</h3>
                     <p className="text-2xl font-semibold text-gray-900">{stats.totalRoutes}</p>
                  </div>
               </div>
               <div className="mt-4">
                  <span className="text-sm text-gray-600">All routes operational</span>
               </div>
            </div>
         </div>

         <div className="card"> {/* Thẻ Students */}
            <div className="card-body">
               <div className="flex items-center">
                  <div className="flex-shrink-0">
                     <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                     <h3 className="text-sm font-medium text-gray-500">Students</h3>
                     <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                  </div>
               </div>
               <div className="mt-4">
                  <span className="text-sm text-gray-600">Across all routes</span>
               </div>
            </div>
         </div>

      </div>
      
      {/* Phần thân */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Hoạt động gần đây */}
         <div className="card">
            <div className="card-header">
               <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>

            <div className="card-body">
               <div className="space-y-4">
                  {recentActivity.map((activity) => (
                     <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                           {getActivityIcon(activity.type)} {/* Lấy cảnh báo */}
                        </div>

                        <div className="flex-1 min-w-0">
                           <p className="text-sm text-gray-900">{activity.message}</p>
                           <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                     </div>
                  ))}

               </div>
            </div>
         </div>

         {/* Quick Actions */}
         <div className="card">
            <div className="card-header">
               <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>

            <div className="card-body">
               <div className="grid grid-cols-2 gap-4"> 
                  {/* Nút GPS */}
                  <a 
                     href="/tracking"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg
                                 hover:bg-gray-50 transition-colors"
                  >
                     <MapPin className="h-8 w-8 text-primary-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">
                        Theo dõi GPS
                     </span>
                  </a>

                  {/* Nút Lịch trình */}
                  <a
                     href="/schedule"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg 
                                    hover:bg-gray-50 transition-colors"
                  >
                     <Clock className="h-8 w-8 text-success-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">
                        Lịch trình
                     </span>
                  </a>
               
                  {/* Nút quản lý BUS */}
                  <a
                     href="/buses"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg 
                                    hover:bg-gray-50 transition-colors"
                  >
                     <Bus className="h-8 w-8 text-warning-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">Quản lý xe</span>
                  </a>

                  {/* Nút Quản lý tuyến */}
                  <a
                     href="/routes"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg 
                                    hover:bg-gray-50 transition-colors"
                  >
                     <RouteIcon className="h-8 w-8 text-purple-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">Quản lý tuyến</span>
                  </a>
                  
                  {/* Nút Thông báo */}
                  <a
                     href="/notifications"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg 
                                    hover:bg-gray-50 transition-colors"
                  >
                     <AlertTriangle className="h-8 w-8 text-danger-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">
                     Quản lý thông báo ({stats.alerts})
                     </span>
                  </a>
                  
                  {/* Nút quản lý học sinh */}
                  <a
                     href="/students"
                     className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                     <Users className="h-8 w-8 text-green-600 mb-2" />
                     <span className="text-sm font-medium text-gray-900">Quản lý học sinh</span>
                  </a>
               </div>
            </div>
         </div>
      </div>


         <div className="card"> {/* Panel điều hành vận tải */}
            <div className="card-header">
               <h3 className="text-lg font-medium text-gray-900">Điều hành vận tải</h3>
            </div>

            <div className="card-body">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                     <p className="text-lg font-semibold text-orange-600">5 xe</p>
                     <p className="text-sm text-orange-700">Đang hoạt động</p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                     <p className="text-lg font-semibold text-red-600">2 cảnh báo</p>
                     <p className="text-sm text-red-700">Cần xử lý</p>
                  </div>
               </div>

               <p className="mt-4 text-gray-600">
                  Bạn có thể theo dõi và điều phối tất cả các xe buýt, quản lý lịch trình và 
                  xử lý các tình huống khẩn cấp.
               </p>
            </div>
         </div>

         <div className="card"> {/* Panel Lịch trình tài xế */}
            <div className="card-header">
               <h3 className="text-lg font-medium text-gray-900">Lịch trình hôm nay</h3>
            </div>

            <div className="card-body">
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                     <div>
                        <p className="font-medium text-blue-900">Ca sáng - Tuyến A</p>
                        <p className="text-sm text-blue-700">06:30 - 08:30 | Xe 29A-12345</p>
                     </div>

                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Sắp tới</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                     <div>
                        <p className="font-medium text-gray-900">Ca chiều - Tuyến A</p>
                        <p className="text-sm text-gray-600">16:00 - 18:00 | Xe 29A-12345</p>
                     </div>
                     <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">Đã lên lịch</span>
                  
                  </div>
               </div>
               <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-700">
                     <strong>Lưu ý:</strong> Hãy kiểm tra xe trước khi xuất phát và đảm bảo tuân thủ 
                                             lịch trình.
                  </p>
               </div>
            </div>
         </div>

         <div className="card"> {/* Panel Theo dõi con em */}
            <div className="card-header">
               <h3 className="text-lg font-medium text-gray-900">Theo dõi con em</h3>
            </div>

            <div className="card-body">
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                     <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                           <div>
                              <p className="font-medium text-green-900">Nguyễn Minh An</p>
                              <p className="text-sm text-green-700">Xe 29A-12345 • Tuyến A</p>
                           </div>

                        </div>
                           <span className="text-sm text-green-600">Đã lên xe</span> 
                     </div>
               
                     <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div>
                                 <p className="font-medium text-blue-900">Nguyễn Minh Hà</p>
                                 <p className="text-sm text-blue-700">Xe 29B-67890 • Tuyến B</p>
                              </div>

                        </div>
                        <span className="text-sm text-blue-600">Đang di chuyển</span>
                     </div>
               </div>
               
               <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700">
                     Bạn sẽ nhận được thông báo khi con em được đón/trả tại điểm dừng. 
                     Có thể theo dõi vị trí xe buýt real-time.
                  </p>
               </div>
            </div>
         </div>
      </div>
  )
};



