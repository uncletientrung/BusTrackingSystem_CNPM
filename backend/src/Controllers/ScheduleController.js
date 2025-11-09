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
};

module.exports = ScheduleController;