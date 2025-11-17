const AccountDAO = require('../DAO/AccountDAO');
const UserDAO = require('../DAO/UserDAO');
const UserDTO = require('../DTO/UserDTO');

const UserBUS = {
    async getAll() {
        const listUser = await UserDAO.getAll();
        return listUser.map(
            user => new UserDTO(user.mand,
                user.hoten,
                user.ngaysinh,
                user.sdt,
                user.email,
                user.diachi,
                user.trangthai,
                user.gioitinh)
        );
    },
    async createUser(userData, accountData) {
        const record = await require('../config/connectDB').sequelize.transaction();
        try {
            const userNew = await UserDAO.createUser(userData, { transaction: record });
            await AccountDAO.create(accountData, { transaction: record })
            record.commit();
            return new UserDTO(
                userNew.mand,
                userNew.hoten,
                userNew.ngaysinh,
                userNew.sdt,
                userNew.email,
                userNew.diachi,
                userNew.trangthai,
                userNew.gioitinh
            );
        } catch (error) {
            await record.rollback();
            throw error;
        }
    }
}

module.exports = UserBUS;