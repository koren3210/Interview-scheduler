const Interview = require('../models/interview.model');
const InterviewSchedule = require('../models/interviewSchedule.model');
const createError = require('http-errors');
const { Op } = require('sequelize');

// Service to handle interview-related operations

// Create a new interview
const createInterview = async (data) => {
  const { candidateID, interviewerID, interviewDate, interviewTime, interviewType, interviewResult } = data;

  const newInterview = await Interview.create({
    CandidateID: candidateID,
    InterviewerID: interviewerID,
    InterviewDate: interviewDate,
    InterviewTime: interviewTime,
    InterviewType: interviewType,
    InterviewResult: interviewResult,
  });

  return newInterview;
};

// Get all interviews
const getAllInterviews = async () => {
  // Retrieve all interviews from the database
  const interviews = await Interview.findAll();

  return interviews;
};

// Get interview by ID
const findInterviewById = async (id) => {
  const interview = await Interview.findByPk(id);

  if (!interview) {
    throw createError(404, 'No interview matches ID');
  }

  return interview;
};

// Update interview result
const updateInterviewResult = async (id, interviewResult) => {
  let interview = await findInterviewById(id);

  interview.InterviewResult = interviewResult || interview.InterviewResult;

  await interview.save();

  return interview;
};

// Delete interview
const deleteInterview = async (id) => {
  const interview = await findInterviewById(id);

  // Delete interview from the database
  await interview.destroy();
};

// Get interview schedules by date range
const getInterviewSchedulesByDateRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Retrieve all interview schedules within the given date range from the database
  const schedules = await InterviewSchedule.findAll({
    include: [
      {
        model: Interview,
        required: true,
      },
    ],
    where: {
      ScheduleDate: {
        [Op.between]: [start, end],
      },
    },
    order: [['ScheduleDate', 'ASC']],
  });

  return schedules;
};

module.exports = {
  createInterview,
  getAllInterviews,
  findInterviewById,
  updateInterviewResult,
  deleteInterview,
  getInterviewSchedulesByDateRange,
};
