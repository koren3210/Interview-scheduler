const { Sequelize } = require("sequelize");
const logger = require("../middleware/logger");

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: (msg) => {
    logger.http(msg); // Log Sequelize messages with Winston
  },
});

module.exports = sequelize;
