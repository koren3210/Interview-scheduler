const Candidate = require("../model/candidate");

// Create a new candidate
const createCandidate = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, resume } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !resume) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newCandidate = await Candidate.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
      Resume: resume,
    });
    res.status(201).json(newCandidate);
  } catch (err) {
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
    res.json(candidates);
  } catch (err) {
    next(err);
  }
};

// Get candidate by ID
const getCandidateById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(204).json({ message: "No candidate matches ID" });
    }
    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

// Update candidate
const updateCandidate = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, resume } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  try {
    let candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(204).json({ message: "No candidate matches ID" });
    }

    candidate.FirstName = firstName || candidate.FirstName;
    candidate.LastName = lastName || candidate.LastName;
    candidate.Email = email || candidate.Email;
    candidate.PhoneNumber = phoneNumber || candidate.PhoneNumber;
    candidate.Resume = resume || candidate.Resume;

    await candidate.save();
    res.json(candidate);
  } catch (err) {
    next(err);
  }
};

// Delete candidate
const deleteCandidate = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  try {
    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(204).json({ message: "No candidate matches ID" });
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
