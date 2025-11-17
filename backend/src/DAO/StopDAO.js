const { sequelize } = require('../config/connectDB');
const { DataTypes, where } = require('sequelize');

const Stop = sequelize.define('Stop', {
    madd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tendiemdung: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vido: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
    },
    kinhdo: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
    },
    diachi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'diemdung',
    timestamps: false,
});

const StopDAO = {
    async getAll() {
        return await Stop.findAll();
    },

    async getById(id) {
        return await Stop.findByPk(id);
    },

    async create(stopData) {
        return await Stop.create(stopData);
    },
    async delete(madd) {
        return await Stop.destroy({ where: { madd } });
    },
    async update(madd, stopData) {
        return await Stop.update(stopData, { where: { madd } });
    }
};

module.exports = StopDAO;

