const Interview = require('../models/interview.model');
const InterviewSchedule = require('../models/interviewSchedule.model');
const { handleSequelizeUniqueConstraintError } = require('../utils/errorHandlers');
const formatEntityResponse = require('../utils/formatEntityResponse');
const { Op } = require('sequelize');

// Create a new interview
const createInterview = async (req, res, next) => {
  try {
    const { candidateID, interviewerID, interviewDate, interviewTime, interviewType, interviewResult } = req.body;

    // Create new interview in the database
    const newInterview = await Interview.create({
      CandidateID: candidateID,
      InterviewerID: interviewerID,
      InterviewDate: interviewDate,
      InterviewTime: interviewTime,
      InterviewType: interviewType,
      InterviewResult: interviewResult,
    });

    res.status(201).json(formatEntityResponse(newInterview));
  } catch (err) {
    next(err);
  }
};

// Get all interviews
const getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.findAll();
    if (!interviews.length) {
      return res.status(204).json({ message: 'No interviews found.' });
    }
    res.json(interviews.map((interview) => formatEntityResponse(interview)));
  } catch (err) {
    next(err);
  }
};

// Get interview by ID
const getInterviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      return res.status(404).json({ message: 'No interview matches ID' });
    }
    res.json(formatEntityResponse(interview));
  } catch (err) {
    next(err);
  }
};

// Update interview result
const updateInterviewResult = async (req, res, next) => {
  const { id } = req.params;
  const { interviewResult } = req.body;

  try {
    // Find interview by ID in the database
    let interview = await Interview.findByPk(id);

    // Check if interview exists
    if (!interview) {
      return res.status(404).json({ message: 'No interview matches ID' });
    }

    // Update interview result
    interview.InterviewResult = interviewResult || interview.InterviewResult;

    // Save updated interview
    await interview.save();

    res.json(formatEntityResponse(interview));
  } catch (err) {
    next(err);
  }
};

// Delete interview
const deleteInterview = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      return res.status(404).json({ message: 'No interview matches ID' });
    }

    await interview.destroy();
    res.json({ message: 'Interview deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Get interview schedules by date range
const getInterviewSchedulesByDateRange = async (req, res, next) => {
  console.log('first');
  try {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

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

    res.status(200).json(schedules.map((schedule) => formatEntityResponse(schedule)));
  } catch (err) {
    next(err);
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
