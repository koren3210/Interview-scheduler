const InterviewSchedule = require('../models/interviewSchedule.model');
const { handleSequelizeUniqueConstraintError } = require('../utils/errorHandlers');
const formatEntityResponse = require('../utils/formatEntityResponse');

// Create a new interview schedule
const createInterviewSchedule = async (req, res, next) => {
  try {
    const { interviewID, scheduleDate, scheduleTime, room } = req.body;

    // Create new interview schedule in the database
    const newInterviewSchedule = await InterviewSchedule.create({
      InterviewID: interviewID,
      ScheduleDate: scheduleDate,
      ScheduleTime: scheduleTime,
      Room: room,
    });

    res.status(201).json(formatEntityResponse(newInterviewSchedule));
  } catch (err) {
    next(err);
  }
};

// Get all interview schedules
const getAllInterviewSchedules = async (req, res, next) => {
  try {
    const interviewSchedules = await InterviewSchedule.findAll();
    if (!interviewSchedules.length) {
      return res.status(204).json({ message: 'No interview schedules found.' });
    }
    res.json(interviewSchedules.map((schedule) => formatEntityResponse(schedule)));
  } catch (err) {
    next(err);
  }
};

// Get interview schedule by ID
const getInterviewScheduleById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewSchedule = await InterviewSchedule.findByPk(id);
    if (!interviewSchedule) {
      return res.status(404).json({ message: 'No interview schedule matches ID' });
    }
    res.json(formatEntityResponse(interviewSchedule));
  } catch (err) {
    next(err);
  }
};

// Update an interview schedule
const updateInterviewSchedule = async (req, res, next) => {
  const { id } = req.params;
  const { interviewID, scheduleDate, scheduleTime, room } = req.body;

  try {
    // Find interview schedule by ID in the database
    let interviewSchedule = await InterviewSchedule.findByPk(id);

    // Check if interview schedule exists
    if (!interviewSchedule) {
      return res.status(404).json({ message: 'No interview schedule matches ID' });
    }

    // Update interview schedule fields if provided
    interviewSchedule.InterviewID = interviewID || interviewSchedule.InterviewID;
    interviewSchedule.ScheduleDate = scheduleDate || interviewSchedule.ScheduleDate;
    interviewSchedule.ScheduleTime = scheduleTime || interviewSchedule.ScheduleTime;
    interviewSchedule.Room = room || interviewSchedule.Room;

    // Save updated interview schedule
    await interviewSchedule.save();

    res.json(formatEntityResponse(interviewSchedule));
  } catch (err) {
    next(err);
  }
};

// Delete interview schedule
const deleteInterviewSchedule = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewSchedule = await InterviewSchedule.findByPk(id);
    if (!interviewSchedule) {
      return res.status(404).json({ message: 'No interview schedule matches ID' });
    }

    await interviewSchedule.destroy();
    res.json({ message: 'Interview schedule deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInterviewSchedule,
  getAllInterviewSchedules,
  getInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
};
