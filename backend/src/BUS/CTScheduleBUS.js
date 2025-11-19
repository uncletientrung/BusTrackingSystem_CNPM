const CTScheduleDTO = require('../DTO/CTScheduleDTO');
const CTScheduleDAO = require('../DAO/CTScheduleDAO');

const CTScheduleBUS = {
    async getAllById(malt) {
        const listCTSchedule = await CTScheduleDAO.getAllById(malt);
        return listCTSchedule.map(
            ct => new CTScheduleDTO(
                ct.malt,
                ct.mahs,
                ct.trangthai
            )
        )
    }
}

module.exports = CTScheduleBUS;