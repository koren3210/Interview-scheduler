const handleSequelizeUniqueConstraintError = (err) => {
  if (err.name !== "SequelizeUniqueConstraintError") return null;

  const errors = {};

  for (const field in err.fields) {
    if (err.fields.hasOwnProperty(field)) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists.`;
    }
  }

  return errors;
};

module.exports = {
  handleSequelizeUniqueConstraintError,
};
