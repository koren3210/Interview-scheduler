const _ = require('lodash');

// Formatting the response from the DB from PascalCase to JS convention camelCase.
const formatEntityResponse = (entity) => {
  if (!entity) return null;

  const formatKeys = (obj) => {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Check if the key ends with "ID"
        let formattedKey;
        if (key.endsWith('ID')) {
          // Convert the part before "ID" to camelCase
          formattedKey = _.camelCase(key.slice(0, -2)) + 'ID';
        } else {
          // Convert to camelCase
          formattedKey = _.camelCase(key);
        }
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
