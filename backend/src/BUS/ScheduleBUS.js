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
                trangthai: 0
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
            await record.rollback();
            throw error;
        }
    },
    async delete(malt) {
        const record = await require('../config/connectDB').sequelize.transaction();
        try {
            await CTScheduleDAO.deleteCTSchedule(malt, { transaction: record });
            const result = ScheduleDAO.deleteSchedule(malt, { transaction: record });
            if (result == 0) {
                throw new Error('Không tìm thấy lịch trình để xóa');
            }
            await record.commit();
        } catch (error) {
            await record.rollback();
            throw error;
        }
    },
    async update(malt, scheduleData, dsCTSchedule) {
        const record = await require('../config/connectDB').sequelize.transaction();
        try {
            await CTScheduleDAO.deleteCTSchedule(malt, { transaction: record })
            await ScheduleDAO.updateSchedule(malt, scheduleData, { transaction: record });
            if (dsCTSchedule.length > 0) {
                const dsCTlichtrinh = dsCTSchedule.map(ct => ({
                    malt, mahs: ct.mahs, trangthai: ct.trangthai
                }));
                await CTScheduleDAO.createCTSchedule(dsCTlichtrinh, { transaction: record });
            }
            await record.commit
            return new ScheduleDTO(malt,
                scheduleData.matx,
                scheduleData.matd,
                scheduleData.maxe,
                scheduleData.thoigianbatdau,
                scheduleData.thoigianketthuc,
                scheduleData.tonghocsinh,
                scheduleData.trangthai)
        } catch (error) {
            await record.rollback();
            throw error;
        }
    }
}

module.exports = ScheduleBUS;