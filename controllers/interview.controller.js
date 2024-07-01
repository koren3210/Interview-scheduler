const interviewService = require('../services/interview.service');
const formatEntityResponse = require('../utils/formatEntityResponse');
const createError = require('http-errors');

// Create a new interview
const createInterview = async (req, res, next) => {
  try {
    const { candidateID, interviewerID, interviewDate, interviewTime, interviewType, interviewResult } = req.body;

    const newInterview = await interviewService.createInterview({
      candidateID,
      interviewerID,
      interviewDate,
      interviewTime,
      interviewType,
      interviewResult,
    });

    res.status(201).json(formatEntityResponse(newInterview));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all interviews
const getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await interviewService.getAllInterviews();

    if (!interviews.length) {
      return next(createError(204, 'No interviews found.'));
    }

    res.json(interviews.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get interview by ID
const getInterviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interview = await interviewService.findInterviewById(id);

    res.json(formatEntityResponse(interview));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update interview result
const updateInterviewResult = async (req, res, next) => {
  const { id } = req.params;
  const { interviewResult } = req.body;

  try {
    const updatedInterview = await interviewService.updateInterviewResult(id, interviewResult);

    res.json(formatEntityResponse(updatedInterview));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Delete interview
const deleteInterview = async (req, res, next) => {
  const { id } = req.params;

  try {
    await interviewService.deleteInterview(id);

    res.json({ message: 'Interview deleted successfully' });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get interview schedules by date range
const getInterviewSchedulesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const schedules = await interviewService.getInterviewSchedulesByDateRange(startDate, endDate);

    if (!schedules.length) {
      return next(createError(204, 'No interview schedules found in the given date range.'));
    }

    res.status(200).json(schedules.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports = {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterviewResult,
  deleteInterview,
  getInterviewSchedulesByDateRange,
};
