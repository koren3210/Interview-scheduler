const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Interview = sequelize.define("Interview", {
  InterviewID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  CandidateID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Candidates",
      key: "CandidateID",
    },
  },
  InterviewerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Interviewers",
      key: "InterviewerID",
    },
  },
  InterviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  InterviewTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  InterviewType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  InterviewResult: {
    type: DataTypes.STRING(50),
    allowNull: true,
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
});

module.exports = Interview;
