const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Schedule = sequelize.define('Schedule', {
    malt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    matx: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    matd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxe: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    thoigianbatdau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    thoigianketthuc: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tonghocsinh: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'lichtrinh', // Tên bảng trong database
    timestamps: false,
});

const ScheduleDAO = {
    async getAll() {
        return await Schedule.findAll();
    }
};

module.exports = ScheduleDAO;