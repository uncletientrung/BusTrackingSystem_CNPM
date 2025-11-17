const UserBUS = require('../BUS/UserBUS');

const UserController = {
    async getAll(req, res) {
        try {
            const listUser = await UserBUS.getAll();
            res.json(listUser);
        } catch (error) {
            console.error('Lỗi getAll từ Controller của User:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const { hoten, ngaysinh, sdt, email, diachi, trangthai, gioitinh } = req.body;
            const { tendangnhap, matkhau, manq } = req.body;
            const user = {
                hoten, ngaysinh, sdt, email, diachi, trangthai, gioitinh
            }
            const account = {
                tendangnhap, matkhau, manq
            }
            const userNew = UserBUS.createUser(user, account);
            res.status(201).json({
                message: 'Thêm người dùng và tài khoản thành công!',
                user: userNew
            });
        } catch (error) {
            console.error('Lỗi tạo người dung ở UserController:', error);
            res.status(500).json({ message: error.message });
        }
    }
};
module.exports = UserController;