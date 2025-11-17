const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Account = sequelize.define('Account', {
    matk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tendangnhap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    matkhau: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manq: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'taikhoan',
    timestamps: false,
});

const AccountDAO = {
    async getAll() {
        return await Account.findAll();
    },

    async getById(id) {
        return await Account.findByPk(id);
    },
    async create(accountData, { transaction } = {}) {
        return await Account.create(accountData, transaction);
    }

};

module.exports = AccountDAO;

