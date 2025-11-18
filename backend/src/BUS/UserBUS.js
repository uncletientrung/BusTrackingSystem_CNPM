const AccountDAO = require("../DAO/AccountDAO");
const UserDAO = require("../DAO/UserDAO");
const UserDTO = require("../DTO/UserDTO");

const UserBUS = {
  async getAll() {
    const listUser = await UserDAO.getAll();
    return listUser.map(
      (user) =>
        new UserDTO(
          user.mand,
          user.hoten,
          user.ngaysinh,
          user.sdt,
          user.email,
          user.diachi,
          user.trangthai,
          user.gioitinh
        )
    );
  },

  async createUser(userData, accountData) {
    try {
      const { name, birthday, phone, email, address, status, sex } = userData;
      const { username, password, role, trangthai } = accountData;

      const roleMap = { admin: 1, driver: 2, parent: 3 };
      const manq = roleMap[role];
      // Mapping sex
      const sexMap = { male: 1, female: 0 };
      const sexValue = sexMap[sex];
      if (sexValue === undefined) throw new Error("Giới tính không hợp lệ!");

      // Mapping status
      const statusMap = { active: 1, inactive: 0 };
      const statusValue = statusMap[status];

      if (statusValue === undefined)
        throw new Error("Trạng thái không hợp lệ!");

      //tao user
      const user = await UserDAO.create({
        hoten: name,
        ngaysinh: birthday,
        sdt: phone,
        email: email,
        diachi: address,
        trangthai: statusValue,
        gioitinh: sexValue,
      });
      //tao account gan voi user vua tao
      const account = await AccountDAO.create({
        tendangnhap: username,
        matkhau: password,
        manq: manq,
        trangthai: trangthai,
      });
      return { user, account };
    } catch (error) {
      console.error("Lỗi tạo user trong UserBUS:", error);
      throw error; // cho controller xử lý
    }
  },
};

module.exports = UserBUS;
