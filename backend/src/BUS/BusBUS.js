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
    },
    async createBus(newBus) {
        const { bienso, hangxe, soghe, trangthai, namsanxuat } = newBus;
        const vantoctrungbinh = 50; // vận tốc mặc định
        // Kiểm tra biển số trùng
        const existingBus = await BusDAO.getByLicensePlate(bienso);
        if (existingBus) {
            throw new Error(`Biển số ${bienso} đã tồn tại!`);
        }
        const xebus = await BusDAO.create({bienso,hangxe,soghe,vantoctrungbinh,trangthai,namsanxuat});
        return new BusDTO(xebus.maxe, xebus.bienso, xebus.hangxe, xebus.soghe, xebus.vantoctrungbinh,
            xebus.trangthai, xebus.namsanxuat
        );
    }
}

module.exports = BusBUS;