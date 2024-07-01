const sequelize = require('../config/db');
const createError = require('http-errors');

// Service to handle candidate-related operations
// raw SQL queries with Sequelize ORM for practicing SQL queries

// Create a new candidate
const createCandidate = async ({ firstName, lastName, email, phoneNumber, resume }) => {
  const result = await sequelize.query(
    `INSERT INTO Candidates (FirstName, LastName, Email, PhoneNumber, Resume, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [firstName, lastName, email, phoneNumber, resume],
      type: sequelize.QueryTypes.INSERT,
    }
  );

  // Retrieve the newly created candidate
  const newCandidateId = result[0];
  const [newCandidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
    replacements: [newCandidateId],
    type: sequelize.QueryTypes.SELECT,
  });

  return newCandidate;
};

// Get all candidates
const getAllCandidates = async () => {
  const candidates = await sequelize.query(`SELECT * FROM Candidates`, {
    type: sequelize.QueryTypes.SELECT,
  });

  return candidates;
};

// Get candidate by ID
const getCandidateById = async (id) => {
  const [candidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
    replacements: [id],
    type: sequelize.QueryTypes.SELECT,
  });

  if (!candidate) {
    throw createError(404, 'No candidate matches ID');
  }

  return candidate;
};

// Update candidate details
const updateCandidate = async (id, { firstName, lastName, email, phoneNumber, resume }) => {
  const [candidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
    replacements: [id],
    type: sequelize.QueryTypes.SELECT,
  });

  if (!candidate) {
    throw createError(404, 'No candidate matches ID');
  }

  await sequelize.query(
    `UPDATE Candidates
     SET FirstName = COALESCE(?, FirstName),
         LastName = COALESCE(?, LastName),
         Email = COALESCE(?, Email),
         PhoneNumber = COALESCE(?, PhoneNumber),
         Resume = COALESCE(?, Resume),
         updatedAt = NOW()
     WHERE CandidateID = ?`,
    {
      replacements: [firstName, lastName, email, phoneNumber, resume, id],
      type: sequelize.QueryTypes.UPDATE,
    }
  );

  // Retrieve the updated candidate
  const [updatedCandidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
    replacements: [id],
    type: sequelize.QueryTypes.SELECT,
  });

  return updatedCandidate;
};

// Delete candidate
const deleteCandidate = async (id) => {
  const result = await sequelize.query(`DELETE FROM Candidates WHERE CandidateID = ?`, {
    replacements: [id],
    type: sequelize.QueryTypes.BULKDELETE,
  });

  if (result === 0) {
    throw createError(404, 'No candidate matches ID');
  }
};

// Get scheduled interviews for candidate
const getScheduledInterviewsForCandidate = async (id) => {
  const [candidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
    replacements: [id],
    type: sequelize.QueryTypes.SELECT,
  });

  if (!candidate) {
    throw createError(404, 'No candidate matches ID');
  }

  const interviews = await sequelize.query(
    `SELECT 
       i.InterviewID,
       i.CandidateID,
       i.InterviewerID,
       i.InterviewDate,
       i.InterviewTime,
       i.InterviewType,
       i.InterviewResult,
       isch.ScheduleID,
       isch.ScheduleDate,
       isch.ScheduleTime,
       isch.Room
     FROM 
       Interviews i
     JOIN 
       Interview_Schedule isch ON i.InterviewID = isch.InterviewID
     WHERE 
       i.CandidateID = ?`,
    {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return interviews;
};

// Retrieve total number of interviews and types for each candidate
const getInterviewsSummary = async () => {
  const summary = await sequelize.query(
    `SELECT 
       c.CandidateID,
       c.FirstName,
       c.LastName,
       COUNT(i.InterviewID) AS totalInterviews,
       SUM(CASE WHEN i.InterviewType = 'Technical' THEN 1 ELSE 0 END) AS technicalInterviews,
       SUM(CASE WHEN i.InterviewType = 'HR' THEN 1 ELSE 0 END) AS hrInterviews
     FROM 
       Candidates c
     LEFT JOIN 
       Interviews i ON c.CandidateID = i.CandidateID
     GROUP BY 
       c.CandidateID`,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return summary;
};

// Retrieve detailed information for a specific candidate
const getCandidateDetails = async (id) => {
  const [candidateDetails] = await sequelize.query(
    `SELECT 
       c.CandidateID,
       c.FirstName,
       c.LastName,
       c.Email,
       c.PhoneNumber,
       c.Resume,
       c.createdAt,
       c.updatedAt,
       JSON_ARRAYAGG(JSON_OBJECT(
         'InterviewID', i.InterviewID,
         'InterviewerID', i.InterviewerID,
         'InterviewDate', i.InterviewDate,
         'InterviewTime', i.InterviewTime,
         'InterviewType', i.InterviewType,
         'InterviewResult', i.InterviewResult,
         'ScheduleID', isch.ScheduleID,
         'ScheduleDate', isch.ScheduleDate,
         'ScheduleTime', isch.ScheduleTime,
         'Room', isch.Room
       )) AS interviews
     FROM 
       Candidates c
     LEFT JOIN 
       Interviews i ON c.CandidateID = i.CandidateID
     LEFT JOIN 
       Interview_Schedule isch ON i.InterviewID = isch.InterviewID
     WHERE 
       c.CandidateID = ?
     GROUP BY 
       c.CandidateID`,
    {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (!candidateDetails) {
    throw createError(404, 'No candidate matches ID');
  }

  return candidateDetails;
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
