const Joi = require('joi');

const interviewerSchema = Joi.object({
  firstName: Joi.string()
    .max(100)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'First name must only contain letters',
    }),
  lastName: Joi.string()
    .max(100)
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Last name must only contain letters',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+?\d{1,3}?)?[0-9\s\-()]+$/)
    .required(),
});

module.exports = interviewerSchema;
