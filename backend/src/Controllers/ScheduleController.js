const ScheduleBUS = require('../BUS/ScheduleBUS');

const ScheduleController = {
    async getAll(req, res) {
        try {
            const listSchedule = await ScheduleBUS.getAll();
            res.json(listSchedule);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Schedule:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const { matd, matx, maxe, thoigianbatdau, thoigianketthuc,
                tonghocsinh, trangthai, students } = req.body;
            const lichtrinh = { matd, matx, maxe, thoigianbatdau, thoigianketthuc, tonghocsinh, trangthai }
            const newSchedule = await ScheduleBUS.create(lichtrinh, students);
            res.status(201).json({
                message: 'Tạo lịch trình thành công!',
                schedule: newSchedule
            });
        } catch (error) {
            console.error('Lỗi tạo lịch trình ở Controller:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ScheduleController;