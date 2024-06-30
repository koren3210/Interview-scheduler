const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Interview = require('./interview.model');

const Interviewer = sequelize.define('Interviewer', {
  InterviewerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  PhoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
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

Interviewer.hasMany(Interview, { foreignKey: 'InterviewerID' });
Interview.belongsTo(Interviewer, { foreignKey: 'InterviewerID' });

module.exports = Interviewer;
