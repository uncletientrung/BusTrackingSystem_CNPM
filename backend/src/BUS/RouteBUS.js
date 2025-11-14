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
    },
    async deleteRouteBUS(matd) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            await CTRouteDAO.deleteByMaTd(matd, { transaction: giaodich }); // xóa chi tiết trước
            const deletedCount = await RouteDAO.deleteRouteDAO(matd, { transaction: giaodich }); // xóa tuyến
            if (deletedCount === 0) {
                throw new Error('Không tìm thấy tuyến đường để xóa');
            }
            await giaodich.commit();
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    },
    async updateRouteBUS(matd, routeData, dsCTRoute) {
        const giaodich = await require('../config/connectDB').sequelize.transaction();
        try {
            const [updatedCount] = await RouteDAO.updateRouteDAO(matd, routeData, { transaction: giaodich });
            // if (updatedCount === 0) {
            //     throw new Error('Không tìm thấy tuyến đường để cập nhật');
            // }
            await CTRouteDAO.deleteByMaTd(matd, { transaction: giaodich }); // Xóa CT cũ
            if (dsCTRoute && dsCTRoute.length > 0) {
                const cttuyen = dsCTRoute.map(ct => ({
                    matd,
                    madd: ct.madd,
                    thutu: ct.thutu
                }));
                await CTRouteDAO.insertCTRoute(cttuyen, { transaction: giaodich });
            }
            await giaodich.commit();
            return new RouteDTO(matd, routeData.tentuyen, routeData.mota, routeData.tongquangduong, routeData.trangthai);
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    }
}

module.exports = RouteBUS;