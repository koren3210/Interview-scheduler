const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Candidate = sequelize.define("Candidate", {
  CandidateID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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

module.exports = Candidate;