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
}

module.exports = AccountBUS;