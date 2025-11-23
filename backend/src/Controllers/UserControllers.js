const UserBUS = require("../BUS/UserBUS");

const UserController = {
  async getAll(req, res) {
    try {
      const listUser = await UserBUS.getAll();
      res.json(listUser);
    } catch (error) {
      console.error("Lỗi getAll từ Controller của User:", error);
      res.status(500).json({ message: error.message });
    }
  },
  async create(req, res) {
    try {
      const {
        name,
        birthday,
        phone,
        email,
        address,
        status,
        sex,
        username,
        password,
        role,
      } = req.body;

      const user = {
        name,
        birthday,
        phone,
        email,
        address,
        status,
        sex,
      };
      const account = {
        username,
        password,
        role,
        trangthai: status === "active" ? 1 : 0,
      };
      const userNew = await UserBUS.createUser(user, account);
      res.status(201).json({
        message: "Thêm người dùng và tài khoản thành công!",
        user: userNew.user,
        account: userNew.account,
      });
    } catch (error) {
      console.error("Lỗi tạo người dung ở UserController:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { mand } = req.params;
      if (!mand) throw new Error("Thiếu mã người dùng");

      const {
        name,
        birthday,
        phone,
        email,
        address,
        sex, // "male" | "female"
        username,
        password,
        role, // "admin" | "driver" | "parent"
        status, // "active" | "inactive"
      } = req.body;

      // Dữ liệu gửi vào BUS
      const userData = { name, birthday, phone, email, address, sex };
      const accountData = {};

      if (username !== undefined) accountData.username = username;
      if (password !== undefined && password.trim() !== "")
        accountData.password = password;
      if (role !== undefined) accountData.role = role;
      if (status !== undefined) accountData.trangthai = status; // string "active"/"inactive"

      const result = await UserBUS.updateUser(mand, userData, accountData);

      res.status(200).json({
        message: "Cập nhật người dùng thành công!",
        user: result.user,
        account: result.account,
      });
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      res.status(500).json({
        message: error.message || "Cập nhật thất bại",
      });
    }
  },

  async delete(req, res) {
    try {
      const { mand } = req.params;
      await UserBUS.deleteUser(Number(mand));
      res
        .status(200)
        .json({ message: "Xóa người dùng thành công!", mand: Number(mand) });
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      res.status(500).json({ message: error.message || "Xóa thất bại" });
    }
  },
  
  async getByAccountId(req, res) {
    try {
      const { matk } = req.params;
      const user = await UserBUS.getByAccountId(Number(matk));
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      res.json(user);
    } catch (error) {
      console.error('Lỗi lấy user từ matk:', error);
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = UserController;
