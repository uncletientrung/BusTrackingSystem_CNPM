/**
 * DriverChatPage.jsx
 * Giao diện chat cho Tài xế
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Trang này cho phép Tài xế:
 *        - Chat trực tiếp với Admin
 *        - Gửi/nhận tin nhắn realtime
 *        - Xem lịch sử chat
 */

import React, { useState, useEffect, useRef } from 'react';
import socketService from '../../services/socketService';
import { apiClient } from '../../api/api';
import './DriverChatPage.css';

const DriverChatPage = () => {
    // State quản lý
    const [driverId] = useState(4); // ID Tài xế (lấy từ session/localStorage trong thực tế)
    const [adminId] = useState(1); // ID Admin mặc định
    const [driverInfo, setDriverInfo] = useState(null); // Thông tin tài xế
    const [messages, setMessages] = useState([]); // Lịch sử tin nhắn
    const [inputMessage, setInputMessage] = useState(''); // Tin nhắn đang nhập
    const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối Socket
    const [isTyping, setIsTyping] = useState(false); // Admin đang gõ
    const [loading, setLoading] = useState(false); // Loading state
    const [unreadCount, setUnreadCount] = useState(0); // Số tin nhắn chưa đọc

    const messagesEndRef = useRef(null); // Ref để scroll xuống cuối
    const typingTimeoutRef = useRef(null); // Ref cho typing timeout

    /**
     * Khởi tạo: Kết nối Socket.IO và load dữ liệu
     */
    useEffect(() => {
        initializeChat();

        // Cleanup khi unmount
        return () => {
            socketService.disconnect();
        };
    }, []);

    /**
     * Scroll xuống cuối mỗi khi có tin nhắn mới
     */
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    /**
     * Khởi tạo kết nối chat
     */
    const initializeChat = async () => {
        try {
            setLoading(true);

            // 1. Load thông tin tài xế (có thể lấy từ API)
            // Giả sử thông tin tài xế đã có trong localStorage
            setDriverInfo({
                matx: driverId,
                hoten: 'Lê Văn Cường', // Thay bằng dữ liệu thực
                sdt: '0901122334'
            });

            // 2. Kết nối Socket.IO
            await socketService.connect(driverId, 'taixe');
            setIsConnected(true);
            console.log('[DriverChat] Đã kết nối Socket.IO');

            // 3. Đăng ký các event listeners
            setupSocketListeners();

            // 4. Load lịch sử tin nhắn với Admin
            await loadChatHistory();

            // 5. Đánh dấu tin nhắn đã đọc
            socketService.markAsRead({
                userId: driverId,
                userRole: 'taixe',
                partnerId: adminId,
                partnerRole: 'admin'
            });

        } catch (error) {
            console.error('[DriverChat] Lỗi khởi tạo:', error);
            alert('Không thể kết nối chat. Vui lòng kiểm tra server.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Thiết lập các Socket listeners
     */
    const setupSocketListeners = () => {
        // Nhận tin nhắn mới từ Admin
        socketService.onReceiveMessage((message) => {
            console.log('[DriverChat] Nhận tin nhắn:', message);
            setMessages(prev => [...prev, message]);
            
            // Đánh dấu đã đọc
            socketService.markAsRead({
                userId: driverId,
                userRole: 'taixe',
                partnerId: adminId,
                partnerRole: 'admin'
            });
        });

        // Xác nhận tin nhắn đã gửi thành công
        socketService.onMessageSent((message) => {
            console.log('[DriverChat] Tin nhắn đã gửi:', message);
        });

        // Xử lý lỗi
        socketService.onMessageError((error) => {
            console.error('[DriverChat] Lỗi gửi tin nhắn:', error);
            alert('Lỗi khi gửi tin nhắn: ' + error.error);
        });

        // Admin đang gõ
        socketService.onUserTyping((data) => {
            if (data.userId === adminId) {
                setIsTyping(true);
            }
        });

        // Admin ngừng gõ
        socketService.onUserStopTyping((data) => {
            if (data.userId === adminId) {
                setIsTyping(false);
            }
        });
    };

    /**
     * Load lịch sử tin nhắn với Admin
     */
    const loadChatHistory = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/messages/history/${adminId}/${driverId}`);
            
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error('[DriverChat] Lỗi load lịch sử:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gửi tin nhắn
     */
    const handleSendMessage = () => {
        if (!inputMessage.trim()) {
            return;
        }

        const messageData = {
            sender_id: driverId,
            receiver_id: adminId,
            sender_role: 'taixe',
            receiver_role: 'admin',
            content: inputMessage.trim()
        };

        // Gửi qua Socket.IO
        socketService.sendMessage(messageData);

        // Thêm tin nhắn vào UI ngay lập tức (optimistic update)
        const newMessage = {
            ...messageData,
            timestamp: new Date().toISOString(),
            id: Date.now() // Temporary ID
        };
        setMessages(prev => [...prev, newMessage]);

        // Clear input
        setInputMessage('');

        // Ngừng typing
        socketService.sendStopTyping({
            userId: driverId,
            userRole: 'taixe',
            receiverId: adminId,
            receiverRole: 'admin'
        });
    };

    /**
     * Xử lý khi gõ phím Enter
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /**
     * Xử lý khi đang nhập tin nhắn
     */
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);

        // Gửi sự kiện typing
        socketService.sendTyping({
            userId: driverId,
            userRole: 'taixe',
            receiverId: adminId,
            receiverRole: 'admin'
        });

        // Reset timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Sau 2 giây không gõ thì gửi stopTyping
        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendStopTyping({
                userId: driverId,
                userRole: 'taixe',
                receiverId: adminId,
                receiverRole: 'admin'
            });
        }, 2000);
    };

    /**
     * Scroll xuống cuối danh sách tin nhắn
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    /**
     * Format thời gian hiển thị
     */
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    /**
     * Format ngày tháng
     */
    const formatDate = (timestamp) => {
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

    /**
     * Render UI
     */
    return (
        <div className="driver-chat-container">
            {/* Header */}
            <div className="driver-chat-header">
                <div className="header-left">
                    <div className="admin-avatar">👨‍💼</div>
                    <div className="admin-info">
                        <h2>Admin</h2>
                        <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
                            {isConnected ? '🟢 Trực tuyến' : '🔴 Ngoại tuyến'}
                        </div>
                    </div>
                </div>
                <button onClick={loadChatHistory} className="refresh-btn" title="Làm mới">
                    🔄
                </button>
            </div>

            {/* Messages */}
            <div className="driver-messages-container">
                {loading ? (
                    <div className="loading-messages">
                        <div className="spinner"></div>
                        <p>Đang tải tin nhắn...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="empty-chat">
                        <div className="empty-icon">💬</div>
                        <h3>Chưa có tin nhắn nào</h3>
                        <p>Hãy gửi tin nhắn đầu tiên cho Admin</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            // Hiển thị ngày nếu là tin nhắn đầu tiên hoặc khác ngày với tin trước
                            const showDate = index === 0 || 
                                new Date(messages[index - 1].timestamp).toDateString() !== 
                                new Date(msg.timestamp).toDateString();

                            return (
                                <React.Fragment key={msg.id || index}>
                                    {showDate && (
                                        <div className="date-divider">
                                            <span>{formatDate(msg.timestamp)}</span>
                                        </div>
                                    )}
                                    
                                    <div className={`driver-message ${msg.sender_role === 'taixe' ? 'sent' : 'received'}`}>
                                        <div className="message-bubble">
                                            <div className="message-text">{msg.content}</div>
                                            <div className="message-time">{formatTime(msg.timestamp)}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        
                        {isTyping && (
                            <div className="driver-typing-indicator">
                                <div className="typing-bubble">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                                <span className="typing-text">Admin đang nhập...</span>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="driver-chat-input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="driver-message-input"
                        placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={!isConnected}
                    />
                    <button
                        className="driver-send-btn"
                        onClick={handleSendMessage}
                        disabled={!isConnected || !inputMessage.trim()}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M22 2L11 13" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M22 2L15 22L11 13L2 9L22 2Z" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                {!isConnected && (
                    <div className="connection-warning">
                        ⚠️ Đang kết nối lại... Vui lòng đợi
                    </div>
                )}
            </div>

            {/* Info panel (có thể toggle) */}
            <div className="driver-info-panel">
                <div className="info-item">
                    <span className="info-label">Tài xế:</span>
                    <span className="info-value">{driverInfo?.hoten || 'Loading...'}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">SĐT:</span>
                    <span className="info-value">{driverInfo?.sdt || 'Loading...'}</span>
                </div>
            </div>
        </div>
    );
};

export default DriverChatPage;
