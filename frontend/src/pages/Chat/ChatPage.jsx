import { MessageCircle, Search, Send, Smile, MoreVertical, Circle, Phone, Video } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import socketService from '../../services/socketService';
import { apiClient } from '../../api/api';

/**
 * Component chat giữa Admin và Driver - REALTIME với Socket.IO
 * Hiển thị danh sách driver bên trái, chat box bên phải
 */
export default function AdminDriverChat() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Khởi tạo user hiện tại và Socket.IO
  useEffect(() => {
    initializeChat();
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Load danh sách tài xế từ API
  useEffect(() => {
    loadDriverList();
  }, [currentUser]);

  // Load lịch sử tin nhắn khi chọn tài xế
  useEffect(() => {
    if (selectedDriver && currentUser) {
      loadChatHistory(selectedDriver.driver_id);
    }
  }, [selectedDriver, currentUser]);

  // Auto scroll to bottom when new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Re-setup Socket listeners khi selectedDriver hoặc currentUser thay đổi
  useEffect(() => {
    if (isConnected && currentUser) {
      console.log('🔄 Re-setup Socket listeners vì selectedDriver/currentUser thay đổi');
      setupSocketListeners();
    }
  }, [selectedDriver, currentUser, isConnected]);

  /**
   * Khởi tạo kết nối Socket.IO
   */
  const initializeChat = async () => {
    try {
      // Lấy thông tin user từ sessionStorage (hệ thống đăng nhập thật)
      const userStr = sessionStorage.getItem('currentUser');
      if (!userStr) {
        console.error('❌ Chưa đăng nhập');
        alert('Vui lòng đăng nhập để sử dụng chat!');
        return;
      }

      const account = JSON.parse(userStr);
      console.log('📋 Account từ sessionStorage:', account);
      // account = {matk, tendangnhap, matkhau, manq, trangthai}
      
      // Xác định role từ manq
      let role, userId;
      
      if (account.manq === 1) {
        role = 'admin';
        userId = account.matk; // Admin dùng matk làm ID
      } else if (account.manq === 2) {
        role = 'taixe';
        // Tài xế cần query mand từ bảng nguoidung
        try {
          const response = await fetch(`http://localhost:5000/api/users/by-account/${account.matk}`);
          const userData = await response.json();
          userId = userData.mand;
          console.log('👤 Tài xế mand:', userId);
        } catch (err) {
          console.error('❌ Không lấy được thông tin tài xế:', err);
          userId = account.matk; // Fallback
        }
      } else {
        console.error('❌ manq không hợp lệ:', account.manq);
        return;
      }

      // Luu user với format chuẩn
      const user = {
        matk: account.matk,
        manq: account.manq,
        mand: userId,
        tendangnhap: account.tendangnhap
      };
      
      setCurrentUser(user);
      console.log('✅ User info:', { role, userId, manq: account.manq });

      if (!role) {
        console.error('❌ Role không hợp lệ:', { role });
        return;
      }

      if (!userId && userId !== 0) {
        console.error('❌ userId không hợp lệ:', { userId });
        return;
      }

      // Kết nối Socket.IO
      console.log('⏳ Đang kết nối Socket.IO...');
      await socketService.connect(userId, role);
      setIsConnected(true);
      console.log('✅ Socket.IO đã kết nối, isConnected = true');

      // Setup listeners
      setupSocketListeners();

    } catch (error) {
      console.error('Lỗi khởi tạo chat:', error);
      setIsConnected(false);
    }
  };

  /**
   * Setup các Socket event listeners
   */
  const setupSocketListeners = () => {
    // Remove listeners cũ để tránh duplicate
    socketService.socket?.off('receiveMessage');
    socketService.socket?.off('messageSent');
    socketService.socket?.off('messageError');
    
    // Nhận tin nhắn mới
    socketService.onReceiveMessage((message) => {
      console.log('📩 Nhận tin nhắn:', message);
      
      if (!selectedDriver || !currentUser) {
        console.log('❌ Chưa chọn driver hoặc chưa có user');
        return;
      }

      // Lấy role và ID từ currentUser (format mới)
      const myRole = currentUser.manq === 1 ? 'admin' : 'taixe';
      const myId = currentUser.mand;
      const partnerId = selectedDriver.driver_id;

      // Kiểm tra tin nhắn có liên quan đến cuộc chat hiện tại không
      const isRelevant = (
        // Tin nhắn từ partner gửi cho tôi
        (message.sender_id === partnerId && message.receiver_id === myId) ||
        // Tin nhắn từ tôi gửi cho partner (đã được gửi thành công)
        (message.sender_id === myId && message.receiver_id === partnerId)
      );

      console.log('🔍 Check tin nhắn:', {
        myId, myRole, partnerId,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        isRelevant
      });

      if (isRelevant) {
        console.log('✅ Tin nhắn liên quan, chuẩn bị thêm vào danh sách');
        const formattedMessage = formatMessage(message);
        console.log('📝 Formatted message:', formattedMessage);
        
        setMessages(prevMessages => {
          // Kiểm tra tin nhắn đã tồn tại chưa (chỉ check bằng id thật từ database)
          const exists = prevMessages.some(m => m.id === message.id);
          if (exists) {
            console.log('⚠️ Tin nhắn đã tồn tại:', message.id);
            return prevMessages;
          }
          console.log('🎉 THÊM TIN NHẮN MỚI - Force re-render');
          const newMessages = [...prevMessages, formattedMessage];
          console.log('📊 Số tin nhắn sau khi thêm:', newMessages.length);
          return newMessages;
        });
      }

      // Cập nhật danh sách tài xế
      loadDriverList();
    });

    // Tin nhắn đã gửi thành công
    socketService.onMessageSent((message) => {
      console.log('Tin nhắn đã gửi:', message);
    });

    // Lỗi gửi tin nhắn
    socketService.onMessageError((error) => {
      console.error('Lỗi gửi tin nhắn:', error);
      alert('Không thể gửi tin nhắn: ' + (error.error || 'Lỗi không xác định'));
    });

    // Người khác đang gõ
    socketService.onUserTyping((data) => {
      if (selectedDriver && data.userId === selectedDriver.driver_id) {
        setIsTyping(true);
      }
    });

    // Người khác ngừng gõ
    socketService.onUserStopTyping((data) => {
      if (selectedDriver && data.userId === selectedDriver.driver_id) {
        setIsTyping(false);
      }
    });
  };

  /**
   * Load danh sách người chat (Admin thì thấy tài xế, Tài xế thì thấy admin)
   */
  const loadDriverList = async () => {
    try {
      if (!currentUser) return;

      const role = currentUser.manq === 1 ? 'admin' : 'taixe';

      if (role === 'admin') {
        // Admin: Load danh sách tài xế
        const adminId = currentUser.mand;
        const response = await apiClient.get(`/messages/drivers/${adminId}`);
        
        if (response.data.success) {
          const formattedDrivers = response.data.data.map(driver => ({
            id: driver.driver_id,
            driver_id: driver.driver_id,
            name: driver.driver_name,
            phone: driver.driver_phone,
            license: driver.license || 'N/A',
            status: 'online',
            lastMessage: driver.last_message || 'Chưa có tin nhắn',
            lastMessageTime: formatTime(driver.last_message_time),
            unreadCount: driver.unread_count || 0,
            avatar: null
          }));
          
          setDrivers(formattedDrivers);
        }
      } else {
        // Tài xế: Hiển thị Admin để chat
        setDrivers([{
          id: 1,
          driver_id: 1,
          name: 'Admin Hệ Thống',
          phone: '0123456789',
          license: 'ADMIN',
          status: 'online',
          lastMessage: 'Bắt đầu chat với admin',
          lastMessageTime: '',
          unreadCount: 0,
          avatar: null
        }]);
      }
    } catch (error) {
      console.error('Lỗi load danh sách:', error);
    }
  };

  /**
   * Load lịch sử chat (Admin ↔ Tài xế)
   */
  const loadChatHistory = async (partnerId) => {
    try {
      const role = currentUser.manq === 1 ? 'admin' : 'taixe';
      const userId = currentUser.mand;
      
      let adminId, driverId;
      if (role === 'admin') {
        adminId = userId;
        driverId = partnerId;
      } else {
        adminId = partnerId; // partnerId là admin (1)
        driverId = userId;
      }
      
      const response = await apiClient.get(`/messages/history/${adminId}/${driverId}`);
      
      if (response.data.success) {
        const formattedMessages = response.data.data.map(formatMessage);
        setMessages(formattedMessages);

        // Đánh dấu đã đọc
        const partnerRole = role === 'admin' ? 'taixe' : 'admin';
        socketService.markAsRead({
          userId: userId,
          userRole: role,
          partnerId: partnerId,
          partnerRole: partnerRole
        });
      }
    } catch (error) {
      console.error('Lỗi load lịch sử:', error);
    }
  };

  /**
   * Format tin nhắn từ API sang UI format
   */
  const formatMessage = (msg) => {
    return {
      id: msg.id,
      sender_id: msg.sender_id,
      sender_role: msg.sender_role,
      sender: msg.sender_role === 'admin' ? 'admin' : 'driver',
      text: msg.content,
      time: formatTime(msg.timestamp),
      date: formatDate(msg.timestamp),
      timestamp: msg.timestamp
    };
  };

  /**
   * Format thời gian
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Format ngày tháng
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Hôm nay';
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    }
    
    return date.toLocaleDateString('vi-VN');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lọc driver theo tìm kiếm
  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gửi tin nhắn realtime
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDriver || !currentUser || !isConnected) {
      console.log('❌ Không thể gửi:', { 
        hasMessage: !!newMessage.trim(), 
        hasDriver: !!selectedDriver, 
        hasUser: !!currentUser, 
        isConnected 
      });
      return;
    }

    const role = currentUser.role 
      ? (currentUser.role === 'admin' ? 'admin' : 'taixe')
      : (currentUser.manq === 1 ? 'admin' : 'taixe');
    
    let userId;
    if (currentUser.id) {
      if (currentUser.id === 'U001') userId = 1;
      else if (currentUser.id.startsWith('D')) userId = parseInt(currentUser.id.replace('D', ''));
      else userId = parseInt(currentUser.id.replace('U', '')) || 1;
    } else {
      userId = currentUser.mand;
    }
    
    const receiverId = selectedDriver.driver_id;
    const receiverRole = role === 'admin' ? 'taixe' : 'admin';
    
    const messageData = {
      sender_id: userId,
      receiver_id: receiverId,
      sender_role: role,
      receiver_role: receiverRole,
      content: newMessage.trim()
    };

    console.log('📤 Gửi tin nhắn:', messageData);
    
    // Gửi qua Socket.IO (không dùng optimistic update)
    socketService.sendMessage(messageData);
    setNewMessage('');
    
    // Ngừng typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketService.sendStopTyping({
      userId: userId,
      userRole: role,
      receiverId: receiverId,
      receiverRole: receiverRole
    });
  };

  // Xử lý khi gõ tin nhắn (typing indicator)
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!selectedDriver || !currentUser) return;

    const role = currentUser.role 
      ? (currentUser.role === 'admin' ? 'admin' : 'taixe')
      : (currentUser.manq === 1 ? 'admin' : 'taixe');
    
    let userId;
    if (currentUser.id) {
      if (currentUser.id === 'U001') userId = 1;
      else if (currentUser.id.startsWith('D')) userId = parseInt(currentUser.id.replace('D', ''));
      else userId = parseInt(currentUser.id.replace('U', '')) || 1;
    } else {
      userId = currentUser.mand;
    }
    
    const receiverRole = role === 'admin' ? 'taixe' : 'admin';

    // Gửi sự kiện typing
    socketService.sendTyping({
      userId: userId,
      userRole: role,
      receiverId: selectedDriver.driver_id,
      receiverRole: receiverRole
    });

    // Reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Sau 2 giây không gõ thì gửi stopTyping
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping({
        userId: userId,
        userRole: role,
        receiverId: selectedDriver.driver_id,
        receiverRole: receiverRole
      });
    }, 2000);
  };

  // Xử lý Enter để gửi
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Tin nhắn</h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <Circle className={`w-2 h-2 ${isConnected ? 'fill-green-600' : 'fill-red-600'}`} />
              {isConnected ? 'Trực tuyến' : 'Ngoại tuyến'}
            </div>
          </div>
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
              {messages.map((message) => {
                // Xác định xem tin nhắn này có phải của mình không dựa vào sender_id
                const myId = currentUser?.mand;
                const isMyMessage = message.sender_id === myId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        isMyMessage
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMyMessage ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
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
                  placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => {
                    console.log('🖱️ Click nút Send:', { 
                      hasMessage: !!newMessage.trim(), 
                      isConnected,
                      isDisabled: !newMessage.trim() || !isConnected
                    });
                    handleSendMessage();
                  }}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isConnected ? 'Đang kết nối...' : 'Gửi tin nhắn'}
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
