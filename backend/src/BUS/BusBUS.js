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
        const xebus = await BusDAO.create({ bienso, hangxe, soghe, vantoctrungbinh, trangthai, namsanxuat });
        return new BusDTO(xebus.maxe, xebus.bienso, xebus.hangxe, xebus.soghe, xebus.vantoctrungbinh,
            xebus.trangthai, xebus.namsanxuat
        );
    },
    async deleteBus(maxe) {
        const bus = await BusDAO.getById(maxe);
        if (!bus) {
            throw new Error(`Không tìm thấy xe với mã ${maxe}`);
        }
        const deletedCount = await BusDAO.delete(maxe);
        if (deletedCount === 0) {
            throw new Error('Xóa thất bại');
        }

        return { message: 'Xóa xe buýt thành công!', maxe };
    },
    async updateBus(maxe, busData) {
        console.log("Chạy Bus");
        const { bienso } = busData
        const existingBus = await BusDAO.getById(maxe);
        if (bienso && bienso !== existingBus.bienso) {
            const duplicate = await BusDAO.getByLicensePlate(bienso);
            if (duplicate) {
                throw new Error(`Biển số ${bienso} đã được sử dụng!`);
            }
        }
        const updatedBus = await BusDAO.update(maxe, busData);
        return new BusDTO(
            updatedBus.maxe,
            updatedBus.bienso,
            updatedBus.hangxe,
            updatedBus.soghe,
            updatedBus.vantoctrungbinh,
            updatedBus.trangthai,
            updatedBus.namsanxuat
        );

    }
}

module.exports = BusBUS;