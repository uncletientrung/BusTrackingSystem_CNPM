const { NUMBER } = require('sequelize');
const RouteBUS = require('../BUS/RouteBUS');
const CTRouteDAO = require('../DAO/CTRouteDAO');
const RouteDAO = require('../DAO/RouteDAO');

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
    },
    async delete(req, res) {
        try {
            const { matd } = req.params; // Lấy đúng matd từ req.params
            await RouteBUS.deleteRouteBUS(Number(matd));
            res.json({
                message: 'Xóa tuyến đường thành công!',
                matd: Number(matd)
            });
        } catch (error) {
            console.error('Lỗi xóa tuyến đường ở Controller: ', error);
            if (error.message === 'Không tìm thấy tuyến đường để xóa') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { matd } = req.params;
            const { tentuyen, mota, tongquangduong, trangthai, dsCTRoute } = req.body;
            const routeData = {
                tentuyen,
                mota,
                tongquangduong: parseFloat(tongquangduong) || 0,
                trangthai: parseInt(trangthai, 10) || 0
            };
            const updatedRoute = await RouteBUS.updateRouteBUS(Number(matd), routeData, dsCTRoute);
            res.json({
                message: 'Cập nhật tuyến đường thành công!',
                route: updatedRoute
            });
        } catch (error) {
            console.error('Lỗi cập nhật tuyến:', error);
            if (error.message === 'Không tìm thấy tuyến đường để cập nhật') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = RouteController;