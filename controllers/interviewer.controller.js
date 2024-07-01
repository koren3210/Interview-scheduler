const interviewerService = require('../services/interviewer.service');
const formatEntityResponse = require('../utils/formatEntityResponse');
const createError = require('http-errors');

// Create a new interviewer
const createInterviewer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, resume } = req.body;

    const newInterviewer = await interviewerService.createInterviewer({
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    });

    res.status(201).json(formatEntityResponse(newInterviewer));
  } catch (err) {
    next(err);
  }
};

// Get all interviewers
const getAllInterviewers = async (req, res, next) => {
  try {
    const interviewers = await interviewerService.getAllInterviewers();

    if (!interviewers.length) {
      return next(createError(204, 'No interviewers found.'));
    }

    res.json(interviewers.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get interviewer by ID
const getInterviewerById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewer = await interviewerService.findInterviewerById(id);
    res.json(formatEntityResponse(interviewer));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update interviewer
const updateInterviewer = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, resume } = req.body;

  try {
    const updatedInterviewer = await interviewerService.updateInterviewer(id, {
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    });

    res.json(formatEntityResponse(updatedInterviewer));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Delete interviewer
const deleteInterviewer = async (req, res, next) => {
  const { id } = req.params;

  try {
    await interviewerService.deleteInterviewer(id);
    res.json({ message: 'Interviewer deleted successfully' });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get candidates by interviewer
const getCandidatesByInterviewer = async (req, res, next) => {
  const { id } = req.params;

  try {
    await interviewerService.findInterviewerById(id);
    const candidates = await interviewerService.getCandidatesByInterviewer(id);

    if (!candidates.length) {
      return next(createError(204, 'No candidates found for the specified interviewer.'));
    }

    res.json(candidates.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports = {
  createInterviewer,
  getAllInterviewers,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer,
  getCandidatesByInterviewer,
};
