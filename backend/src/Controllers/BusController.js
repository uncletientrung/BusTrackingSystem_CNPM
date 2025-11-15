const BusBUS = require('../BUS/BusBUS');

const BusController = {
    async getAll(req, res) {
        try {
            const listBus = await BusBUS.getAll();
            res.json(listBus);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Bus:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async createBus(req, res) {
        try {
            const busData = req.body
            const newBus = await BusBUS.createBus(busData);
            res.status(201).json({
                message: 'Thêm xe buýt thành công!',
                bus: newBus
            });
        } catch (error) {
            console.error('Lỗi khi thêm xe buýt owr Controller:', error);
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = BusController;