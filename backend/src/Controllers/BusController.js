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
                message: 'Thêm xe buýt thành công',
                bus: newBus
            });
        } catch (error) {
            console.error('Lỗi khi thêm xe buýt owr Controller:', error);
            res.status(400).json({ message: error.message });
        }
    },
    async deleteBus(req, res) {
        try {
            const { maxe } = req.params;
            await BusBUS.deleteBus(Number(maxe));
            res.json({
                message: 'Xóa xe thành công',
                maxe: Number(maxe)
            });
        } catch (error) {
            console.error('Lỗi xóa xe buýt:', error);
            res.status(400).json({ message: error.message });
        }
    },
    async updateBus(req, res) {
        try {
            console.log("Chạy Controller");
            
            const { maxe } = req.params;
            const busData = req.body;
            const updatedBus = await BusBUS.updateBus(Number(maxe), busData);
            res.status(200).json({
                message: 'Cập nhật xe buýt thành công',
                bus: updatedBus
            });
        } catch (error) {
            console.error('Lỗi cập nhật xe buýt:', error);
            res.status(400).json({ message: error.message });
        }
    }

};

module.exports = BusController;