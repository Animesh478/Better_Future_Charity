"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImpactReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImpactReport.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
        field: "project_id",
      });
    }
  }
  ImpactReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allow: false,
      },
      fundsUtilized: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "funds_utilized",
      },
    },
    {
      sequelize,
      modelName: "ImpactReport",
      tableName: "impact_reports",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },
  );
  return ImpactReport;
};
