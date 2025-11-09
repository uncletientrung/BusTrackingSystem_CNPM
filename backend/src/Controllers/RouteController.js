const RouteBUS = require('../BUS/RouteBUS');

const RouteController = {
    async getAll(req, res) {
        try {
            const listRoute = await RouteBUS.getAll();
            res.json(listRoute);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của Route:', error);
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = RouteController;