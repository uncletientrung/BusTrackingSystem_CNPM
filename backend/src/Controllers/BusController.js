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
};

module.exports = BusController;