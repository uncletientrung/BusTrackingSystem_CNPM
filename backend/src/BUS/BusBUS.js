const BusDAO = require('../DAO/BusDAO');
const BusDTO = require('../DTO/BusDTO');

const BusBUS = {
    async getAll() {
        const listBus = await BusDAO.getAll();
        const result = listBus.map(
            bus => new BusDTO(
                bus.maxe,
                bus.bienso,
                bus.hangxe,
                bus.soghe,
                bus.vantoctrungbinh,
                bus.trangthai,
                bus.namsanxuat
            )
        );
        return result;
    }
}

module.exports = BusBUS;