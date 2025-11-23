const AccountDAO = require('../DAO/AccountDAO');
const AccountDTO = require('../DTO/AccountDTO');

const AccountBUS = {
    async getAll() {
        const listAccount = await AccountDAO.getAll();
        return listAccount.map(
            account => new AccountDTO(account.matk,
                account.tendangnhap,
                account.matkhau,
                account.manq,
                account.trangthai,)
        );
    },

    async getById(id) {
        const account = await AccountDAO.getById(id);
        if (!account) return null;
        return new AccountDTO(
            account.matk,
            account.tendangnhap,
            account.matkhau,
            account.manq,
            account.trangthai
        );
    },

    async updatePassword(id, newPassword) {
        const updated = await AccountDAO.update(id, { matkhau: newPassword });
        if (!updated) return null;
        return await this.getById(id);
    }
}

module.exports = AccountBUS;