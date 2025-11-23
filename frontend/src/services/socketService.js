/**
 * socketService.js
 * Service quản lý kết nối Socket.IO trong frontend
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: File này xử lý kết nối Socket.IO từ client đến server
 *        Hỗ trợ kết nối qua LAN bằng địa chỉ IP cục bộ
 */

import { io } from 'socket.io-client';

/**
 * HƯỚNG DẪN SỬ DỤNG TRONG LAN:
 * 
 * 1. Tìm địa chỉ IP của máy chạy backend:
 *    - Windows: Mở CMD, gõ: ipconfig
 *    - Tìm "IPv4 Address" (ví dụ: 192.168.1.100)
 * 
 * 2. Thay đổi SOCKET_SERVER_URL bên dưới:
 *    - Thay "localhost" bằng IP máy backend
 *    - Ví dụ: http://192.168.1.100:5000
 * 
 * 3. Đảm bảo:
 *    - Backend đang chạy ở port 5000
 *    - Tắt firewall hoặc cho phép port 5000
 *    - Cả 2 máy cùng mạng LAN
 */

// URL của Socket.IO server
// Thay đổi địa chỉ này khi chạy trên LAN
const SOCKET_SERVER_URL = 'http://localhost:5000';

// Có thể sử dụng biến môi trường
// const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map(); // Lưu trữ các event listeners
    }

    /**
     * Kết nối tới Socket.IO server
     * @param {number} userId - ID người dùng (mand hoặc matx)
     * @param {string} role - Vai trò (admin hoặc taixe)
     * @returns {Promise<boolean>} - Trả về true nếu kết nối thành công
     */
    connect(userId, role) {
        return new Promise((resolve, reject) => {
            try {
                // Nếu đã kết nối rồi, ngắt kết nối cũ
                if (this.socket) {
                    this.disconnect();
                }

                console.log(`[SocketService] Đang kết nối tới ${SOCKET_SERVER_URL}...`);
                console.log(`[SocketService] User: ${role}_${userId}`);

                // Tạo kết nối Socket.IO
                this.socket = io(SOCKET_SERVER_URL, {
                    transports: ['websocket', 'polling'], // Thử WebSocket trước, fallback sang polling
                    reconnection: true,                   // Tự động reconnect
                    reconnectionDelay: 1000,              // Đợi 1s trước khi reconnect
                    reconnectionAttempts: 5,              // Thử reconnect 5 lần
                    timeout: 10000                        // Timeout 10s
                });

                // Sự kiện: Kết nối thành công
                this.socket.on('connect', () => {
                    console.log(`[SocketService] Đã kết nối: ${this.socket.id}`);
                    this.isConnected = true;

                    // Đăng ký user với server
                    this.socket.emit('register', { userId, role });
                });

                // Sự kiện: Xác nhận đăng ký thành công
                this.socket.on('registered', (data) => {
                    console.log('[SocketService] Đã đăng ký chat realtime:', data);
                    resolve(true);
                });

                // Sự kiện: Lỗi kết nối
                this.socket.on('connect_error', (error) => {
                    console.error('[SocketService] Lỗi kết nối:', error.message);
                    this.isConnected = false;
                    reject(new Error(`Không thể kết nối tới server: ${error.message}`));
                });

                // Sự kiện: Ngắt kết nối
                this.socket.on('disconnect', (reason) => {
                    console.log('[SocketService] Ngắt kết nối:', reason);
                    this.isConnected = false;
                });

                // Sự kiện: Reconnect thành công
                this.socket.on('reconnect', (attemptNumber) => {
                    console.log(`[SocketService] Kết nối lại thành công sau ${attemptNumber} lần thử`);
                    this.isConnected = true;
                    // Đăng ký lại user
                    this.socket.emit('register', { userId, role });
                });

            } catch (error) {
                console.error('[SocketService] Lỗi trong connect():', error);
                reject(error);
            }
        });
    }

    /**
     * Ngắt kết nối Socket.IO
     */
    disconnect() {
        if (this.socket) {
            console.log('[SocketService] Đang ngắt kết nối...');
            
            // Xóa tất cả listeners
            this.listeners.forEach((callback, eventName) => {
                this.socket.off(eventName, callback);
            });
            this.listeners.clear();

            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Gửi tin nhắn
     * @param {Object} messageData - Dữ liệu tin nhắn
     */
    sendMessage(messageData) {
        if (!this.socket || !this.isConnected) {
            console.error('[SocketService] Chưa kết nối tới server');
            return;
        }

        console.log('[SocketService] Gửi tin nhắn:', messageData);
        this.socket.emit('sendMessage', messageData);
    }

    /**
     * Đăng ký nhận tin nhắn
     * @param {Function} callback - Hàm xử lý khi nhận tin nhắn
     */
    onReceiveMessage(callback) {
        if (!this.socket) {
            console.error('[SocketService] Chưa khởi tạo socket');
            return;
        }

        const eventName = 'receiveMessage';
        
        // Xóa listener cũ nếu có
        if (this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
        }

        // Đăng ký listener mới
        this.socket.on(eventName, callback);
        this.listeners.set(eventName, callback);
    }

    /**
     * Xác nhận tin nhắn đã gửi thành công
     * @param {Function} callback
     */
    onMessageSent(callback) {
        if (!this.socket) return;

        const eventName = 'messageSent';
        if (this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
        }

        this.socket.on(eventName, callback);
        this.listeners.set(eventName, callback);
    }

    /**
     * Xử lý lỗi khi gửi tin nhắn
     * @param {Function} callback
     */
    onMessageError(callback) {
        if (!this.socket) return;

        const eventName = 'messageError';
        if (this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
        }

        this.socket.on(eventName, callback);
        this.listeners.set(eventName, callback);
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     * @param {Object} data - { userId, userRole, partnerId, partnerRole }
     */
    markAsRead(data) {
        if (!this.socket || !this.isConnected) return;
        this.socket.emit('markAsRead', data);
    }

    /**
     * Thông báo đang gõ tin nhắn
     * @param {Object} data - { userId, userRole, receiverId, receiverRole }
     */
    sendTyping(data) {
        if (!this.socket || !this.isConnected) return;
        this.socket.emit('typing', data);
    }

    /**
     * Thông báo ngừng gõ
     * @param {Object} data
     */
    sendStopTyping(data) {
        if (!this.socket || !this.isConnected) return;
        this.socket.emit('stopTyping', data);
    }

    /**
     * Lắng nghe sự kiện người khác đang gõ
     * @param {Function} callback
     */
    onUserTyping(callback) {
        if (!this.socket) return;

        const eventName = 'userTyping';
        if (this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
        }

        this.socket.on(eventName, callback);
        this.listeners.set(eventName, callback);
    }

    /**
     * Lắng nghe sự kiện người khác ngừng gõ
     * @param {Function} callback
     */
    onUserStopTyping(callback) {
        if (!this.socket) return;

        const eventName = 'userStopTyping';
        if (this.listeners.has(eventName)) {
            this.socket.off(eventName, this.listeners.get(eventName));
        }

        this.socket.on(eventName, callback);
        this.listeners.set(eventName, callback);
    }

    /**
     * Kiểm tra trạng thái kết nối
     * @returns {boolean}
     */
    isSocketConnected() {
        return this.isConnected && this.socket && this.socket.connected;
    }
}

// Export một instance duy nhất (Singleton pattern)
const socketService = new SocketService();
export default socketService;
