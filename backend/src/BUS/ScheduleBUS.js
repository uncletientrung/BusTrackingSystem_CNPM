const ScheduleDAO = require('../DAO/ScheduleDAO');
const ScheduleDTO = require('../DTO/ScheduleDTO');

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
    }
}

module.exports = ScheduleBUS;