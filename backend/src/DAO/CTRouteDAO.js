const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

const CTRoute = sequelize.define('CTRoute', {
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
    }
}, {
    tableName: 'cttuyenduong',
    timestamps: false,
    indexes: [
        { fields: ['matd'] },
        { fields: ['thutu'] }
    ]
});

const CTRouteDAO = {
    async getAll() {
        return await CTRoute.findAll({
            order: [['matd', 'ASC'], ['thutu', 'ASC']]
        });
    },

    async getByMatd(matd) {
        return await CTRoute.findAll({
            where: { matd },
            order: [['thutu', 'ASC']]
        });
    }
};

module.exports = CTRouteDAO;