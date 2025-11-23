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
        allowNull: true,
        defaultValue: null,
    },
    thoigiantao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    thoigiangui: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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
    },
    async insertNotificationDAO(notification, {transaction} = {}){
        // Rely on AUTO_INCREMENT: do not set matb manually
        const payload = { ...notification };
        delete payload.matb; // ensure Sequelize doesn't try to insert a fixed value
        return await Notification.create(payload, {transaction});
    },
    async deleteNotificationDAO(matb, {transaction} = {}){
        return await Notification.destroy({ where: { matb }, transaction });
    },
    async updateNotificationDAO(matb, notification, {transaction} = {}){
        return await Notification.update(notification, {
            where: { matb },
            transaction
        });
    },
    async insertNhieuThongBao(listNotification, {transaction}= {}){
        // Bulk create; let DB assign AUTO_INCREMENT matb for each
        const sanitized = listNotification.map(item => {
            const clone = { ...item };
            delete clone.matb;
            return clone;
        });
        return await Notification.bulkCreate(sanitized, {transaction});
    }
};

module.exports = NotificationDAO;