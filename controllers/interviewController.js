const Interview = require("../models/interview");
const {
  handleSequelizeUniqueConstraintError,
} = require("../utils/errorHandlers");
const interviewSchema = require("../validation/interviewSchema");
const formatEntityResponse = require("../utils/formatEntityResponse");

// Create a new interview
const createInterview = async (req, res, next) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = interviewSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const {
      candidateID,
      interviewerID,
      interviewDate,
      interviewTime,
      interviewType,
      interviewResult,
    } = value;

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
    const uniqueConstraintErrors = handleSequelizeUniqueConstraintError(err);
    if (uniqueConstraintErrors) {
      return res
        .status(400)
        .json({ message: "Validation error", details: uniqueConstraintErrors });
    }

    // Handle other errors
    next(err);
  }
};

// Get all interviews
const getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.findAll();
    if (!interviews.length) {
      return res.status(204).json({ message: "No interviews found." });
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
      return res.status(404).json({ message: "No interview matches ID" });
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
    // Validate request body against Joi schema
    const { error, value } = interviewSchema.validate(
      { interviewResult },
      { abortEarly: false, allowUnknown: true }
    );

    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    // Find interview by ID in the database
    let interview = await Interview.findByPk(id);

    // Check if interview exists
    if (!interview) {
      return res.status(404).json({ message: "No interview matches ID" });
    }

    // Update interview result
    interview.InterviewResult =
      value.interviewResult || interview.InterviewResult;

    // Save updated interview
    await interview.save();

    res.json(formatEntityResponse(interview));
  } catch (err) {
    const uniqueConstraintErrors = handleSequelizeUniqueConstraintError(err);
    if (uniqueConstraintErrors) {
      return res
        .status(400)
        .json({ message: "Validation error", details: uniqueConstraintErrors });
    }

    // Handle other errors
    next(err);
  }
};

// Delete interview
const deleteInterview = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      return res.status(404).json({ message: "No interview matches ID" });
    }

    await interview.destroy();
    res.json({ message: "Interview deleted successfully" });
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
};
