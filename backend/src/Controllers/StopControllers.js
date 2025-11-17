// Cầu nối giữa frontend và tầng nghiệp vụ (BUS).
const StopBUS = require('../BUS/StopBUS');
const { update } = require('../DAO/StopDAO');

const StopController = {
  async getAll(req, res) { // req là request gửi yêu cầu lên client, res là respone là server trả về
    try {
      const data = await StopBUS.getAll();
      res.json(data); // trả dữ liệu về cho client ở dạng JSON.
    } catch (error) {
      console.error('Lỗi getAll Stop:', error); // ← Thêm log để debug
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id; // req.params.id lấy tham số id từ URL
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }
      const data = await StopBUS.getById(id);
      if (!data) return res.status(404).json({ message: 'Không tìm thấy điểm dừng' });
      res.json(data);
    } catch (error) {
      console.error('Lỗi getById Stop:', error);
      res.status(500).json({ message: error.message });
    }
  },
  async create(req, res) {
    try {
      const stopData = req.body
      const newStop = await StopBUS.createStop(stopData);
      res.status(201).json({
        message: 'Thêm điểm dừng thành công!',
        stop: newStop
      });
    } catch (error) {
      console.error('Lỗi thêm điểm dừng ở COntroller:', error);
      res.status(400).json({ message: error.message });
    }
  },
  async delete(req, res) {
    try {
      const { madd } = req.params;
      await StopBUS.deleteStop(Number(madd));
      res.json({
        message: 'Xóa học sinh thành công',
        madd: Number(madd)
      });
    } catch (error) {
      console.error('Lỗi xóa điểm dừng ở Controller:', error);
      res.status(400).json({ message: error.message });
    }
  },
  async update(req, res) {
    try {
      const { madd } = req.params;
      const { tendiemdung, vido, kinhdo, diachi } = req.body;
      const stopData = { tendiemdung, vido, kinhdo, diachi }
      const updateStopCount = await StopBUS.updateStop(madd, stopData);
      res.json({
        message: 'Cập nhật tuyến đường thành công!',
        stop: updateStopCount
      });
    } catch (error) {
      console.error('Lỗi cập nhật điểm dừng ở Controller:', error);
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = StopController;
