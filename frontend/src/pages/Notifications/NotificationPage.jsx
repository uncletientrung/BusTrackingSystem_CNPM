import { Bell, BellElectric, BusFront, Check, ClipboardClock, ClockAlert, Construction, House, Info, Megaphone, Plus, PlusCircle, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationPage() {
   const [notifications, setNotifications] = useState([]); // Tất cả thông báo khi lọc
   const [filter, setFilter] = useState('all'); // Kiểu lọc thông báo
   const [selectedNotifications, setSelectedNotifications] = useState([]); // Thông báo được chọn
   const [isCreating, setIsCreating] = useState(false); // Trạng thái tạo 
   const [newNotification, setNewNotification] = useState({ // Giả lập dữ liệu khi tạo
      title: '',
      message: '',
      type: 'info',
      recipients: 'all',
      priority: 'normal',
      scheduledTime: ''
   });

   // Demo notifications data
   useEffect(() => {
      const demoNotifications = [
         {
            id: 1,
            title: 'Xe buýt BUS-001 đã đến điểm Bến Thành',
            message: 'Con bạn đã được đón tại điểm Bến xe Bến Thành lúc 7:15 AM. Xe đang trên đường đến trường.',
            type: 'pickup',
            priority: 'high',
            recipients: ['Nguyễn Thị A', 'Trần Văn B'],
            createdAt: '2024-10-04T07:15:00',
            status: 'sent',
            readBy: 1,
            totalRecipients: 2,
            channel: ['sms', 'app']
         },
         {
            id: 2,
            title: 'Thông báo thay đổi lịch trình',
            message: 'Do sửa chữa đường, tuyến Quận 1 - Quận 7 sẽ thay đổi lộ trình từ ngày mai. Thời gian đón trả không đổi.',
            type: 'schedule',
            priority: 'normal',
            recipients: 'all',
            createdAt: '2024-10-04T06:30:00',
            status: 'sent',
            readBy: 15,
            totalRecipients: 25,
            channel: ['sms', 'app', 'email']
         },
         {
            id: 3,
            title: 'Xe buýt BUS-002 bị trễ 15 phút',
            message: 'Xe buýt BUS-002 tuyến Thủ Đức - Quận 3 đang bị trễ 15 phút do tắc đường. Dự kiến đến điểm đón lúc 7:45 AM.',
            type: 'delay',
            priority: 'high',
            recipients: ['Lê Thị C', 'Phạm Văn D', 'Hoàng Thị E'],
            createdAt: '2024-10-04T07:30:00',
            status: 'sent',
            readBy: 2,
            totalRecipients: 3,
            channel: ['app', 'sms']
         },
         {
            id: 4,
            title: 'Bảo trì xe buýt định kỳ',
            message: 'Xe buýt BUS-003 sẽ được bảo trì định kỳ vào Chủ nhật tuần sau. Các chuyến đi sẽ được thay thế bằng xe khác.',
            type: 'maintenance',
            priority: 'normal',
            recipients: 'all',
            createdAt: '2024-10-03T18:00:00',
            status: 'scheduled',
            readBy: 0,
            totalRecipients: 30,
            scheduledTime: '2024-10-05T08:00:00',
            channel: ['email', 'app']
         },
         {
            id: 5,
            title: 'Hoàn thành chuyến đi an toàn',
            message: 'Con bạn đã được trả an toàn tại điểm Trường THCS ABC lúc 7:45 AM. Cảm ơn quý phụ huynh đã tin tưởng dịch vụ.',
            type: 'dropoff',
            priority: 'normal',
            recipients: ['Nguyễn Thị A'],
            createdAt: '2024-10-04T07:45:00',
            status: 'sent',
            readBy: 1,
            totalRecipients: 1,
            channel: ['app', 'sms']
         }
      ];
      const filtered = filter === 'all' // Lọc dữ liệu dữa trên kiểu
         ? demoNotifications
         : demoNotifications.filter(n => n.type === filter);
      // Sắp xếp dựa trên ngày tạo (return  >0 thì b đứng trước)
      setNotifications(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
   }, [filter]);

   const handleSelectNotification = (id) => { // Hàm xử lý tích chọn/ bỏ tích
      setSelectedNotifications(prev =>
         prev.includes(id) // Kiểm tra đã có trong mảng chưa
            ? prev.filter(item => item !== id)
            : [...prev, id]
      );
   };

   const handleSelectAll = () => { // hàm xử lý tích chọn/ bỏ tích tất cả 
      setSelectedNotifications(
         selectedNotifications.length === notifications.length
            ? []
            : notifications.map(n => n.id)
      );
   };

   const handleDeleteSelected = () => { // Hàm xử lý xóa thông báo
      if (selectedNotifications.length === 0) return;

      if (confirm(`Bạn có chắc muốn xóa ${selectedNotifications.length} thông báo đã chọn?`)) {
         setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
         setSelectedNotifications([]);
         alert('Đã xóa thông báo thành công!');
      }
   };

   const handleCreateNotification = () => { // Hàm xử lý tạo thông báo
      if (!newNotification.title || !newNotification.message) {
         alert('Vui lòng điền đầy đủ tiêu đề và nội dung!');
         return;
      }

      const notification = {
         id: Math.max(...notifications.map(n => n.id)) + 1,
         ...newNotification,
         createdAt: new Date().toISOString(),
         status: newNotification.scheduledTime ? 'scheduled' : 'sent',
         readBy: 0,
         totalRecipients: newNotification.recipients === 'all' ? 25 : 1,
         channel: ['app', 'sms']
      };

      setNotifications([notification, ...notifications]);
      setNewNotification({
         title: '',
         message: '',
         type: 'info',
         recipients: 'all',
         priority: 'normal',
         scheduledTime: ''
      });
      setIsCreating(false);
      alert('Đã tạo thông báo thành công!');
   };

   const getNotificationIcon = (type) => { // Lấy icon màu của thông báo
      switch (type) {
         case 'pickup':
            return <BusFront className="text-blue-500" />;        // Đón
         case 'dropoff':
            return <House className="text-green-500" />;          // Trả
         case 'delay':
            return <ClockAlert className="text-yellow-500" />;    // Trễ
         case 'schedule':
            return <ClipboardClock className="text-indigo-500" />;// Lịch trình
         case 'maintenance':
            return <Construction className="text-orange-500" />;  // Bảo trì
         case 'emergency':
            return <BellElectric className="text-red-600" />;     // Khẩn cấp
         case 'info':
            return <Info className="text-gray-500" />;            // Thông báo chung
         default:
            return <Megaphone className="text-purple-500" />;     // Khác
      }
   };

   const getNotificationColor = (type, priority) => { // Lấy màu nền thông báo
      if (priority === 'high') return 'border-l-red-500 bg-red-50';

      switch (type) {
         case 'pickup': return 'border-l-blue-500 bg-blue-50';
         case 'dropoff': return 'border-l-green-500 bg-green-50';
         case 'delay': return 'border-l-yellow-500 bg-yellow-50';
         case 'schedule': return 'border-l-purple-500 bg-purple-50';
         case 'maintenance': return 'border-l-orange-500 bg-orange-50';
         case 'emergency': return 'border-l-red-500 bg-red-50';
         default: return 'border-l-gray-500 bg-gray-50';
      }
   };

   const getStatusText = (status) => { // Text trạng thái
      switch (status) {
         case 'sent': return 'Đã gửi';
         case 'scheduled': return 'Đã lên lịch';
         case 'failed': return 'Gửi thất bại';
         case 'draft': return 'Nháp';
         default: return status;
      }
   };

   const formatTime = (dateString) => { // Định dạng format ngày giờ
      return new Date(dateString).toLocaleString('vi-VN');
   };
   return (
      <>
         <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
               {/* Tiêu đề */}
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                     <span><Bell /></span>
                     <span>Quản lý thông báo</span>
                  </h1>
                  <p className="text-gray-600 mt-1">Gửi thông báo đến phụ huynh của học sinh</p>
               </div>

               {/* Nút xóa khi tích chọn*/}
               <div className="flex space-x-3">
                  {/* Nút xóa */}
                  {selectedNotifications.length == 0 && (
                     <button
                        onClick={handleDeleteSelected}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                     >
                        <span><Trash2 /></span>
                        <span>Xóa ({selectedNotifications.length})</span>
                     </button>
                  )}

                  {/* Nút tạo thông báo */}
                  <button
                     onClick={() => setIsCreating(true)}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                     <span><PlusCircle /></span>
                     <span>Tạo thông báo</span>
                  </button>
               </div>
            </div>

            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Thống kê thông báo */}
               <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                     <div className="p-3 bg-blue-100 rounded-full">
                        <span className="text-2xl"><Megaphone /></span>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Tổng thông báo</p>
                        <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                     </div>
                  </div>
               </div>

               {/* Thống kê đã gửi */}
               <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                     <div className="p-3 bg-green-100 rounded-full">
                        <span className="text-2xl"><Check /></span>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Đã gửi</p>
                        <p className="text-2xl font-bold text-gray-900">
                           {notifications.filter(n => n.status === 'sent').length}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Thống kê đã lên lịch */}
               <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                     <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl"><ClipboardClock /></span>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Đã lên lịch</p>
                        <p className="text-2xl font-bold text-gray-900">
                           {notifications.filter(n => n.status === 'scheduled').length}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tìm kiếm và bộ lọc */}
            <div className="bg-white p-6 rounded-lg shadow-md">
               <div className="flex flex-wrap items-center gap-4">
                  {/* Ô Loại thông báo */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Loại thông báo</label>
                     <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="all">Tất cả</option>
                        <option value="pickup">Đón học sinh</option>
                        <option value="dropoff">Trả học sinh</option>
                        <option value="delay">Trễ giờ</option>
                        <option value="schedule">Lịch trình</option>
                        <option value="maintenance">Bảo trì</option>
                        <option value="emergency">Khẩn cấp</option>
                        <option value="info">Thông tin</option>
                     </select>
                  </div>

                  <div>
                     {/* Label ẩn */}
                     <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
                        Ẩn
                     </label>
                     <button
                        onClick={() => window.location.reload()}
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

            {/* Danh sách thông báo */}
            <div className="bg-white rounded-lg shadow-md">
               aaaa
            </div>

         </div>
      </>
   )
};