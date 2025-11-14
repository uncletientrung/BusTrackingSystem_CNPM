const CTRouteDAO = require('../DAO/CTRouteDAO');
const RouteDAO = require('../DAO/RouteDAO');
const RouteDTO = require('../DTO/RouteDTO');

const RouteBUS = {
    async getAll() {
        const listRoute = await RouteDAO.getAll();
        const result = listRoute.map(
            route => new RouteDTO(
                route.matd,
                route.tentuyen,
                route.mota,
                route.tongquangduong,
                route.trangthai
            )
        );
        return result;
    },
    async insertRouteBUS(route, dsCTRoute) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            const tuyen = await RouteDAO.insertRouteDAO(route, { transaction: giaodich }); // Lưu vào bản ghi
            const cttuyen = dsCTRoute.map((ctRoute) => ({
                matd: tuyen.matd,
                madd: ctRoute.madd,
                thutu: ctRoute.thutu
            }));
            await CTRouteDAO.insertCTRoute(cttuyen);
            await giaodich.commit();
            return new RouteDTO(
                tuyen.matd,
                tuyen.tentuyen,
                tuyen.mota,
                tuyen.tongquangduong,
                tuyen.trangthai
            )
        } catch (error) {
            await giaodich.rollback(); //Nếu lỗi xóa bản ghi
            throw error;
        }
    }
}

module.exports = RouteBUS;