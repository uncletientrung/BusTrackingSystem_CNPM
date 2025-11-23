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

  async updateUser(mand, userData, accountData) {
    try {
      const userUpdateFields = {};
      if (userData.name !== undefined) userUpdateFields.hoten = userData.name;
      if (userData.birthday !== undefined)
        userUpdateFields.ngaysinh = userData.birthday || null;
      if (userData.phone !== undefined) userUpdateFields.sdt = userData.phone;
      if (userData.email !== undefined) userUpdateFields.email = userData.email;
      if (userData.address !== undefined)
        userUpdateFields.diachi = userData.address;
      if (userData.status !== undefined) {
        const statusMap = { active: 1, inactive: 0 };
        const statusValue = statusMap[userData.status];
        userUpdateFields.trangthai = statusValue;
      }

      if (userData.sex !== undefined) {
        const sexMap = { male: 1, female: 0 };
        userUpdateFields.gioitinh = sexMap[userData.sex];
        if (userUpdateFields.gioitinh === undefined)
          throw new Error("Giới tính không hợp lệ");
      }

      // Map dữ liệu cho bảng taikhoan
      const accountUpdateFields = {};
      if (accountData.username !== undefined)
        accountUpdateFields.tendangnhap = accountData.username;
      if (
        accountData.password !== undefined &&
        accountData.password.trim() !== ""
      )
        accountUpdateFields.matkhau = accountData.password;
      if (accountData.role !== undefined) {
        const roleMap = { admin: 1, driver: 2, parent: 3 };
        accountUpdateFields.manq = roleMap[accountData.role];
        if (accountUpdateFields.manq === undefined)
          throw new Error("Vai trò không hợp lệ");
      }
      if (accountData.trangthai !== undefined) {
        accountUpdateFields.trangthai =
          accountData.trangthai === "active" || accountData.trangthai === 1
            ? 1
            : 0;
      }

      // Cập nhật user và account
      const updatedUser = await UserDAO.update(mand, userUpdateFields);

      let updatedAccount = null;
      if (Object.keys(accountUpdateFields).length > 0) {
        updatedAccount = await AccountDAO.update(mand, accountUpdateFields);
      }

      return {
        user: updatedUser,
        account: updatedAccount || { message: "Không thay đổi tài khoản" },
      };
    } catch (error) {
      console.error("Lỗi cập nhật user trong UserBUS:", error);
      throw error;
    }
  },

  async deleteUser(mand) {
    try {
      const resultUser = await UserDAO.delete(mand);
      const resultAccount = await AccountDAO.delete(mand);

      if (resultUser == 0 || resultAccount == 0) {
        throw new Error("Xóa thất bại");
      }
    } catch (error) {
      console.error("Lỗi xóa user trong UserBUS:", error);
      throw error;
    }
  },
  
  async getByAccountId(matk) {
    try {
      const user = await UserDAO.getByAccountId(matk);
      if (!user) return null;
      
      return new UserDTO(
        user.mand,
        user.hoten,
        user.ngaysinh,
        user.sdt,
        user.email,
        user.diachi,
        user.trangthai,
        user.gioitinh
      );
    } catch (error) {
      console.error('Lỗi lấy user từ matk trong UserBUS:', error);
      throw error;
    }
  },
};

module.exports = UserBUS;
