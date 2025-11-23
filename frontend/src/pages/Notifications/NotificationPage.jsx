import { AlarmClock, Bell, BellElectric, BusFront, CalendarDays, Check, ClipboardCheck, ClipboardClock, ClockAlert, Construction, House, Info, Megaphone, MessageCircleWarning, Plus, PlusCircle, RefreshCcw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationAPI, AccountAPI } from "../../api/apiServices";
import toLocalString from "../../utils/DateFormated";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]); // Tất cả thông báo 
  const [filteredNotification, setFilteredNotification] = useState([]); // Danh sách sau lọc
  const [filter, setFilter] = useState('all'); // Kiểu lọc thông báo
  const [selectedNotifications, setSelectedNotifications] = useState([]); // Các thông báo được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Mở modal tạo / sửa
  const [editingNotification, setEditingNotification] = useState(null); // Nếu != null là đang sửa
  const [parents, setParents] = useState([]); // Danh sách phụ huynh (manq = 3)
  const [formNotification, setFormNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: [],
    priority: 'normal',
    scheduledTime: ''
  });
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  useEffect(() => {
    (async () => {
      try {
        const listThongbao = await NotificationAPI.getAllNotification();
        console.log('API data:', listThongbao);
        setNotifications(listThongbao);

        // Lấy danh sách tài khoản phụ huynh (manq = 3)
        const allAccounts = await AccountAPI.getAllAccount();
        const parentAccounts = allAccounts.filter(acc => acc.manq === 3);
        setParents(parentAccounts);
        console.log('Parent accounts:', parentAccounts);

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu ở Notification:', err);
      }
    })();
  }, []);

  // Hiển thị theo filter
  useEffect(() => {
    let filtered = notifications;
    // Lọc dữ liệu dữa trên kiểu
    if (filter !== 'all') {
      filtered = filtered.filter(tb => tb.loaithongbao == filter);
    }

    // // Sắp xếp dựa trên ngày tạo (return  >0 thì b đứng trước)
    // // setNotifications(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    setFilteredNotification(filtered);
  }, [notifications, filter]);

  const handleSelectNotification = (id) => { // Hàm xử lý tích chọn/ bỏ tích
    setSelectedNotifications(prev =>
      prev.includes(id) // Kiểm tra đã có trong mảng chưa
        ? prev.filter(item => item !== id) // Bỏ
        : [...prev, id] // Thêm
    );
  };

  const handleSelectAll = () => { // hàm xử lý tích chọn/ bỏ tích tất cả 
    setSelectedNotifications(
      selectedNotifications.length === filteredNotification.length
        ? []
        : filteredNotification.map(noti => noti.matb)
    );
  };

  const handleDeleteSelected = async () => { // Xóa nhiều thông báo
    if (selectedNotifications.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedNotifications.length} thông báo đã chọn?`)) return;
    try {
      await Promise.all(selectedNotifications.map(id => NotificationAPI.deleteNotification(id)));
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.matb)));
      setSelectedNotifications([]);
      alert('Đã xóa thông báo thành công!');
    } catch (err) {
      console.error('Lỗi xóa thông báo:', err);
      alert(err.message || 'Xóa thông báo thất bại');
    }
  };

  const resetForm = () => {
    setFormNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: [],
      priority: 'normal',
      scheduledTime: ''
    });
    setEditingNotification(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (noti) => {
    const reverseType = (t) => {
      switch (t) {
        case 'Đón học sinh': return 'pickup';
        case 'Trả học sinh': return 'dropoff';
        case 'Trễ giờ': return 'delay';
        case 'Lịch trình': return 'schedule';
        case 'Bảo trì': return 'maintenance';
        case 'Khẩn cấp': return 'emergency';
        default: return 'info';
      }
    };
    const reversePriority = (p) => p === 'Cao' ? 'high' : 'normal';
    const recipientsFromNoti = () => {
      const numericMaph = Number(noti.maph);
      if (numericMaph === 0) { // all parents
        return parents.map(p => p.matk);
      }
      return numericMaph ? [numericMaph] : [];
    };
    setFormNotification({
      title: noti.tieude,
      message: noti.noidung,
      type: reverseType(noti.loaithongbao),
      recipients: recipientsFromNoti(),
      priority: reversePriority(noti.mucdouutien),
      scheduledTime: noti.thoigiangui ? new Date(noti.thoigiangui).toISOString().slice(0,16) : ''
    });
    setEditingNotification(noti);
    setIsModalOpen(true);
  };

  const handleSaveNotification = async () => {
    if (!formNotification.title || !formNotification.message) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung!');
      return;
    }
    if (formNotification.recipients.length === 0) {
      alert('Vui lòng chọn ít nhất một phụ huynh!');
      return;
    }
    const mapType = (t) => {
      switch (t) {
        case 'pickup': return 'Đón học sinh';
        case 'dropoff': return 'Trả học sinh';
        case 'delay': return 'Trễ giờ';
        case 'schedule': return 'Lịch trình';
        case 'maintenance': return 'Bảo trì';
        case 'emergency': return 'Khẩn cấp';
        default: return 'Thông tin';
      }
    };
    const mapPriority = (p) => p === 'high' ? 'Cao' : 'Bình thường';
    const matx = currentUser?.manq === 2 ? Number(currentUser.matk) : 0;
    const allSelected = formNotification.recipients.length === parents.length && parents.length > 0;
    const buildPayload = (maphValue) => ({
      matx,
      maph: Number(maphValue),
      tieude: formNotification.title,
      noidung: formNotification.message,
      loaithongbao: mapType(formNotification.type),
      mucdouutien: mapPriority(formNotification.priority),
      thoigiangui: formNotification.scheduledTime || null,
      trangthai: formNotification.scheduledTime ? 1 : 2,
    });
    try {
      if (editingNotification) {
        // For edit: if previously all parents (maph==0) and still all selected -> keep 0.
        // If single or multiple selected now:
        //  - allSelected -> store 0
        //  - multiple (not all) -> take first recipient (cannot store list in int); suggest bulk create pattern but edit only updates one row.
        const maphToUse = allSelected ? 0 : Number(formNotification.recipients[0]);
        const res = await NotificationAPI.updateNotification(editingNotification.matb, buildPayload(maphToUse));
        const updated = res.notification || res;
        setNotifications(prev => prev.map(n => n.matb === updated.matb ? updated : n));
        alert('Cập nhật thông báo thành công!');
      } else {
        if (!allSelected && formNotification.recipients.length > 1) {
          // Bulk create one notification per parent ID
            const listPayload = formNotification.recipients.map(id => buildPayload(id));
            const res = await NotificationAPI.insertNhieuNotification({ DSFormThongBao: listPayload });
            const createdList = res.notifications || [];
            setNotifications(prev => [...createdList, ...prev]);
            alert('Đã tạo thông báo cho nhiều phụ huynh!');
        } else {
          const maphValue = allSelected ? 0 : Number(formNotification.recipients[0]);
          const res = await NotificationAPI.createNotification(buildPayload(maphValue));
          const created = res.notification || res;
          setNotifications(prev => [created, ...prev]);
          alert('Đã tạo thông báo thành công!');
        }
      }
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Lỗi lưu thông báo:', err);
      alert(err.message || (editingNotification ? 'Cập nhật thông báo thất bại' : 'Tạo thông báo thất bại'));
    }
  };

  const getNotificationIcon = (type) => { // Lấy icon màu của thông báo
    switch (type) {
      case 'Đón học sinh':
        return <BusFront className="text-blue-500" />;
      case 'Trả học sinh':
        return <House className="text-green-500" />;
      case 'Trễ giờ':
        return <ClockAlert className="text-yellow-500" />;
      case 'Lịch trình':
        return <ClipboardClock className="text-indigo-500" />;
      case 'Bảo trì':
        return <Construction className="text-orange-500" />;
      case 'Khẩn cấp':
        return <BellElectric className="text-red-600" />;
      case 'Thông tin':
        return <Info className="text-gray-500" />;
      default:
        return <Megaphone className="text-purple-500" />;
    }
  };

  const getNotificationColor = (type, priority) => { // Lấy màu nền thông báo
    if (priority === 'Cao') return 'border-l-red-500 bg-red-50';

    switch (type) {
      case 'Đón học sinh': return 'border-l-blue-500 bg-blue-50';
      case 'Trả học sinh': return 'border-l-green-500 bg-green-50';
      case 'Trễ giờ': return 'border-l-yellow-500 bg-yellow-50';
      case 'Lịch trình': return 'border-l-purple-500 bg-purple-50';
      case 'Bảo trì': return 'border-l-orange-500 bg-orange-50';
      case 'Khẩn cấp': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (trangthai) => { // Lấy màu trạng thái
    switch (trangthai) {
      case 2: return 'bg-green-100 text-green-800'; // Đã gửi
      case 1: return 'bg-yellow-100 text-yellow-800'; // Đã lên lịch
      case 0: return 'bg-red-100 text-red-800'; // Thất bại
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => { // Text trạng thái
    switch (status) {
      case 2: return 'Đã gửi';
      case 1: return 'Đã lên lịch';
      case 0: return 'Gửi thất bại';
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
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">{currentUser.manq == 1 ? "Quản lý thông báo" : "Thông báo"}</h1>
            </div>
          </div>
          {/* Nút xóa khi tích chọn*/}
          {(currentUser.manq == 1 || currentUser.manq == 2) && (
            <div className="flex space-x-3">
              {selectedNotifications.length !== 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span><Trash2 /></span>
                  <span>Xóa ({selectedNotifications.length})</span>
                </button>
              )}
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <span><PlusCircle /></span>
                <span>{'Tạo thông báo'}</span>
              </button>
            </div>
          )}
        </div>


        {/* Thống kê nhanh */}
        {currentUser.manq == 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thống kê thông báo */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <span className="h-6 w-6 text-white">
                    <Bell />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng thông báo</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredNotification.length}</p>
                </div>
              </div>
            </div>

            {/* Thống kê đã gửi */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-lg">
                  <span className="h-6 w-6 text-white"><ClipboardCheck /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đã gửi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredNotification.filter(tb => tb.trangthai === 2).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Thống kê đã lên lịch */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-orange-400 rounded-lg">
                  <span className="h-6 w-6 text-white"><ClipboardClock /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đã lên lịch</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredNotification.filter(tb => tb.trangthai === 1).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <option value="Đón học sinh">Đón học sinh</option>
                <option value="Trả học sinh">Trả học sinh</option>
                <option value="Trễ giờ">Trễ giờ</option>
                <option value="Lịch trình">Lịch trình</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
                <option value="Thông tin">Thông tin</option>
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
          <div className="px-6 py-4 border-b border-gray-200">
            {/* Title và tích chọn tất cả */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Danh sách thông báo</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Chọn tất cả</span>
                </label>
              </div>
            </div>
          </div>

          {/* Các thông báo */}
          <div className="divide-y divide-gray-200">
            {filteredNotification
              .filter(notification => {
                if (currentUser.manq === 1) {
                  return true;
                }
                if (currentUser.manq === 2) {
                  return notification.matx === currentUser.matk;
                }
                if (currentUser.manq === 3) {
                  const maphNumeric = Number(notification.maph);
                  if (maphNumeric === 0) return true; // all parents
                  return maphNumeric === Number(currentUser.matk); // only show if maph matches current parent's matk
                }
                return false;
              })
              .map(notification => (
                <div
                  key={notification.matb}
                  className={`p-6 border-l-4 ${getNotificationColor(notification.loaithongbao, notification.mucdouutien)} hover:bg-gray-50 transition-colors`}
                  onDoubleClick={() => (currentUser.manq == 1 || currentUser.manq == 2) && openEditModal(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Ô tích thông báo */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.matb)}
                      onChange={() => handleSelectNotification(notification.matb)}
                      className="mt-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {/* Icon thông báo */}
                    <div className="text-3xl">
                      {getNotificationIcon(notification.loaithongbao)}
                    </div>

                    {/* Nội dung thông báo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:underline"
                            onClick={() => (currentUser.manq == 1 || currentUser.manq == 2) && openEditModal(notification)}
                          >
                            {notification.tieude}
                          </h4>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {notification.noidung}
                          </p>
                        </div>

                        <div className="ml-4 text-right">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.trangthai)}`}>
                            {getStatusText(notification.trangthai)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span><CalendarDays /></span>
                          <span>{toLocalString(notification.thoigiantao)}</span>
                          {notification.thoigiangui && (
                            <>
                              <span><AlarmClock /></span>
                              <span>Lên lịch: {formatTime(notification.thoigiangui)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {notification.mucdouutien === 'Cao' && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            <MessageCircleWarning />
                          </span>
                          <span>Ưu tiên cao</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

          </div>

          {/* Xử lý khi không có thông báo nào */}
          {filteredNotification.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mt-4">Không có thông báo nào</p>
            </div>
          )}
        </div>

        {/* Modal tạo / sửa thông báo */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              {/* title và nút X */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</h3>
                <button
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X></X>
                </button>
              </div>

              {/* Nội dung tạo thông báo */}
              <div className="space-y-4">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                  <input
                    type="text"
                    value={formNotification.title}
                    onChange={(e) => setFormNotification({ ...formNotification, title: e.target.value })}
                    placeholder="Nhập tiêu đề thông báo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Nội dung */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                  <textarea
                    value={formNotification.message}
                    onChange={(e) => setFormNotification({ ...formNotification, message: e.target.value })}
                    placeholder="Nhập nội dung thông báo..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Kiểu thông báo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thông báo</label>
                    <select
                      value={formNotification.type}
                      onChange={(e) => setFormNotification({ ...formNotification, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Thông tin</option>
                      <option value="pickup">Đón học sinh</option>
                      <option value="dropoff">Trả học sinh</option>
                      <option value="delay">Trễ giờ</option>
                      <option value="schedule">Lịch trình</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="emergency">Khẩn cấp</option>
                    </select>
                  </div>

                  {/* Mức độ ưu tiên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                    <select
                      value={formNotification.priority}
                      onChange={(e) => setFormNotification({ ...formNotification, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Bình thường</option>
                      <option value="high">Cao</option>
                    </select>
                  </div>
                </div>

                {/* Người nhận */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Người nhận (Phụ huynh)</label>
                  <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                    {/* Checkbox Tất cả */}
                    <label className="flex items-center space-x-2 cursor-pointer sticky top-0 bg-white pb-2 border-b">
                      <input
                        type="checkbox"
                        checked={formNotification.recipients.length === parents.length && parents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormNotification({ ...formNotification, recipients: parents.map(p => p.matk) });
                          } else {
                            setFormNotification({ ...formNotification, recipients: [] });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Tất cả phụ huynh ({parents.length})</span>
                    </label>

                    {/* Danh sách phụ huynh */}
                    {parents.length === 0 ? (
                      <p className="text-sm text-gray-500 ml-6">Không có phụ huynh nào</p>
                    ) : (
                      parents.map(parent => (
                        <label key={parent.matk} className="flex items-center space-x-2 cursor-pointer ml-6 hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={formNotification.recipients.includes(parent.matk)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newRecipients = [...formNotification.recipients, parent.matk];
                                setFormNotification({ ...formNotification, recipients: newRecipients });
                              } else {
                                const newRecipients = formNotification.recipients.filter(r => r !== parent.matk);
                                setFormNotification({ ...formNotification, recipients: newRecipients });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">ID: {parent.matk}</span> - {parent.tendangnhap}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Đã chọn: {formNotification.recipients.length} phụ huynh</p>
                </div>

                {/* Lịch gửi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lên lịch gửi (tùy chọn)</label>
                  <input
                    type="datetime-local"
                    value={formNotification.scheduledTime}
                    onChange={(e) => setFormNotification({ ...formNotification, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống để gửi ngay lập tức</p>
                </div>
              </div>

              {/* Nút hủy và nút gửi ngay/ lên lịch */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>

                <button
                  onClick={handleSaveNotification}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingNotification ? (formNotification.scheduledTime ? 'Cập nhật & Lên lịch' : 'Cập nhật ngay') : (formNotification.scheduledTime ? 'Lên lịch gửi' : 'Gửi ngay')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div >
    </>
  )
};