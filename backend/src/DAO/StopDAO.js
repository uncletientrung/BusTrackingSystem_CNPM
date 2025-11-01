const { sequelize } = require('../config/connectDB');
const { DataTypes } = require('sequelize');

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

    // // Lọc điều kiện
    // const filtered = await DiemDung.findAll({
    //   where: { diachia: "TP.HCM" }
    // });

    // // Sắp xếp
    // const sorted = await DiemDung.findAll({
    //   order: [['madd', 'DESC']]
    // });
};

module.exports = StopDAO;

