const candidateService = require('../services/candidate.service');
const formatEntityResponse = require('../utils/formatEntityResponse');
const createError = require('http-errors');

// Controller using raw SQL queries with Sequelize ORM for practicing SQL queries

// Create a new candidate
const createCandidate = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, resume } = req.body;

    // Call the service to create a new candidate
    const newCandidate = await candidateService.createCandidate({
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    });

    res.status(201).json(formatEntityResponse(newCandidate));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get all candidates
const getAllCandidates = async (req, res, next) => {
  try {
    // Call the service to get all candidates
    const candidates = await candidateService.getAllCandidates();

    if (!candidates.length) {
      return next(createError(204, 'No candidates found.'));
    }

    res.json(candidates.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get candidate by ID
const getCandidateById = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Call the service to get candidate by ID
    const candidate = await candidateService.getCandidateById(id);

    res.json(formatEntityResponse(candidate));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update candidate
const updateCandidate = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, resume } = req.body;

  try {
    // Call the service to update candidate details
    const updatedCandidate = await candidateService.updateCandidate(id, {
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    });

    res.json(formatEntityResponse(updatedCandidate));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Delete candidate
const deleteCandidate = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Call the service to delete candidate
    await candidateService.deleteCandidate(id);

    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Get scheduled interviews for candidate
const getScheduledInterviewsForCandidate = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Call the service to get scheduled interviews for a specific candidate
    const interviews = await candidateService.getScheduledInterviewsForCandidate(id);

    if (interviews.length === 0) {
      return next(createError(204, 'No scheduled interviews found for this candidate.'));
    }

    res.json(interviews.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Retrieve total number of interviews and types for each candidate
const getInterviewsSummary = async (req, res, next) => {
  try {
    // Call the service to get the summary of interviews for each candidate
    const summary = await candidateService.getInterviewsSummary();

    if (summary.length === 0) {
      return next(createError(204, 'No interview summary data found.'));
    }

    res.status(200).json(summary.map(formatEntityResponse));
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Retrieve detailed information for a specific candidate
const getCandidateDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Call the service to get detailed information for the specific candidate
    const candidateDetails = await candidateService.getCandidateDetails(id);

    res.status(200).json(candidateDetails);
  } catch (err) {
    next(createError(500, err.message));
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getScheduledInterviewsForCandidate,
  getInterviewsSummary,
  getCandidateDetails,
};
