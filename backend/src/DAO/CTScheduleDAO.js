const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const CTSchedule = sequelize.define('CTSchedule', {
    malt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    mahs: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'ctlichtrinh',
    timestamps: false
});

const CTScheduleDAO = {
    async createCTSchedule(dsCTSchedule, { transaction } = {}) {
        return await CTSchedule.bulkCreate(dsCTSchedule, { transaction })
    },
    async deleteCTSchedule(malt, { transaction } = {}) {
        return await CTSchedule.destroy({ where: { malt } }, { transaction })
    },
    async getAllById(malt){
        return await CTSchedule.findAll({where : {malt}})
    }
}

module.exports = CTScheduleDAO;