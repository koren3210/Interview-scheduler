const interviewScheduleService = require('../services/interviewSchedule.service');
const formatEntityResponse = require('../utils/formatEntityResponse');
const createError = require('http-errors');

// Create a new interview schedule
const createInterviewSchedule = async (req, res, next) => {
  try {
    const { interviewID, scheduleDate, scheduleTime, room } = req.body;

    const newInterviewSchedule = await interviewScheduleService.createInterviewSchedule({
      interviewID,
      scheduleDate,
      scheduleTime,
      room,
    });

    res.status(201).json(formatEntityResponse(newInterviewSchedule));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all interview schedules
const getAllInterviewSchedules = async (req, res, next) => {
  try {
    const interviewSchedules = await interviewScheduleService.getAllInterviewSchedules();

    if (!interviewSchedules.length) {
      return next(createError(204, 'No interview schedules found.'));
    }

    res.json(interviewSchedules.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get interview schedule by ID
const getInterviewScheduleById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewSchedule = await interviewScheduleService.findInterviewScheduleById(id);
    res.json(formatEntityResponse(interviewSchedule));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update an interview schedule
const updateInterviewSchedule = async (req, res, next) => {
  const { id } = req.params;
  const { interviewID, scheduleDate, scheduleTime, room } = req.body;

  try {
    const updatedInterviewSchedule = await interviewScheduleService.updateInterviewSchedule(id, {
      interviewID,
      scheduleDate,
      scheduleTime,
      room,
    });

    res.json(formatEntityResponse(updatedInterviewSchedule));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Delete interview schedule
const deleteInterviewSchedule = async (req, res, next) => {
  const { id } = req.params;

  try {
    await interviewScheduleService.deleteInterviewSchedule(id);
    res.json({ message: 'Interview schedule deleted successfully' });
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports = {
  createInterviewSchedule,
  getAllInterviewSchedules,
  getInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
};
