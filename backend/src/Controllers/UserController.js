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
};
module.exports = UserController;