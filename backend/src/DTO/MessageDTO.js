/**
 * MessageDTO.js
 * Data Transfer Object cho tin nhắn chat
 * Đồ án: Hệ thống Bus Tracking - Chức năng Chat Realtime
 * 
 * Mô tả: Class này dùng để đóng gói dữ liệu tin nhắn truyền giữa các tầng
 */

class MessageDTO {
    /**
     * Constructor khởi tạo đối tượng tin nhắn
     * @param {Object} data - Dữ liệu tin nhắn
     */
    constructor(data = {}) {
        this.id = data.id || null;                          // ID tin nhắn (auto increment)
        this.sender_id = data.sender_id || null;            // ID người gửi
        this.receiver_id = data.receiver_id || null;        // ID người nhận
        this.sender_role = data.sender_role || '';          // Vai trò người gửi (admin/taixe)
        this.receiver_role = data.receiver_role || '';      // Vai trò người nhận (admin/taixe)
        this.content = data.content || '';                  // Nội dung tin nhắn
        this.timestamp = data.timestamp || new Date();      // Thời gian gửi
        this.is_read = data.is_read !== undefined ? data.is_read : 0;  // Trạng thái đã đọc
    }

    /**
     * Validate dữ liệu tin nhắn
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validate() {
        const errors = [];

        // Kiểm tra sender_id
        if (!this.sender_id || isNaN(this.sender_id)) {
            errors.push('sender_id không hợp lệ');
        }

        // Kiểm tra receiver_id
        if (!this.receiver_id || isNaN(this.receiver_id)) {
            errors.push('receiver_id không hợp lệ');
        }

        // Kiểm tra sender_role
        if (!['admin', 'taixe'].includes(this.sender_role)) {
            errors.push('sender_role phải là "admin" hoặc "taixe"');
        }

        // Kiểm tra receiver_role
        if (!['admin', 'taixe'].includes(this.receiver_role)) {
            errors.push('receiver_role phải là "admin" hoặc "taixe"');
        }

        // Kiểm tra content
        if (!this.content || this.content.trim().length === 0) {
            errors.push('Nội dung tin nhắn không được để trống');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Chuyển đổi object thành định dạng để lưu vào database
     * @returns {Object}
     */
    toDatabase() {
        return {
            sender_id: this.sender_id,
            receiver_id: this.receiver_id,
            sender_role: this.sender_role,
            receiver_role: this.receiver_role,
            content: this.content.trim(),
            timestamp: this.timestamp,
            is_read: this.is_read
        };
    }

    /**
     * Chuyển đổi object thành định dạng để gửi qua Socket.IO
     * @returns {Object}
     */
    toSocket() {
        return {
            id: this.id,
            sender_id: this.sender_id,
            receiver_id: this.receiver_id,
            sender_role: this.sender_role,
            receiver_role: this.receiver_role,
            content: this.content,
            timestamp: this.timestamp,
            is_read: this.is_read
        };
    }
}

module.exports = MessageDTO;
