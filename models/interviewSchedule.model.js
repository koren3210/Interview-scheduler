const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Interview = require('./interview.model');

const InterviewSchedule = sequelize.define(
  'InterviewSchedule',
  {
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
        model: 'Interviews',
        key: 'InterviewID',
      },
    },
    ScheduleDate: {
      type: DataTypes.DATE,
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
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Interview_Schedule',
    timestamps: true,
  }
);

InterviewSchedule.belongsTo(Interview, { foreignKey: 'InterviewID' });
Interview.hasMany(InterviewSchedule, { foreignKey: 'InterviewID' });

module.exports = InterviewSchedule;
