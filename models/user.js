"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password_hash",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "phone_number",
      },
      role: {
        type: DataTypes.ENUM("Donor", "Charity", "Admin"),
        allowNull: false,
        defaultValue: "Donor",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return User;
};
