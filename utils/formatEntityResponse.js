//Formatting the response from the DB from PascalCase to JS convention - camelCase.
const formatEntityResponse = (entity) => {
  if (!entity || !entity.dataValues) return null;

  const formattedEntity = {};
  for (const key in entity.dataValues) {
    if (Object.prototype.hasOwnProperty.call(entity.dataValues, key)) {
      const formattedKey = key.charAt(0).toLowerCase() + key.slice(1);
      formattedEntity[formattedKey] = entity.dataValues[key];
    }
  }

  return formattedEntity;
};

module.exports = formatEntityResponse;
