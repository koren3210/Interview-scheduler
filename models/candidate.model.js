const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Interview = require('./interview.model');

const Candidate = sequelize.define('Candidate', {
  CandidateID: {
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
  Resume: {
    type: DataTypes.TEXT,
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

Candidate.hasMany(Interview, { foreignKey: 'CandidateID' });
Interview.belongsTo(Candidate, { foreignKey: 'CandidateID' });

module.exports = Candidate;
