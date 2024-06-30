const Joi = require('joi');
const moment = require('moment');

const today = moment().startOf('day'); // Start of today
const fiveYearsAgo = moment().subtract(5, 'years').startOf('day'); // 5 years ago from today

const dateRangeSchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .min(fiveYearsAgo.format('YYYY-MM-DD'))
    .max(today.format('YYYY-MM-DD'))
    .required()
    .messages({
      'date.base': 'Start date must be a valid date.',
      'date.iso': 'Start date must be in ISO 8601 format (YYYY-MM-DD).',
      'date.min': `Start date must be within the past 5 years (from ${fiveYearsAgo.format(
        'YYYY-MM-DD'
      )}) and today (${today.format('YYYY-MM-DD')}).`,
      'date.max': `Start date must be no later than today (${today.format('YYYY-MM-DD')}).`,
      'any.required': 'Start date is required.',
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate')) // Ensure endDate is after or equal to startDate
    .max(today.add(1, 'years').format('YYYY-MM-DD'))
    .required()
    .messages({
      'date.base': 'End date must be a valid date.',
      'date.iso': 'End date must be in ISO 8601 format (YYYY-MM-DD).',
      'date.min': 'End date must be after or equal to the start date.',
      'date.max': `End date must be within 5 years from today (${today.add(5, 'years').format('YYYY-MM-DD')}).`,
      'any.required': 'End date is required.',
    }),
});

module.exports = dateRangeSchema;
