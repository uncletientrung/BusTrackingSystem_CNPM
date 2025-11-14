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
    async create(req, res) {
        try {
            const { tentuyen, mota, tongquangduong, trangthai, dsCTRoute } = req.body; // == newRoute ở API
            const route = {
                tentuyen,
                mota,
                tongquangduong: parseFloat(tongquangduong) || 0, 
                trangthai: parseInt(trangthai, 10) || 0       
            };
            const newRoute = await RouteBUS.insertRouteBUS(route, dsCTRoute);
            res.status(201).json({
                message: 'Tạo tuyến đường thành công!',
                route: newRoute
            });
        } catch (error) {
            console.error('Lỗi tạo tuyến ở RouterController:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = RouteController;