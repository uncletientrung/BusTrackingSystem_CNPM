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
            const lichtrinh = {
                matd: Number(matd), matx: Number(matx), maxe: Number(maxe),
                thoigianbatdau, thoigianketthuc, tonghocsinh: Number(tonghocsinh),
                trangthai: Number(trangthai)
            }
            const newSchedule = await ScheduleBUS.create(lichtrinh, students);
            res.status(201).json({
                message: 'Tạo lịch trình thành công!',
                schedule: newSchedule
            });
        } catch (error) {
            console.error('Lỗi tạo lịch trình ở Controller:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { malt } = req.params;
            await ScheduleBUS.delete(Number(malt));
            res.status(201).json({
                message: 'Xóa lịch trình thành công!',
            });
        } catch (error) {
            console.error('Lỗi xóa lịch trình ở Controller:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { malt } = req.params;
            const { matd, matx, maxe, thoigianbatdau, thoigianketthuc,
                tonghocsinh, trangthai, students } = req.body;
            const lichtrinh = {
                matd: Number(matd), matx: Number(matx), maxe: Number(maxe),
                thoigianbatdau, thoigianketthuc, tonghocsinh: Number(tonghocsinh),
                trangthai: Number(trangthai)
            }
            const updateSchedule = await ScheduleBUS.update(malt, lichtrinh, students);
            res.status(201).json({
                message: 'Sửa lịch trình thành công!',
                schedule: updateSchedule
            });
        } catch (error) {
            console.error('Lỗi sửa lịch trình ở Controller:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ScheduleController;