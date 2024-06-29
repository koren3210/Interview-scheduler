const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
