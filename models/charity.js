"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Charity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Charity.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
        field: "user_id",
      });
    }
  }
  Charity.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "registration_number",
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Suspended", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      sequelize,
      modelName: "Charity",
      tableName: "charity",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },
  );
  return Charity;
};
