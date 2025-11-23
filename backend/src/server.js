const express = require('express'); // framework giúp tạo web server(dùng để định nghĩa route, nhận request, gửi response, v.v.).
const cors = require('cors');
const http = require('http'); // Module HTTP để tạo server
const { Server } = require('socket.io'); // Socket.IO để xử lý realtime
const { connectDB } = require('./config/connectDB');
const StopRoutes = require('./Routes/StopRoutes');
const UserRoutes = require('./Routes/UserRoutes');
const AcountRoutes = require('./Routes/AccountRoutes');
const StudentRoutes = require('./Routes/StudentRoutes');
const BusRoutes = require('./Routes/BusRoutes');
const RouteRoutes = require('./Routes/RouteRoutes');
const ScheduleRoutes = require('./Routes/ScheduleRoutes');
const NotificationRoutes = require('./Routes/NotificationRoutes');
const CTRoutes = require('./Routes/CTRouteRoutes');
const CTScheduleRoutes = require('./Routes/CTScheduleRoutes');
const TrackingRoutes = require('./Routes/TrackingRoutes');
const MessageRoutes = require('./Routes/MessageRoutes'); // Routes cho chat
const MessageBUS = require('./BUS/MessageBUS'); // Business logic cho tin nhắn

const app = express(); // là đối tượng Express chính, đại diện cho server.
const PORT = 5000;

// Tạo HTTP server để tích hợp Socket.IO
const server = http.createServer(app);

// Cấu hình Socket.IO server với CORS cho phép kết nối từ mọi nguồn trong LAN
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép mọi IP trong LAN (có thể cấu hình cụ thể: "http://192.168.1.x:5173")
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'] // Hỗ trợ cả WebSocket và HTTP long-polling
});

app.use(cors());
app.use(express.json());
app.use('/api/Stop', StopRoutes);
app.use('/api/User', UserRoutes);
app.use('/api/Account', AcountRoutes);
app.use('/api/Student', StudentRoutes);
app.use('/api/Bus', BusRoutes);
app.use('/api/Route', RouteRoutes);
app.use('/api/Schedule', ScheduleRoutes);
app.use('/api/Notification', NotificationRoutes);
app.use('/api/CTRoute', CTRoutes);
app.use('/api/CTSchedule', CTScheduleRoutes);
app.use('/api/Tracking', TrackingRoutes);
app.use('/api/messages', MessageRoutes); // Route cho chức năng chat

// ============================================================================
// SOCKET.IO - XỬ LÝ CHAT REALTIME
// ============================================================================

/**
 * Map lưu trữ socketId theo userId và role
 * Cấu trúc: { "admin_1": "socketId123", "taixe_4": "socketId456" }
 */
const userSocketMap = new Map();

/**
 * Sự kiện: Client kết nối tới Socket.IO server
 */
io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client đã kết nối: ${socket.id}`);

    /**
     * Sự kiện: User đăng ký vào hệ thống chat
     * Client gửi: { userId, role } (role: "admin" hoặc "taixe")
     */
    socket.on('register', ({ userId, role }) => {
        if (!userId || !role) {
            console.error('[Socket.IO] Thiếu userId hoặc role khi register');
            return;
        }

        const userKey = `${role}_${userId}`;
        userSocketMap.set(userKey, socket.id);
        
        console.log(`[Socket.IO] User đăng ký: ${userKey} - Socket: ${socket.id}`);
        console.log(`[Socket.IO] Tổng số user online: ${userSocketMap.size}`);

        // Gửi xác nhận đăng ký thành công
        socket.emit('registered', { 
            success: true, 
            message: 'Đã kết nối chat realtime',
            userId,
            role
        });
    });

    /**
     * Sự kiện: Client gửi tin nhắn
     * Data: { senderId, receiverId, senderRole, receiverRole, content }
     */
    socket.on('sendMessage', async (messageData) => {
        try {
            console.log('[Socket.IO] Nhận tin nhắn:', messageData);

            // Validate dữ liệu
            if (!messageData.sender_id || !messageData.receiver_id || !messageData.content) {
                socket.emit('messageError', { 
                    error: 'Thiếu thông tin tin nhắn' 
                });
                return;
            }

            // Lưu tin nhắn vào database thông qua BUS
            const result = await MessageBUS.sendMessage({
                sender_id: messageData.sender_id,
                receiver_id: messageData.receiver_id,
                sender_role: messageData.sender_role,
                receiver_role: messageData.receiver_role,
                content: messageData.content
            });

            if (!result.success) {
                socket.emit('messageError', { 
                    error: result.error || result.errors 
                });
                return;
            }

            // Tin nhắn đã lưu thành công, gửi realtime
            const savedMessage = result.data;

            // Gửi cho CẢ NGƯỜI GỬI (để hiển thị ngay lập tức)
            socket.emit('receiveMessage', savedMessage);
            
            // Gửi xác nhận
            socket.emit('messageSent', savedMessage);

            // Tìm socket của người nhận
            const receiverKey = `${messageData.receiver_role}_${messageData.receiver_id}`;
            const receiverSocketId = userSocketMap.get(receiverKey);

            if (receiverSocketId) {
                // Người nhận đang online, gửi tin nhắn realtime
                io.to(receiverSocketId).emit('receiveMessage', savedMessage);
                console.log(`[Socket.IO] ✅ Đã gửi tin nhắn tới cả 2: người gửi và ${receiverKey}`);
            } else {
                // Người nhận offline, tin nhắn đã được lưu vào DB
                console.log(`[Socket.IO] ⚠️ Người nhận ${receiverKey} đang offline, chỉ gửi cho người gửi`);
            }

        } catch (error) {
            console.error('[Socket.IO] Lỗi khi xử lý sendMessage:', error);
            socket.emit('messageError', { 
                error: 'Lỗi server khi gửi tin nhắn' 
            });
        }
    });

    /**
     * Sự kiện: Đánh dấu tin nhắn đã đọc
     * Data: { userId, userRole, partnerId, partnerRole }
     */
    socket.on('markAsRead', async (data) => {
        try {
            const result = await MessageBUS.markMessagesAsRead(
                data.userId,
                data.userRole,
                data.partnerId,
                data.partnerRole
            );

            if (result.success) {
                socket.emit('markedAsRead', { 
                    success: true,
                    updatedCount: result.updatedCount 
                });

                // Thông báo cho người gửi biết tin nhắn đã được đọc
                const senderKey = `${data.partnerRole}_${data.partnerId}`;
                const senderSocketId = userSocketMap.get(senderKey);
                
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messagesRead', {
                        readBy: data.userId,
                        readByRole: data.userRole
                    });
                }
            }
        } catch (error) {
            console.error('[Socket.IO] Lỗi khi markAsRead:', error);
        }
    });

    /**
     * Sự kiện: Người dùng đang gõ tin nhắn
     * Data: { userId, userRole, receiverId, receiverRole }
     */
    socket.on('typing', (data) => {
        const receiverKey = `${data.receiverRole}_${data.receiverId}`;
        const receiverSocketId = userSocketMap.get(receiverKey);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                userId: data.userId,
                userRole: data.userRole
            });
        }
    });

    /**
     * Sự kiện: Người dùng ngừng gõ
     */
    socket.on('stopTyping', (data) => {
        const receiverKey = `${data.receiverRole}_${data.receiverId}`;
        const receiverSocketId = userSocketMap.get(receiverKey);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userStopTyping', {
                userId: data.userId,
                userRole: data.userRole
            });
        }
    });

    /**
     * Sự kiện: Client ngắt kết nối
     */
    socket.on('disconnect', () => {
        console.log(`[Socket.IO] Client ngắt kết nối: ${socket.id}`);

        // Xóa user khỏi map
        for (const [userKey, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userKey);
                console.log(`[Socket.IO] Đã xóa ${userKey} khỏi hệ thống`);
                break;
            }
        }

        console.log(`[Socket.IO] Tổng số user online: ${userSocketMap.size}`);
    });
});

// ============================================================================
// END SOCKET.IO
// ============================================================================

const startServer = async () => {
    await connectDB();
    
    // Sử dụng server.listen thay vì app.listen để hỗ trợ Socket.IO
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`=================================================`);
        console.log(`🚀 Server đang chạy tại:`);
        console.log(`   - Local:   http://localhost:${PORT}`);
        console.log(`   - Network: http://[YOUR_LOCAL_IP]:${PORT}`);
        console.log(`📡 Socket.IO đã sẵn sàng cho chat realtime`);
        console.log(`=================================================`);
    });
};

startServer();


