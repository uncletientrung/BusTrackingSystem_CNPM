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
    }
}

module.exports = RouteBUS;