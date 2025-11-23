const TrackingBUS = require('../BUS/TrackingBUS');

const TrackingController = {
    async getTrackingByIdLT(req, res) {
        try {
            const { malt } = req.params;
            const listTracking = await TrackingBUS.getTrackingByIdLT(malt);
            if (!listTracking || listTracking.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tracking' });
            }
            res.json(listTracking);
        } catch (error) {
            console.error('Lỗi getTrackingByIdLT từ Controller:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async updateStatus(req, res) {
        try {
            const { malt } = req.params;
            const { matd, madd, trangthai, soHSCanCapNhat } = req.body;
            const updateCount = await TrackingBUS.updateStatus(malt, matd, madd, trangthai, soHSCanCapNhat)
            res.json({
                message: 'Cập nhật trạng thái chi tiết tuyến đường thành công!',
                updateCount: updateCount
            });
        } catch (error) {
            console.error('Lỗi updateStatus từ Controller:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TrackingController