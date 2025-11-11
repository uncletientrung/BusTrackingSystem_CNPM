const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Notification = sequelize.define('Notification', {
    matb: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    matx: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maph: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    thoigiantao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    tieude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noidung: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    loaithongbao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mucdouutien: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'thongbao', // vẫn giữ tên bảng tiếng Việt để đồng bộ DB
    timestamps: false,
});

const NotificationDAO = {
    async getAll() {
        return await Notification.findAll();
    }
};

module.exports = NotificationDAO;