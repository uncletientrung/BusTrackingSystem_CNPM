/**
 * AdminChatPage.jsx
 * Giao diện chat cho Admin
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Trang này cho phép Admin:
 *        - Xem danh sách tài xế đã nhắn tin
 *        - Chọn tài xế để xem lịch sử chat
 *        - Gửi/nhận tin nhắn realtime với tài xế
 */

import React, { useState, useEffect, useRef } from 'react';
import socketService from '../../services/socketService';
import { apiClient } from '../../api/api';
import './AdminChatPage.css';

const AdminChatPage = () => {
    // State quản lý
    const [adminId] = useState(1); // ID Admin (lấy từ session/localStorage trong thực tế)
    const [driverList, setDriverList] = useState([]); // Danh sách tài xế
    const [selectedDriver, setSelectedDriver] = useState(null); // Tài xế đang chat
    const [messages, setMessages] = useState([]); // Lịch sử tin nhắn
    const [inputMessage, setInputMessage] = useState(''); // Tin nhắn đang nhập
    const [isConnected, setIsConnected] = useState(false); // Trạng thái kết nối Socket
    const [isTyping, setIsTyping] = useState(false); // Tài xế đang gõ
    const [loading, setLoading] = useState(false); // Loading state
    
    const messagesEndRef = useRef(null); // Ref để scroll xuống cuối
    const typingTimeoutRef = useRef(null); // Ref cho typing timeout

    /**
     * Khởi tạo: Kết nối Socket.IO và load danh sách tài xế
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

            // 1. Kết nối Socket.IO
            await socketService.connect(adminId, 'admin');
            setIsConnected(true);
            console.log('[AdminChat] Đã kết nối Socket.IO');

            // 2. Đăng ký các event listeners
            setupSocketListeners();

            // 3. Load danh sách tài xế
            await loadDriverList();

        } catch (error) {
            console.error('[AdminChat] Lỗi khởi tạo:', error);
            alert('Không thể kết nối chat. Vui lòng kiểm tra server.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Thiết lập các Socket listeners
     */
    const setupSocketListeners = () => {
        // Nhận tin nhắn mới từ tài xế
        socketService.onReceiveMessage((message) => {
            console.log('[AdminChat] Nhận tin nhắn:', message);
            
            // Chỉ thêm tin nhắn nếu đang chat với tài xế này
            if (selectedDriver && message.sender_id === selectedDriver.driver_id) {
                setMessages(prev => [...prev, message]);
            }

            // Cập nhật danh sách tài xế (tin nhắn cuối)
            loadDriverList();
        });

        // Xác nhận tin nhắn đã gửi thành công
        socketService.onMessageSent((message) => {
            console.log('[AdminChat] Tin nhắn đã gửi:', message);
            // Tin nhắn đã được thêm vào state khi gửi, không cần thêm lại
        });

        // Xử lý lỗi
        socketService.onMessageError((error) => {
            console.error('[AdminChat] Lỗi gửi tin nhắn:', error);
            alert('Lỗi khi gửi tin nhắn: ' + error.error);
        });

        // Tài xế đang gõ
        socketService.onUserTyping((data) => {
            if (selectedDriver && data.userId === selectedDriver.driver_id) {
                setIsTyping(true);
            }
        });

        // Tài xế ngừng gõ
        socketService.onUserStopTyping((data) => {
            if (selectedDriver && data.userId === selectedDriver.driver_id) {
                setIsTyping(false);
            }
        });
    };

    /**
     * Load danh sách tài xế đã nhắn tin
     */
    const loadDriverList = async () => {
        try {
            const response = await apiClient.get(`/messages/drivers/${adminId}`);
            
            if (response.data.success) {
                setDriverList(response.data.data);
            }
        } catch (error) {
            console.error('[AdminChat] Lỗi load danh sách tài xế:', error);
        }
    };

    /**
     * Chọn tài xế để chat
     */
    const handleSelectDriver = async (driver) => {
        try {
            setSelectedDriver(driver);
            setMessages([]); // Clear tin nhắn cũ
            setLoading(true);

            // Load lịch sử tin nhắn
            const response = await apiClient.get(`/messages/history/${adminId}/${driver.driver_id}`);
            
            if (response.data.success) {
                setMessages(response.data.data);
            }

            // Đánh dấu tin nhắn đã đọc
            socketService.markAsRead({
                userId: adminId,
                userRole: 'admin',
                partnerId: driver.driver_id,
                partnerRole: 'taixe'
            });

        } catch (error) {
            console.error('[AdminChat] Lỗi load lịch sử:', error);
            alert('Không thể tải lịch sử chat');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Gửi tin nhắn
     */
    const handleSendMessage = () => {
        if (!inputMessage.trim() || !selectedDriver) {
            return;
        }

        const messageData = {
            sender_id: adminId,
            receiver_id: selectedDriver.driver_id,
            sender_role: 'admin',
            receiver_role: 'taixe',
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
            userId: adminId,
            userRole: 'admin',
            receiverId: selectedDriver.driver_id,
            receiverRole: 'taixe'
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
        if (selectedDriver) {
            socketService.sendTyping({
                userId: adminId,
                userRole: 'admin',
                receiverId: selectedDriver.driver_id,
                receiverRole: 'taixe'
            });

            // Reset timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Sau 2 giây không gõ thì gửi stopTyping
            typingTimeoutRef.current = setTimeout(() => {
                socketService.sendStopTyping({
                    userId: adminId,
                    userRole: 'admin',
                    receiverId: selectedDriver.driver_id,
                    receiverRole: 'taixe'
                });
            }, 2000);
        }
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
     * Render UI
     */
    return (
        <div className="admin-chat-container">
            <div className="chat-header">
                <h2>💬 Chat với Tài xế</h2>
                <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? '🟢 Đang kết nối' : '🔴 Mất kết nối'}
                </div>
            </div>

            <div className="chat-content">
                {/* Danh sách tài xế */}
                <div className="driver-list-panel">
                    <div className="panel-header">
                        <h3>Danh sách Tài xế</h3>
                        <button onClick={loadDriverList} className="refresh-btn">
                            🔄
                        </button>
                    </div>

                    <div className="driver-list">
                        {driverList.length === 0 ? (
                            <div className="empty-state">
                                <p>Chưa có cuộc trò chuyện nào</p>
                            </div>
                        ) : (
                            driverList.map((driver) => (
                                <div
                                    key={driver.driver_id}
                                    className={`driver-item ${selectedDriver?.driver_id === driver.driver_id ? 'active' : ''}`}
                                    onClick={() => handleSelectDriver(driver)}
                                >
                                    <div className="driver-avatar">
                                        🚗
                                    </div>
                                    <div className="driver-info">
                                        <div className="driver-name">{driver.driver_name}</div>
                                        <div className="last-message">
                                            {driver.last_sender_role === 'admin' ? 'Bạn: ' : ''}
                                            {driver.last_message?.substring(0, 30)}
                                            {driver.last_message?.length > 30 ? '...' : ''}
                                        </div>
                                    </div>
                                    {driver.unread_count > 0 && (
                                        <div className="unread-badge">{driver.unread_count}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Khu vực chat */}
                <div className="chat-panel">
                    {selectedDriver ? (
                        <>
                            {/* Header chat */}
                            <div className="chat-header-info">
                                <div className="driver-avatar-large">🚗</div>
                                <div>
                                    <h3>{selectedDriver.driver_name}</h3>
                                    <p className="driver-phone">📞 {selectedDriver.driver_phone}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="messages-container">
                                {loading ? (
                                    <div className="loading">Đang tải tin nhắn...</div>
                                ) : (
                                    <>
                                        {messages.map((msg, index) => (
                                            <div
                                                key={msg.id || index}
                                                className={`message ${msg.sender_role === 'admin' ? 'sent' : 'received'}`}
                                            >
                                                <div className="message-content">
                                                    {msg.content}
                                                </div>
                                                <div className="message-time">
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {isTyping && (
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <p>Tài xế đang nhập...</p>
                                            </div>
                                        )}
                                        
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input */}
                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Nhập tin nhắn..."
                                    value={inputMessage}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={!isConnected}
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleSendMessage}
                                    disabled={!isConnected || !inputMessage.trim()}
                                >
                                    📤 Gửi
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h3>👈 Chọn tài xế để bắt đầu chat</h3>
                            <p>Danh sách bên trái hiển thị các tài xế đã nhắn tin với bạn</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChatPage;
