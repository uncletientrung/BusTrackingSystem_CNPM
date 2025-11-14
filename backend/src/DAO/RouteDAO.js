const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const Route = sequelize.define('Route', {
    matd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tentuyen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mota: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tongquangduong: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    trangthai: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'tuyenduong', // Tên bảng trong DB
    timestamps: false,
});

const RouteDAO = {
    async getAll() {
        return await Route.findAll();
    },
    async insertRouteDAO(route, { transaction } = {}) {
        return await Route.create(route, { transaction });
    },
    async deleteRouteDAO(matd, { transaction } = {}) {
        return await Route.destroy({ where: { matd }, transaction });
        // destroy() trả về số bản ghi bị xóa → dùng để kiểm tra có xóa được không.
    },
    async updateRouteDAO(matd, route, { transaction } = {}) {
        return await Route.update(route, {
            where: { matd },
            transaction
        });
    }

};

module.exports = RouteDAO;