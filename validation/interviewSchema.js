const Joi = require("joi");
const moment = require("moment");

const now = moment();
const oneYearFromNow = moment().add(1, "year");

const interviewSchema = Joi.object({
  interviewID: Joi.number().integer().positive().required(),
  candidateID: Joi.number().integer().positive().required(),
  interviewerID: Joi.number().integer().positive().required(),
  interviewDate: Joi.date()
    .iso()
    .min(now.format("YYYY-MM-DD"))
    .max(oneYearFromNow.format("YYYY-MM-DD"))
    .required()
    .messages({
      "date.min": "Interview date must be from today onwards.",
      "date.max": "Interview date must be within one year from today.",
    }),
  interviewTime: Joi.string()
    .pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Interview time must be in the format HH:MM.",
    }),
  interviewType: Joi.string().max(50).required().messages({
    "string.max": "Interview type must not exceed 50 characters.",
  }),
  interviewResult: Joi.string().max(50).allow(null, "").messages({
    "string.max": "Interview result must not exceed 50 characters.",
  }), // Optional field
});

module.exports = interviewSchema;
