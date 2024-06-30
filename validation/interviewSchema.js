const Joi = require('joi');
const moment = require('moment');

const now = moment();
const oneYearFromNow = moment().add(1, 'year');

// Custom validation for interview time
const timeFormat = Joi.string().pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9](?::[0-5][0-9])?$/);

const interviewSchema = Joi.object({
  candidateID: Joi.number().integer().positive().required(),
  interviewerID: Joi.number().integer().positive().required(),
  interviewDate: Joi.date()
    .iso()
    .min(now.format('YYYY-MM-DD'))
    .max(oneYearFromNow.format('YYYY-MM-DD'))
    .required()
    .messages({
      'date.min': 'Interview date must be from today onwards.',
      'date.max': 'Interview date must be within one year from today.',
    }),
  interviewTime: timeFormat
    .required()
    .custom((value, helpers) => {
      // Ensure time is in HH:MM:SS format, default seconds to 00 if not provided
      const timeParts = value.split(':');
      if (timeParts.length === 2) {
        timeParts.push('00'); // Add seconds if not provided
      }
      const formattedTime = timeParts.join(':');

      // Validate the formatted time
      if (!moment(formattedTime, 'HH:mm:ss', true).isValid()) {
        return helpers.error('string.pattern.base');
      }

      return formattedTime;
    })
    .messages({
      'string.pattern.base': 'Interview time must be in the format HH:MM or HH:MM:SS.',
    }),
  interviewType: Joi.string().valid('HR', 'Technical', 'Managerial').max(50).required().messages({
    'string.valid': 'Interview type must be one of the following: HR, Technical, Managerial.',
    'string.max': 'Interview type must not exceed 50 characters.',
    'any.required': 'Interview type is required.',
  }),
  interviewResult: Joi.string().max(50).allow(null, '').messages({
    'string.max': 'Interview result must not exceed 50 characters.',
  }), // Optional field
});

module.exports = interviewSchema;
