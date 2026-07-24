"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.Charity, {
        foreignKey: "charityId",
        as: "charity",
        field: "charity_id",
      });

      Project.hasMany(models.Donation, {
        foreignKey: "projectId",
        as: "donations",
        field: "project_id",
      });
    }
  }
  Project.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      goalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "goal_amount",
      },
      raisedAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: "raised_amount",
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },
  );
  return Project;
};
