const Interviewer = require("../models/interviewer");
const {
  handleSequelizeUniqueConstraintError,
} = require("../utils/errorHandlers");
const interviewerSchema = require("../validation/interviewerSchema");
const formatEntityResponse = require("../utils/formatEntityResponse");

// Create a new interviewer
const createInterviewer = async (req, res, next) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = interviewerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const { firstName, lastName, email, phoneNumber, resume } = value;

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

// Get all interviewers
const getAllInterviewers = async (req, res, next) => {
  try {
    const interviewers = await Interviewer.findAll();
    if (!interviewers.length) {
      return res.status(204).json({ message: "No interviewers found." });
    }
    res.json(
      interviewers.map((interviewer) => formatEntityResponse(interviewer))
    );
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
      return res.status(404).json({ message: "No interviewer matches ID" });
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
    // Validate request body against Joi schema
    const { error, value } = interviewerSchema.validate(
      { firstName, lastName, email, phoneNumber, resume },
      { abortEarly: false, allowUnknown: true }
    );

    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    // Find interviewer by ID in database
    let interviewer = await Interviewer.findByPk(id);

    // Check if interviewer exists
    if (!interviewer) {
      return res.status(404).json({ message: "No interviewer matches ID" });
    }

    // Update interviewer fields if provided
    interviewer.FirstName = value.firstName || interviewer.FirstName;
    interviewer.LastName = value.lastName || interviewer.LastName;
    interviewer.Email = value.email || interviewer.Email;
    interviewer.PhoneNumber = value.phoneNumber || interviewer.PhoneNumber;
    interviewer.Resume = value.resume || interviewer.Resume;

    // Save updated interviewer
    await interviewer.save();

    res.json(formatEntityResponse(interviewer));
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

// Delete interviewer
const deleteInterviewer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const interviewer = await Interviewer.findByPk(id);
    if (!interviewer) {
      return res.status(404).json({ message: "No interviewer matches ID" });
    }

    await interviewer.destroy();
    res.json({ message: "Interviewer deleted successfully" });
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
};
