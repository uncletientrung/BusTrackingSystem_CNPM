/**
 * MessageDAO.js
 * Data Access Object cho tin nhắn chat
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Class này xử lý các thao tác CRUD với bảng messages trong MySQL
 */

const { sequelize } = require('../config/connectDB');
const { DataTypes, QueryTypes } = require('sequelize');
const MessageDTO = require('../DTO/MessageDTO');

// Định nghĩa Model Message bằng Sequelize
const Message = sequelize.define(
    'Message',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sender_role: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        receiver_role: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'messages',
        timestamps: false,
    }
);

class MessageDAO {
    /**
     * Lưu tin nhắn mới vào database
     * @param {MessageDTO} messageDTO - Đối tượng tin nhắn cần lưu
     * @returns {Promise<Object>} - Kết quả insert
     */
    static async createMessage(messageDTO) {
        try {
            const data = messageDTO.toDatabase();
            
            const result = await Message.create({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                sender_role: data.sender_role,
                receiver_role: data.receiver_role,
                content: data.content,
                timestamp: data.timestamp,
                is_read: data.is_read
            });

            return {
                success: true,
                messageId: result.id,
                message: 'Lưu tin nhắn thành công'
            };
        } catch (error) {
            console.error('Lỗi khi lưu tin nhắn:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Lấy lịch sử tin nhắn giữa Admin và Tài xế
     * @param {number} adminId - ID của Admin
     * @param {number} driverId - ID của Tài xế
     * @param {number} limit - Số lượng tin nhắn tối đa (mặc định 100)
     * @returns {Promise<Array>} - Danh sách tin nhắn
     */
    static async getMessageHistory(adminId, driverId, limit = 100) {
        try {
            const { Op } = require('sequelize');
            
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        {
                            sender_id: adminId,
                            sender_role: 'admin',
                            receiver_id: driverId,
                            receiver_role: 'taixe'
                        },
                        {
                            sender_id: driverId,
                            sender_role: 'taixe',
                            receiver_id: adminId,
                            receiver_role: 'admin'
                        }
                    ]
                },
                order: [['timestamp', 'ASC']],
                limit: limit
            });

            return messages.map(msg => new MessageDTO(msg.toJSON()));
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử tin nhắn:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách tài xế (hiển thị TẤT CẢ tài xế kể cả chưa nhắn tin)
     * Sử dụng mand từ bảng nguoidung thay vì matx từ bảng taixe
     * @param {number} adminId - ID của Admin
     * @returns {Promise<Array>} - Danh sách tài xế và tin nhắn cuối cùng
     */
    static async getDriverListWithLastMessage(adminId) {
        try {
            const query = `
                SELECT 
                    nd.mand as driver_id,
                    nd.hoten as driver_name,
                    nd.sdt as driver_phone,
                    (
                        SELECT content 
                        FROM messages 
                        WHERE (
                            (sender_id = nd.mand AND sender_role = 'taixe' AND receiver_id = :adminId AND receiver_role = 'admin')
                            OR
                            (receiver_id = nd.mand AND receiver_role = 'taixe' AND sender_id = :adminId AND sender_role = 'admin')
                        )
                        ORDER BY timestamp DESC
                        LIMIT 1
                    ) as last_message,
                    (
                        SELECT timestamp 
                        FROM messages 
                        WHERE (
                            (sender_id = nd.mand AND sender_role = 'taixe' AND receiver_id = :adminId AND receiver_role = 'admin')
                            OR
                            (receiver_id = nd.mand AND receiver_role = 'taixe' AND sender_id = :adminId AND sender_role = 'admin')
                        )
                        ORDER BY timestamp DESC
                        LIMIT 1
                    ) as last_message_time,
                    (
                        SELECT sender_role 
                        FROM messages 
                        WHERE (
                            (sender_id = nd.mand AND sender_role = 'taixe' AND receiver_id = :adminId AND receiver_role = 'admin')
                            OR
                            (receiver_id = nd.mand AND receiver_role = 'taixe' AND sender_id = :adminId AND sender_role = 'admin')
                        )
                        ORDER BY timestamp DESC
                        LIMIT 1
                    ) as last_sender_role,
                    (
                        SELECT COUNT(*) 
                        FROM messages 
                        WHERE receiver_id = :adminId 
                        AND receiver_role = 'admin' 
                        AND sender_id = nd.mand 
                        AND sender_role = 'taixe' 
                        AND is_read = 0
                    ) as unread_count
                FROM nguoidung nd
                INNER JOIN taikhoan tk ON nd.mand = tk.matk
                WHERE tk.manq = 2 AND nd.trangthai = 1
                ORDER BY 
                    CASE WHEN last_message_time IS NULL THEN 1 ELSE 0 END,
                    last_message_time DESC
            `;

            const rows = await sequelize.query(query, {
                replacements: { adminId },
                type: QueryTypes.SELECT
            });
            
            return rows;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài xế:', error);
            throw error;
        }
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     * @param {number} userId - ID người đọc
     * @param {string} userRole - Vai trò người đọc (admin/taixe)
     * @param {number} partnerId - ID người gửi
     * @param {string} partnerRole - Vai trò người gửi
     * @returns {Promise<Object>}
     */
    static async markMessagesAsRead(userId, userRole, partnerId, partnerRole) {
        try {
            const [updatedCount] = await Message.update(
                { is_read: true },
                {
                    where: {
                        receiver_id: userId,
                        receiver_role: userRole,
                        sender_id: partnerId,
                        sender_role: partnerRole,
                        is_read: false
                    }
                }
            );

            return {
                success: true,
                updatedCount: updatedCount
            };
        } catch (error) {
            console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Đếm số tin nhắn chưa đọc
     * @param {number} userId - ID người nhận
     * @param {string} userRole - Vai trò người nhận (admin/taixe)
     * @returns {Promise<number>}
     */
    static async countUnreadMessages(userId, userRole) {
        try {
            const count = await Message.count({
                where: {
                    receiver_id: userId,
                    receiver_role: userRole,
                    is_read: false
                }
            });
            
            return count;
        } catch (error) {
            console.error('Lỗi khi đếm tin nhắn chưa đọc:', error);
            return 0;
        }
    }

    /**
     * Xóa lịch sử tin nhắn (chỉ dùng cho testing)
     * @param {number} adminId - ID Admin
     * @param {number} driverId - ID Tài xế
     * @returns {Promise<Object>}
     */
    static async deleteMessageHistory(adminId, driverId) {
        try {
            const { Op } = require('sequelize');
            
            const deletedCount = await Message.destroy({
                where: {
                    [Op.or]: [
                        {
                            sender_id: adminId,
                            sender_role: 'admin',
                            receiver_id: driverId,
                            receiver_role: 'taixe'
                        },
                        {
                            sender_id: driverId,
                            sender_role: 'taixe',
                            receiver_id: adminId,
                            receiver_role: 'admin'
                        }
                    ]
                }
            });

            return {
                success: true,
                deletedCount: deletedCount
            };
        } catch (error) {
            console.error('Lỗi khi xóa lịch sử tin nhắn:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = MessageDAO;
