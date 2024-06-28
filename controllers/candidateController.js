const Candidate = require("../models/candidate");
const {
  handleSequelizeUniqueConstraintError,
} = require("../utils/errorHandlers");
const candidateSchema = require("../validation/candidateSchema");
const formatEntityResponse = require("../utils/formatEntityResponse"); // Import the function

// Create a new candidate
const createCandidate = async (req, res, next) => {
  try {
    // Validate request body against Joi schema
    const { error, value } = candidateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    const { firstName, lastName, email, phoneNumber, resume } = value;

    // Create new candidate in database
    const newCandidate = await Candidate.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
      Resume: resume,
    });

    res.status(201).json(formatEntityResponse(newCandidate));
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

// Get all candidates
const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.findAll();
    if (!candidates.length) {
      return res.status(204).json({ message: "No candidates found." });
    }
    res.json(candidates.map((candidate) => formatEntityResponse(candidate)));
  } catch (err) {
    next(err);
  }
};

// Get candidate by ID
const getCandidateById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ message: "No candidate matches ID" });
    }
    res.json(formatEntityResponse(candidate));
  } catch (err) {
    next(err);
  }
};

// Update candidate
const updateCandidate = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, resume } = req.body;

  try {
    // Validate request body against Joi schema
    const { error, value } = candidateSchema.validate(
      { firstName, lastName, email, phoneNumber, resume },
      { abortEarly: false, allowUnknown: true }
    );

    if (error) {
      // Joi validation failed
      return res
        .status(400)
        .json({ message: "Validation error", details: error.details });
    }

    // Find candidate by ID in database
    let candidate = await Candidate.findByPk(id);

    // Check if candidate exists
    if (!candidate) {
      return res.status(404).json({ message: "No candidate matches ID" });
    }

    // Update candidate fields if provided
    candidate.FirstName = value.firstName || candidate.FirstName;
    candidate.LastName = value.lastName || candidate.LastName;
    candidate.Email = value.email || candidate.Email;
    candidate.PhoneNumber = value.phoneNumber || candidate.PhoneNumber;
    candidate.Resume = value.resume || candidate.Resume;

    // Save updated candidate
    await candidate.save();

    res.json(formatEntityResponse(candidate));
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

// Delete candidate
const deleteCandidate = async (req, res, next) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ message: "No candidate matches ID" });
    }

    await candidate.destroy();
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
