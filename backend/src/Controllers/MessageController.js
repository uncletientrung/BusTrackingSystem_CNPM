/**
 * MessageController.js
 * Controller xử lý các request liên quan đến tin nhắn
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Controller này xử lý các HTTP request từ client
 */

const MessageBUS = require('../BUS/MessageBUS');

class MessageController {
    /**
     * Lấy lịch sử tin nhắn giữa Admin và Tài xế
     * GET /api/messages/history/:adminId/:driverId
     */
    static async getMessageHistory(req, res) {
        try {
            const { adminId, driverId } = req.params;
            const limit = req.query.limit || 100;

            // Chuyển đổi sang số
            const adminIdNum = parseInt(adminId);
            const driverIdNum = parseInt(driverId);
            const limitNum = parseInt(limit);

            // Lấy lịch sử từ BUS
            const result = await MessageBUS.getMessageHistory(adminIdNum, driverIdNum, limitNum);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Lấy lịch sử tin nhắn thành công',
                    data: result.data,
                    count: result.count
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.getMessageHistory:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi lấy lịch sử tin nhắn'
            });
        }
    }

    /**
     * Lấy danh sách tài xế đã nhắn tin với Admin
     * GET /api/messages/drivers/:adminId
     */
    static async getDriverList(req, res) {
        try {
            const { adminId } = req.params;
            const adminIdNum = parseInt(adminId);

            const result = await MessageBUS.getDriverListWithLastMessage(adminIdNum);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách tài xế thành công',
                    data: result.data,
                    count: result.count
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.getDriverList:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi lấy danh sách tài xế'
            });
        }
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     * PUT /api/messages/mark-read
     */
    static async markAsRead(req, res) {
        try {
            const { userId, userRole, partnerId, partnerRole } = req.body;

            const result = await MessageBUS.markMessagesAsRead(
                parseInt(userId),
                userRole,
                parseInt(partnerId),
                partnerRole
            );

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Đánh dấu đã đọc thành công',
                    updatedCount: result.updatedCount
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.markAsRead:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi đánh dấu đã đọc'
            });
        }
    }

    /**
     * Đếm số tin nhắn chưa đọc
     * GET /api/messages/unread-count/:userId/:userRole
     */
    static async getUnreadCount(req, res) {
        try {
            const { userId, userRole } = req.params;

            const result = await MessageBUS.getUnreadCount(parseInt(userId), userRole);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    unreadCount: result.unreadCount
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.getUnreadCount:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi đếm tin nhắn chưa đọc'
            });
        }
    }

    /**
     * Gửi tin nhắn thông qua HTTP (backup cho Socket.IO)
     * POST /api/messages/send
     */
    static async sendMessage(req, res) {
        try {
            const messageData = req.body;

            const result = await MessageBUS.sendMessage(messageData);

            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: 'Gửi tin nhắn thành công',
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    errors: result.errors || result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.sendMessage:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi gửi tin nhắn'
            });
        }
    }

    /**
     * Xóa lịch sử tin nhắn (chỉ dùng test)
     * DELETE /api/messages/history/:adminId/:driverId
     */
    static async deleteHistory(req, res) {
        try {
            const { adminId, driverId } = req.params;

            const result = await MessageBUS.deleteMessageHistory(
                parseInt(adminId),
                parseInt(driverId)
            );

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Xóa lịch sử thành công',
                    deletedCount: result.deletedCount
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Lỗi trong MessageController.deleteHistory:', error);
            res.status(500).json({
                success: false,
                error: 'Lỗi server khi xóa lịch sử'
            });
        }
    }
}

module.exports = MessageController;
