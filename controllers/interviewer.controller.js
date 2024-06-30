const Candidate = require('../models/candidate.model');
const Interview = require('../models/interview.model');
const Interviewer = require('../models/interviewer.model');
const { handleSequelizeUniqueConstraintError } = require('../utils/errorHandlers');
const formatEntityResponse = require('../utils/formatEntityResponse');

// Create a new interviewer
const createInterviewer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, resume } = req.body;

    // Create new interviewer in database
    const newInterviewer = await Interviewer.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
      Resume: resume,
    });

    res.status(201).json(formatEntityResponse(newInterviewer));
  } catch (err) {
    next(err);
  }
};

// Get all interviewers
const getAllInterviewers = async (req, res, next) => {
  try {
    const interviewers = await Interviewer.findAll();
    if (!interviewers.length) {
      return res.status(204).json({ message: 'No interviewers found.' });
    }
    res.json(interviewers.map((interviewer) => formatEntityResponse(interviewer)));
  } catch (err) {
    next(err);
  }
};

// Get interviewer by ID
const getInterviewerById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewer = await Interviewer.findByPk(id);
    if (!interviewer) {
      return res.status(404).json({ message: 'No interviewer matches ID' });
    }
    res.json(formatEntityResponse(interviewer));
  } catch (err) {
    next(err);
  }
};

// Update interviewer
const updateInterviewer = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, resume } = req.body;

  try {
    // Find interviewer by ID in database
    let interviewer = await Interviewer.findByPk(id);

    // Check if interviewer exists
    if (!interviewer) {
      return res.status(404).json({ message: 'No interviewer matches ID' });
    }

    // Update interviewer fields if provided
    interviewer.FirstName = firstName || interviewer.FirstName;
    interviewer.LastName = lastName || interviewer.LastName;
    interviewer.Email = email || interviewer.Email;
    interviewer.PhoneNumber = phoneNumber || interviewer.PhoneNumber;
    interviewer.Resume = resume || interviewer.Resume;

    // Save updated interviewer
    await interviewer.save();

    res.json(formatEntityResponse(interviewer));
  } catch (err) {
    next(err);
  }
};

// Delete interviewer
const deleteInterviewer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewer = await Interviewer.findByPk(id);
    if (!interviewer) {
      return res.status(404).json({ message: 'No interviewer matches ID' });
    }

    await interviewer.destroy();
    res.json({ message: 'Interviewer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getCandidatesByInterviewer = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find candidates interviewed by the specified interviewer
    const candidates = await Candidate.findAll({
      include: {
        model: Interview,
        where: { InterviewerID: id },
        include: {
          model: Interviewer,
          attributes: ['FirstName', 'LastName', 'Email', 'PhoneNumber'],
        },
        attributes: ['InterviewDate', 'InterviewTime', 'InterviewType', 'InterviewResult'],
      },
    });

    // Return the list of candidates
    res.json(candidates);
  } catch (err) {
    next(err);
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
