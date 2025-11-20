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
                thoigiantao = null,
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
                thoigiantao: thoigiantao ? new Date(thoigiantao) : new Date(),
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
    },
    async insertNhieu(req, res) {
        try {
            // DEBUG: in ra xem body nhận được gì
            console.log("Body nhận được:", req.body);

            // Cách an toàn nhất – chấp nhận cả 2 kiểu gửi
            let DSFormThongBao = req.body;

            // Nếu frontend gửi kiểu { DSFormThongBao: [...] }
            if (req.body.DSFormThongBao) {
                DSFormThongBao = req.body.DSFormThongBao;
            }

            // Nếu vẫn không phải mảng → lỗi
            if (!Array.isArray(DSFormThongBao)) {
                return res.status(400).json({
                    message: "Dữ liệu phải là một mảng thông báo!",
                    received: req.body
                });
            }

            if (DSFormThongBao.length === 0) {
                return res.status(400).json({ message: "Danh sách thông báo rỗng!" });
            }

            const dsThongBaoNew = await NotificationBUS.insertNhieuThongBaoBUS(DSFormThongBao);
            res.status(201).json({
                message: 'Tạo nhiều thông báo thành công!',
                count: dsThongBaoNew.length,
                notifications: dsThongBaoNew
            });

        } catch (error) {
            console.error('Lỗi tạo nhiều thông báo:', error);
            res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }
};

module.exports = NotificationController;