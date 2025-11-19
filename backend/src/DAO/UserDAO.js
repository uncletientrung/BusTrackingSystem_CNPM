const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    mand: {
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
    sdt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diachi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trangthai: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gioitinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "nguoidung",
    timestamps: false,
  }
);

// DAO cho User
const UserDAO = {
  async getAll() {
    return await User.findAll();
  },

  async create(userData) {
    // userData = { hoten, ngaysinh, sdt, email, diachi, trangthai, gioitinh }
    return await User.create(userData);
  },

  async update(mand, userData) {
    await User.update(userData, { where: { mand } });

    const updatedUser = await User.findByPk(mand);

    return updatedUser;
    s;
  },
};

module.exports = UserDAO;
