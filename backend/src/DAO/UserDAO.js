const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    mand: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    hoten: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ngaysinh: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    sdt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diachi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gioitinh: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'nguoidung',
    timestamps: false,
});

// DAO cho User
const UserDAO = {
    async getAll() {
        return await User.findAll();
    },

    // async getById(id) {
    //     return await User.findByPk(id);
    // },

    async create(userData, { transaction } = {}) {
        return await User.create(userData, { transaction });
    },

    // async update(id, userData) {
    //     const user = await User.findByPk(id);
    //     if (!user) return null;
    //     return await user.update(userData);
    // },

    // async delete(id) {
    //     const user = await User.findByPk(id);
    //     if (!user) return null;
    //     return await user.destroy();
    // },
};

module.exports = UserDAO;
