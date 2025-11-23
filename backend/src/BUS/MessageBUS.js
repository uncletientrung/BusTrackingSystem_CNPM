/**
 * MessageBUS.js
 * Business Logic Layer cho tin nhắn chat
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Class này xử lý logic nghiệp vụ liên quan đến tin nhắn
 */

const MessageDAO = require('../DAO/MessageDAO');
const MessageDTO = require('../DTO/MessageDTO');

class MessageBUS {
    /**
     * Gửi tin nhắn mới
     * @param {Object} messageData - Dữ liệu tin nhắn
     * @returns {Promise<Object>}
     */
    static async sendMessage(messageData) {
        try {
            // Tạo DTO và validate
            const messageDTO = new MessageDTO(messageData);
            const validation = messageDTO.validate();

            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            // Lưu vào database
            const result = await MessageDAO.createMessage(messageDTO);
            
            if (result.success) {
                // Trả về thông tin tin nhắn đã lưu
                messageDTO.id = result.messageId;
                return {
                    success: true,
                    message: 'Gửi tin nhắn thành công',
                    data: messageDTO.toSocket()
                };
            } else {
                return {
                    success: false,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Lỗi trong MessageBUS.sendMessage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Lấy lịch sử tin nhắn giữa Admin và Tài xế
     * @param {number} adminId - ID Admin
     * @param {number} driverId - ID Tài xế
     * @param {number} limit - Giới hạn số tin nhắn
     * @returns {Promise<Object>}
     */
    static async getMessageHistory(adminId, driverId, limit = 100) {
        try {
            // Validate input
            if (!adminId || !driverId || isNaN(adminId) || isNaN(driverId)) {
                return {
                    success: false,
                    error: 'ID không hợp lệ'
                };
            }

            const messages = await MessageDAO.getMessageHistory(adminId, driverId, limit);
            
            return {
                success: true,
                data: messages.map(msg => msg.toSocket()),
                count: messages.length
            };
        } catch (error) {
            console.error('Lỗi trong MessageBUS.getMessageHistory:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Lấy danh sách tài xế đã nhắn tin với Admin
     * @param {number} adminId - ID Admin
     * @returns {Promise<Object>}
     */
    static async getDriverListWithLastMessage(adminId) {
        try {
            if (!adminId || isNaN(adminId)) {
                return {
                    success: false,
                    error: 'Admin ID không hợp lệ'
                };
            }

            const drivers = await MessageDAO.getDriverListWithLastMessage(adminId);
            
            return {
                success: true,
                data: drivers,
                count: drivers.length
            };
        } catch (error) {
            console.error('Lỗi trong MessageBUS.getDriverListWithLastMessage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     * @param {number} userId - ID người đọc
     * @param {string} userRole - Vai trò (admin/taixe)
     * @param {number} partnerId - ID người gửi
     * @param {string} partnerRole - Vai trò người gửi
     * @returns {Promise<Object>}
     */
    static async markMessagesAsRead(userId, userRole, partnerId, partnerRole) {
        try {
            // Validate
            if (!userId || !userRole || !partnerId || !partnerRole) {
                return {
                    success: false,
                    error: 'Thiếu thông tin cần thiết'
                };
            }

            if (!['admin', 'taixe'].includes(userRole) || !['admin', 'taixe'].includes(partnerRole)) {
                return {
                    success: false,
                    error: 'Vai trò không hợp lệ'
                };
            }

            const result = await MessageDAO.markMessagesAsRead(userId, userRole, partnerId, partnerRole);
            return result;
        } catch (error) {
            console.error('Lỗi trong MessageBUS.markMessagesAsRead:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Đếm tin nhắn chưa đọc
     * @param {number} userId - ID người dùng
     * @param {string} userRole - Vai trò
     * @returns {Promise<Object>}
     */
    static async getUnreadCount(userId, userRole) {
        try {
            if (!userId || !userRole || !['admin', 'taixe'].includes(userRole)) {
                return {
                    success: false,
                    error: 'Thông tin không hợp lệ'
                };
            }

            const count = await MessageDAO.countUnreadMessages(userId, userRole);
            
            return {
                success: true,
                unreadCount: count
            };
        } catch (error) {
            console.error('Lỗi trong MessageBUS.getUnreadCount:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Xóa lịch sử tin nhắn (chỉ dùng test)
     * @param {number} adminId - ID Admin
     * @param {number} driverId - ID Tài xế
     * @returns {Promise<Object>}
     */
    static async deleteMessageHistory(adminId, driverId) {
        try {
            const result = await MessageDAO.deleteMessageHistory(adminId, driverId);
            return result;
        } catch (error) {
            console.error('Lỗi trong MessageBUS.deleteMessageHistory:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = MessageBUS;
