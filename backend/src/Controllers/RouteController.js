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
            console.log(dsCTRoute);

            const route = { tentuyen, mota, tongquangduong, trangthai: trangthai ?? 1 };
            const newRoute = await RouteBUS.insertRouteBUS(route, dsCTRoute);
            res.status(201).json({
                message: 'Tạo tuyến đường thành công!',
                route: newRoute
            });
        } catch (error) {
            console.error('Lỗi tạo tuyến:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = RouteController;