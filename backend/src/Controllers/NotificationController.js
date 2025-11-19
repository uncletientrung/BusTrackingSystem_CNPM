const NotificationBUS = require('../BUS/NotificationBUS');

const NotificationController = {
    async getAll(req, res) {
        try {
            const listNotification = await NotificationBUS.getAll();
            res.json(listNotification);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Notification:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const {
                matx,
                maph,
                thoigiangui = null,
                tieude,
                noidung,
                loaithongbao,
                mucdouutien,
                trangthai = 1
            } = req.body;

            const notification = {
                matx: parseInt(matx, 10),
                maph: parseInt(maph, 10),
                thoigiangui: thoigiangui ? new Date(thoigiangui) : null,
                tieude,
                noidung,
                loaithongbao,
                mucdouutien,
                trangthai: parseInt(trangthai, 10)
            };

            const newNoti = await NotificationBUS.insertNotificationBUS(notification);
            res.status(201).json({ message: 'Tạo thông báo thành công!', notification: newNoti });
        } catch (error) {
            console.error('Lỗi tạo thông báo:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { matb } = req.params;
            await NotificationBUS.deleteNotificationBUS(Number(matb));
            res.json({ message: 'Xóa thông báo thành công!', matb: Number(matb) });
        } catch (error) {
            console.error('Lỗi xóa thông báo:', error);
            if (error.message === 'Không tìm thấy thông báo để xóa') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { matb } = req.params;
            const {
                matx,
                maph,
                thoigiangui = null,
                tieude,
                noidung,
                loaithongbao,
                mucdouutien,
                trangthai
            } = req.body;

            const data = {
                matx: matx !== undefined ? parseInt(matx, 10) : undefined,
                maph: maph !== undefined ? parseInt(maph, 10) : undefined,
                thoigiangui: thoigiangui ? new Date(thoigiangui) : null,
                tieude,
                noidung,
                loaithongbao,
                mucdouutien,
                trangthai: trangthai !== undefined ? parseInt(trangthai, 10) : undefined,
            };

            // Loại bỏ các trường undefined để tránh overwrite không mong muốn
            Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

            const updated = await NotificationBUS.updateNotificationBUS(Number(matb), data);
            res.json({ message: 'Cập nhật thông báo thành công!', notification: updated });
        } catch (error) {
            console.error('Lỗi cập nhật thông báo:', error);
            if (error.message === 'Không tìm thấy thông báo để cập nhật') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = NotificationController;