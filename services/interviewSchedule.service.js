const InterviewSchedule = require('../models/interviewSchedule.model');
const createError = require('http-errors');

// Create a new interview schedule
const createInterviewSchedule = async (data) => {
  const { interviewID, scheduleDate, scheduleTime, room } = data;

  // Create new interview schedule in the database
  const newInterviewSchedule = await InterviewSchedule.create({
    InterviewID: interviewID,
    ScheduleDate: scheduleDate,
    ScheduleTime: scheduleTime,
    Room: room,
  });

  return newInterviewSchedule;
};

// Get all interview schedules
const getAllInterviewSchedules = async () => {
  return InterviewSchedule.findAll();
};

// Find interview schedule by ID
const findInterviewScheduleById = async (id) => {
  const interviewSchedule = await InterviewSchedule.findByPk(id);
  if (!interviewSchedule) {
    throw createError(404, 'No interview schedule matches ID');
  }
  return interviewSchedule;
};

// Update interview schedule
const updateInterviewSchedule = async (id, data) => {
  let interviewSchedule = await findInterviewScheduleById(id);

  interviewSchedule.InterviewID = data.interviewID || interviewSchedule.InterviewID;
  interviewSchedule.ScheduleDate = data.scheduleDate || interviewSchedule.ScheduleDate;
  interviewSchedule.ScheduleTime = data.scheduleTime || interviewSchedule.ScheduleTime;
  interviewSchedule.Room = data.room || interviewSchedule.Room;

  await interviewSchedule.save();

  return interviewSchedule;
};

// Delete interview schedule
const deleteInterviewSchedule = async (id) => {
  const interviewSchedule = await findInterviewScheduleById(id);
  await interviewSchedule.destroy();
};

module.exports = {
  createInterviewSchedule,
  getAllInterviewSchedules,
  findInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
};
