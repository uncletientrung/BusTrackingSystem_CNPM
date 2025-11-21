const CTRouteBUS = require('../BUS/CTRouteBUS');

const CTRouteController = {
    async getAll(req, res) {
        try {
            const listCTRoute = await CTRouteBUS.getAll();
            res.json(listCTRoute);
        } catch (error) {
            console.error('Lỗi getAll từ CTRouteController:', error);
            res.status(500).json({ message: error.message });
        }
    },

    async getByMatd(req, res) {
        try {
            const { matd } = req.params; // Lấy tham số từ URL
            const chiTietTuyen = await CTRouteBUS.getByMatd(Number(matd));
            if (!chiTietTuyen || chiTietTuyen.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết tuyến đường' });
            }
            res.json(chiTietTuyen);
        } catch (error) {
            console.error('Lỗi getByMatd từ CTRouteController:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async updateStatus(req, res) {
        try {
            const { matd, madd, thutu, trangthai } = req.body;
            const updateStopStatusCount = await CTRouteBUS.updateStatus(matd, madd, thutu, trangthai);
            res.json({
                message: 'Cập nhật trạng thái chi tiết tuyến đường thành công!',
                updateCount: updateStopStatusCount
            });
        } catch (error) {
            console.error('Lỗi updateStatus từ CTRouteController:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = CTRouteController;