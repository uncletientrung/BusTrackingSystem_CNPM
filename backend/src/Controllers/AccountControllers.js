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

  async update(req, res) {
    try {
      const id = req.params.id;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }
      const { matkhau } = req.body;
      if (!matkhau) {
        return res.status(400).json({ message: 'Mật khẩu mới không được để trống' });
      }
      const updated = await AccountBUS.updatePassword(id, matkhau);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      res.json({ message: 'Cập nhật mật khẩu thành công', account: updated });
    } catch (error) {
      console.error('Lỗi update Account:', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AccountController;
