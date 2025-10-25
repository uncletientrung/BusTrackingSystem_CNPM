import { MessageCircle, Search, Send, Smile, MoreVertical, Circle, Phone, Video } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/**
 * Component chat giữa Admin và Driver
 * Hiển thị danh sách driver bên trái, chat box bên phải
 */
export default function AdminDriverChat() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data - Danh sách tài xế
  useEffect(() => {
    const mockDrivers = [
      { 
        id: 1, 
        name: 'Nguyễn Văn A', 
        phone: '0901234567', 
        license: 'B2-123456',
        status: 'online',
        lastMessage: 'Đã đến điểm dừng số 3',
        lastMessageTime: '10:30',
        unreadCount: 2,
        avatar: null
      },
      { 
        id: 2, 
        name: 'Trần Văn B', 
        phone: '0907654321', 
        license: 'B2-789012',
        status: 'online',
        lastMessage: 'Ok, tôi đã nhận được',
        lastMessageTime: '09:45',
        unreadCount: 0,
        avatar: null
      },
      { 
        id: 3, 
        name: 'Lê Văn C', 
        phone: '0903456789', 
        license: 'B2-345678',
        status: 'offline',
        lastMessage: 'Cảm ơn admin',
        lastMessageTime: 'Hôm qua',
        unreadCount: 0,
        avatar: null
      },
      { 
        id: 4, 
        name: 'Phạm Thị D', 
        phone: '0905678901', 
        license: 'B2-456789',
        status: 'online',
        lastMessage: 'Xe đang trong lộ trình',
        lastMessageTime: '10:15',
        unreadCount: 1,
        avatar: null
      },
      { 
        id: 5, 
        name: 'Hoàng Văn E', 
        phone: '0908765432', 
        license: 'B2-567890',
        status: 'offline',
        lastMessage: 'Đã hoàn thành chuyến',
        lastMessageTime: '08:20',
        unreadCount: 0,
        avatar: null
      },
    ];
    setDrivers(mockDrivers);
  }, []);

  // Mock messages cho từng driver
  useEffect(() => {
    if (selectedDriver) {
      const mockMessages = {
        1: [
          { id: 1, sender: 'driver', text: 'Chào admin, xe đã khởi hành đúng giờ', time: '08:00', date: 'Hôm nay' },
          { id: 2, sender: 'admin', text: 'Tốt lắm, chúc bạn lái xe cẩn thận', time: '08:02', date: 'Hôm nay' },
          { id: 3, sender: 'driver', text: 'Hiện tại đang có 15 học sinh trên xe', time: '08:30', date: 'Hôm nay' },
          { id: 4, sender: 'admin', text: 'Ok, cảm ơn bạn đã báo cáo', time: '08:32', date: 'Hôm nay' },
          { id: 5, sender: 'driver', text: 'Đã đến điểm dừng số 3', time: '10:30', date: 'Hôm nay' },
        ],
        2: [
          { id: 1, sender: 'admin', text: 'Chào bạn, hôm nay chuyến có thay đổi giờ', time: '07:00', date: 'Hôm nay' },
          { id: 2, sender: 'driver', text: 'Ok, tôi đã nhận được', time: '09:45', date: 'Hôm nay' },
        ],
        3: [
          { id: 1, sender: 'driver', text: 'Admin ơi, xe cần bảo trì định kỳ', time: '16:00', date: 'Hôm qua' },
          { id: 2, sender: 'admin', text: 'Để tôi kiểm tra lịch và báo lại bạn', time: '16:15', date: 'Hôm qua' },
          { id: 3, sender: 'driver', text: 'Cảm ơn admin', time: '16:20', date: 'Hôm qua' },
        ],
        4: [
          { id: 1, sender: 'admin', text: 'Xe đang ở đâu rồi?', time: '10:00', date: 'Hôm nay' },
          { id: 2, sender: 'driver', text: 'Xe đang trong lộ trình, sắp đến điểm 5', time: '10:15', date: 'Hôm nay' },
        ],
        5: [
          { id: 1, sender: 'driver', text: 'Đã hoàn thành chuyến buổi sáng', time: '08:20', date: 'Hôm nay' },
        ],
      };
      setMessages(mockMessages[selectedDriver.id] || []);
    }
  }, [selectedDriver]);

  // Auto scroll to bottom when new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lọc driver theo tìm kiếm
  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedDriver) {
      const message = {
        id: messages.length + 1,
        sender: 'admin',
        text: newMessage,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: 'Hôm nay'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Mô phỏng tự động trả lời sau 2 giây
      setTimeout(() => {
        const autoReply = {
          id: messages.length + 2,
          sender: 'driver',
          text: 'Đã nhận tin nhắn của admin!',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          date: 'Hôm nay'
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  // Tin nhắn nhanh
  const quickMessages = [
    'Xe đang ở đâu?',
    'Báo cáo tình hình',
    'Cảm ơn bạn',
    'Lái xe cẩn thận nhé'
  ];

  const handleQuickMessage = (text) => {
    setNewMessage(text);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar - Danh sách tài xế */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tin nhắn</h2>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm tài xế..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Driver List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <button
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedDriver?.id === driver.id ? 'bg-primary-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  {/* Status indicator */}
                  <Circle
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      driver.status === 'online' ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 truncate">{driver.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{driver.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{driver.lastMessage}</p>
                </div>

                {/* Unread badge */}
                {driver.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {driver.unreadCount}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Không tìm thấy tài xế</p>
            </div>
          )}
        </div>
      </div>

      {/* Right - Chat Box */}
      <div className="flex-1 flex flex-col">
        {selectedDriver ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedDriver.name.charAt(0)}
                  </div>
                  <Circle
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      selectedDriver.status === 'online' ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedDriver.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedDriver.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'admin'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Messages */}
            <div className="bg-white border-t border-gray-200 p-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickMessages.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(text)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full whitespace-nowrap transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No driver selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-20 w-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chọn tài xế để bắt đầu chat</h3>
              <p className="text-gray-500">Chọn một tài xế từ danh sách bên trái để xem tin nhắn</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
