const handleSequelizeUniqueConstraintError = (err) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    // Extract the unique constraint error message
    const errorMessage = err.errors[0].message || 'Unique constraint error';
    return {
      status: 400, // Bad Request
      message: errorMessage,
    };
  }
  return null;
};

module.exports = handleSequelizeUniqueConstraintError;
