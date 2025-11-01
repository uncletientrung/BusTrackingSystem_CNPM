const StopDAO = require('../DAO/StopDAO');
const StopDTO = require('../DTO/StopDTO');

const StopBUS = {
  async getAll() {
    const listStop = await StopDAO.getAll();
    // Chuyển dữ liệu raw thành DTO để truyền cho controller
    return listStop.map(
      d => new StopDTO(d.madd, d.tendiemdung, d.vido, d.kinhdo, d.diachi)
    );
  },

  async getById(id) {
    const d = await StopDAO.getById(id);
    if (!d) return null;
    return new StopDTO(d.madd, d.tendiemdung, d.vido, d.kinhdo, d.diachi);
  }
};

module.exports = StopBUS;
