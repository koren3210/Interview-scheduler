const _ = require('lodash');

//Formatting the response from the DB from PascalCase to JS convention camelCase.
const formatEntityResponse = (entity) => {
  if (!entity) return null;

  const formatKeys = (obj) => {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Keep keys ending with "ID" as is
        const formattedKey = key.endsWith('ID') ? key : _.camelCase(key);
        result[formattedKey] = obj[key];
      }
    }
    return result;
  };

  // Handle single entity or array of entities
  if (Array.isArray(entity)) {
    return entity.map((item) => formatKeys(item));
  }

  return formatKeys(entity.dataValues || entity);
};

module.exports = formatEntityResponse;
