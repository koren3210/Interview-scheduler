const createError = require('http-errors');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      // Process validation errors
      const errorMessages = error.details.map((detail) => {
        return {
          field: detail.path.join('.'),
          message: detail.message,
        };
      });

      const detailedErrors = errorMessages.map((err) => `${err.field}: ${err.message}`).join(', ');

      // Create a 400 Bad Request error with the detailed message
      return next(createError(400, `Validation error: ${detailedErrors}`));
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;
