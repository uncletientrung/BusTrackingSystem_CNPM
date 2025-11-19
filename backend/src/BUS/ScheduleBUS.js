const ScheduleDAO = require('../DAO/ScheduleDAO');
const ScheduleDTO = require('../DTO/ScheduleDTO');
const CTScheduleDAO = require('../DAO/CTScheduleDAO')

const ScheduleBUS = {
    async getAll() {
        const listSchedule = await ScheduleDAO.getAll();
        const result = listSchedule.map(
            schedule => new ScheduleDTO(
                schedule.malt,
                schedule.matx,
                schedule.matd,
                schedule.maxe,
                schedule.thoigianbatdau,
                schedule.thoigianketthuc,
                schedule.tonghocsinh,
                schedule.trangthai
            )
        );
        return result;
    },
    async create(scheduleData, dsCTSchedule) {
        const record = await require('../config/connectDB').sequelize.transaction();
        try {
            const lichtrinh = await ScheduleDAO.createSchedule(scheduleData, { transaction: record });
            const dsCTlichtrinh = dsCTSchedule.map((CTSchedule) => ({
                malt: lichtrinh.malt,
                mahs: CTSchedule.mahs,
                trangthai: 1
            }))
            await CTScheduleDAO.createCTSchedule(dsCTlichtrinh, { transaction: record })
            await record.commit()
            return new ScheduleDTO(lichtrinh.malt,
                lichtrinh.matx,
                lichtrinh.matd,
                lichtrinh.maxe,
                lichtrinh.thoigianbatdau,
                lichtrinh.thoigianketthuc,
                lichtrinh.tonghocsinh,
                lichtrinh.trangthai)
        } catch (error) {
            await giaodich.rollback();
            throw error;
        }
    }
}

module.exports = ScheduleBUS;