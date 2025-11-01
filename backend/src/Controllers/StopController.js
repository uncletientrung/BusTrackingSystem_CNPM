// Cầu nối giữa frontend và tầng nghiệp vụ (BUS).
const StopBUS = require('../BUS/StopBUS');

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
};

module.exports = StopController;
