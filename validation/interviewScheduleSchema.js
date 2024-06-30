const Joi = require('joi');
const moment = require('moment');

const now = moment();
const oneYearFromNow = moment().add(1, 'year');

const interviewScheduleSchema = Joi.object({
  interviewID: Joi.number().integer().positive().required(),
  scheduleDate: Joi.date()
    .iso()
    .min(now.format('YYYY-MM-DD'))
    .max(oneYearFromNow.format('YYYY-MM-DD'))
    .required()
    .messages({
      'date.min': 'Schedule date must be from today onwards.',
      'date.max': 'Schedule date must be within one year from today.',
    }),
  scheduleTime: Joi.string()
    .pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9](?::[0-5][0-9])?$/)
    .required()
    .messages({
      'string.pattern.base': 'Schedule time must be in the format HH:MM.',
    }),
  room: Joi.string().max(50).required().messages({
    'string.max': 'Room name must not exceed 50 characters.',
  }),
});

module.exports = interviewScheduleSchema;
