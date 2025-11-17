const StopDAO = require('../DAO/StopDAO');
const StopDTO = require('../DTO/StopDTO');

const StopBUS = {
  async getAll() {
    const listStop = await StopDAO.getAll();
    return listStop.map(
      d => new StopDTO(d.madd, d.tendiemdung, d.vido, d.kinhdo, d.diachi)
    );
  },

  async getById(id) {
    const d = await StopDAO.getById(id);
    if (!d) return null;
    return new StopDTO(d.madd, d.tendiemdung, d.vido, d.kinhdo, d.diachi);
  },
  async createStop(stopData) {
    if (!stopData) {
      throw new Error(`Dữ liệu truyền vào là rỗng ở BUS ${stopData}`)
    } else {
      const { tendiemdung, vido, kinhdo, diachi } = stopData;
      const newStop = await StopDAO.create({ tendiemdung, vido, kinhdo, diachi });
      return new StopDTO(newStop.madd, newStop.tendiemdung, newStop.vido, newStop.kinhdo, newStop.diachi);
    }
  },
  async deleteStop(madd){
    const result= await StopDAO.delete(madd);
    if(result ==0){
      throw new Error('Xóa Stop thất bại ở BUS');
    }
    return { message: 'Xóa học sinhh thành công!', madd };
  },
  async updateStop(madd, stopData){
    const stopSauUpdateCount= await StopDAO.update(madd, stopData);
    return stopSauUpdateCount;
  }
};

module.exports = StopBUS;
