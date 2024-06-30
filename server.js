require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: helmet } = require('helmet');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const morganMiddleware = require('./middleware/morgan');
const sequelize = require('./config/db');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

// Helmet middleware for setting secure headers
app.use(helmet());
//Morgan middleware for log http request
app.use(morganMiddleware);

// Routes
app.use('/api/candidates', require('./routes/candiates.route'));
app.use('/api/interviewers', require('./routes/interviewer.route'));
app.use('/api/interviews', require('./routes/interview.route'));
app.use('/api/interviews-schedule', require('./routes/interviewSchedule.route'));

// Error handling middleware
app.use(errorHandler);

//Database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.');
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

// Start the server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Unable to sync database models:', err);
  });
