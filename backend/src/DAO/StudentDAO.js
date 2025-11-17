const { sequelize } = require('../config/connectDB');
const { DataTypes, AsyncQueueError } = require('sequelize');
const { getAll } = require('./UserDAO');

const Student = sequelize.define('Student', {
    mahs: {
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
    gioitinh: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diachi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sdt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maph: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diemdon: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diemdung: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'hocsinh',
    timestamps: false,
});

const StudentDAO = {
    async getAll() {
        return await Student.findAll();
    },
    async create(studentData) {
        return await Student.create(studentData);
    },
    async delete(mahs) {
        return await Student.destroy({ where: { mahs } })
    },
    async update(mahs, studentData) {
        return await Student.update(studentData, { where: { mahs } })
    },
};

module.exports = StudentDAO;