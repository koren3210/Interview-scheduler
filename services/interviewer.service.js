const Interviewer = require('../models/interviewer.model');
const Candidate = require('../models/candidate.model');
const Interview = require('../models/interview.model');
const createError = require('http-errors');

// Create a new interviewer
const createInterviewer = async (data) => {
  const { firstName, lastName, email, phoneNumber, resume } = data;

  // Create new interviewer in the database
  const newInterviewer = await Interviewer.create({
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    PhoneNumber: phoneNumber,
    Resume: resume,
  });

  return newInterviewer;
};

// Get all interviewers
const getAllInterviewers = async () => {
  return Interviewer.findAll();
};

// Find interviewer by ID
const findInterviewerById = async (id) => {
  const interviewer = await Interviewer.findByPk(id);
  if (!interviewer) {
    throw createError(404, 'No interviewer matches ID');
  }
  return interviewer;
};

// Update interviewer
const updateInterviewer = async (id, data) => {
  let interviewer = await findInterviewerById(id);

  interviewer.FirstName = data.firstName || interviewer.FirstName;
  interviewer.LastName = data.lastName || interviewer.LastName;
  interviewer.Email = data.email || interviewer.Email;
  interviewer.PhoneNumber = data.phoneNumber || interviewer.PhoneNumber;
  interviewer.Resume = data.resume || interviewer.Resume;

  await interviewer.save();

  return interviewer;
};

// Delete interviewer
const deleteInterviewer = async (id) => {
  const interviewer = await findInterviewerById(id);
  await interviewer.destroy();
};

// Get candidates by interviewer
const getCandidatesByInterviewer = async (id) => {
  return Candidate.findAll({
    include: {
      model: Interview,
      where: { interviewerId: id },
      include: {
        model: Interviewer,
        attributes: ['firstName', 'lastName', 'email', 'phoneNumber'],
      },
      attributes: ['interviewDate', 'interviewTime', 'interviewType', 'interviewResult'],
    },
  });
};

module.exports = {
  createInterviewer,
  getAllInterviewers,
  findInterviewerById,
  updateInterviewer,
  deleteInterviewer,
  getCandidatesByInterviewer,
};
