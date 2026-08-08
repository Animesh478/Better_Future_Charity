"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Donation.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
        field: "project_id",
      });

      Donation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "donor",
        field: "user_id",
      });
    }
  }
  Donation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      donationAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "donation_amount",
      },
      status: {
        type: DataTypes.ENUM("Pending", "Success", "Failed"),
        defaultValue: "Pending",
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        field: "transaction_id",
      },
    },
    {
      sequelize,
      modelName: "Donation",
      tableName: "donations",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },
  );
  return Donation;
};
