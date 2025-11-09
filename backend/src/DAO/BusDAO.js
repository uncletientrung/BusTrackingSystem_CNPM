const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Bus = sequelize.define('Bus', {
    maxe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bienso: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hangxe: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    soghe: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vantoctrungbinh: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    namsanxuat: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'xe', // Tên bảng trong database
    timestamps: false,
});

const BusDAO = {
    async getAll() {
        return await Bus.findAll();
    },

    async getById(maxe) {
        return await Bus.findByPk(maxe);
    },

    async getByLicensePlate(bienso) {
        return await Bus.findOne({
            where: { bienso }
        });
    },

    async create(busData) {
        return await Bus.create(busData);
    },

    async update(maxe, busData) {
        return await Bus.update(busData, {
            where: { maxe }
        });
    },

    async delete(maxe) {
        return await Bus.destroy({
            where: { maxe }
        });
    },

    async getActiveBuses() {
        return await Bus.findAll({
            where: { trangthai: 1 }
        });
    },

    async getBySeatNumber(soghe) {
        return await Bus.findAll({
            where: { soghe }
        });
    },

    async getByBrand(hangxe) {
        return await Bus.findAll({
            where: { hangxe }
        });
    }
};

module.exports = BusDAO;