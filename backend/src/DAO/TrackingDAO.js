const { sequelize } = require('../config/connectDB');
const { DataTypes, where } = require('sequelize');

const Tracking = sequelize.define('Tracking', {
    malt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    matd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    madd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    thutu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hocsinhconlai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    thoigianden: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'tracking', // Tên bảng trong database
    timestamps: false,
});

const TrackingDAO = {
    async create(dsTracking, { transaction } = {}) {
        return await Tracking.bulkCreate(dsTracking, { transaction })
    },
    async delete(malt, { transaction } = {}) {
        return await Tracking.destroy({ where: { malt } }, { transaction })
    },
    async getTrackingByIdLT(malt) {
        return await Tracking.findAll({ where: { malt }, order: [['thutu', 'ASC']] })
    },
    async updateStatus(malt, matd, madd, trangthai, soHSCanCapNhat) {
        return await Tracking.update({ trangthai: trangthai, hocsinhconlai: soHSCanCapNhat },
            { where: { malt, matd, madd } })
    }
};

module.exports = TrackingDAO;