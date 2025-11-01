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
}

module.exports = UserBUS;