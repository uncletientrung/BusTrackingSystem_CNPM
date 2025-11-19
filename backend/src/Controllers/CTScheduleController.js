const CTScheduleBUS = require('../BUS/CTScheduleBUS');

const CTScheduleController = {
    async getAllById(req, res) {
        try {
            const { malt } = req.params;
            const listCTLT = await CTScheduleBUS.getAllById(Number(malt));
            if (listCTLT.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết lịch trình' });
            }
            res.json(listCTLT);
        } catch (error) {
            console.error('Lỗi getByMatd CTLT từ Controller:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CTScheduleController;