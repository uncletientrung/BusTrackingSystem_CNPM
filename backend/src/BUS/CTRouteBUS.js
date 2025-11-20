const CTRouteDAO = require('../DAO/CTRouteDAO');
const CTRouteDTO = require('../DTO/CTRouteDTO');

const CTRouteBUS = {
    async getAll() {
        const listCTRoute = await CTRouteDAO.getAll();
        return listCTRoute.map(
            ct => new CTRouteDTO(
                ct.matd,
                ct.madd,
                ct.thutu,
                ct.trangthai
            )
        );
    },

    async getByMatd(matd) {
        const listCTRoute = await CTRouteDAO.getByMatd(matd);
        return listCTRoute.map(
            ct => new CTRouteDTO(
                ct.matd,
                ct.madd,
                ct.thutu,
                ct.trangthai
            )
        );
    }
};

module.exports = CTRouteBUS;