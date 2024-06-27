require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const sequelize = require("./config/db");
const corsOptions = require("./config/corsOptions");

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Morgan middleware setup to use Winston for logging HTTP requests
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

app.use(morganMiddleware);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

// Routes
app.use("/api/candidates", require("./routes/candiates"));
// app.use("/api/interviews", interviewsRouter);
// app.use("/api/interviewers", interviewersRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Unable to sync database models:", err);
  });
