const AccountBUS = require('../BUS/AccontBUS');

const AccountController = {
  async getAll(req, res) {
    try {
      const data = await AccountBUS.getAll();
      res.json(data);
    } catch (error) {
      console.error('Lỗi getAll từ Controller của Account:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }
      const data = await AccountBUS.getById(id);
      if (!data) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      res.json(data);
    } catch (error) {
      console.error('Lỗi getById Account:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AccountController;
