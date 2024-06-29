const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InterviewSchedule = sequelize.define("InterviewSchedule", {
  ScheduleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  InterviewID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Interviews",
      key: "InterviewID",
    },
  },
  ScheduleDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ScheduleTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  Room: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = InterviewSchedule;
