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
};
module.exports = UserController;
