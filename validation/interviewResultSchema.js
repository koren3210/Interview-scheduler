const Joi = require('joi');

const interviewResultSchema = Joi.object({
  interviewResult: Joi.string().max(50).allow(null, '').messages({
    'string.max': 'Interview result must not exceed 50 characters.',
  }),
});

module.exports = interviewResultSchema;
