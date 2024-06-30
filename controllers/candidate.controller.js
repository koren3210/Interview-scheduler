const sequelize = require('../config/db');
const formatCandidateDetails = require('../utils/formatCandidateDetails');
const formatEntityResponse = require('../utils/formatEntityResponse');

// Controller using raw SQL queries with Sequelize ORM for practicing sql queries

// Create a new candidate
const createCandidate = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, resume } = req.body;

    // Insert new candidate into the database using raw SQL
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

    res.status(201).json(formatEntityResponse(newCandidate));
  } catch (err) {
    next(err);
  }
};

// Get all candidates
const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await sequelize.query(`SELECT * FROM Candidates`, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (!candidates.length) {
      return res.status(204).json({ message: 'No candidates found.' });
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
    const [candidate] = await sequelize.query(`SELECT * FROM Candidates WHERE CandidateID = ?`, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });

    if (!candidate) {
      return res.status(404).json({ message: 'No candidate matches ID' });
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
    // Update candidate fields in the database using raw SQL
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

    if (!updatedCandidate) {
      return res.status(404).json({ message: 'No candidate matches ID' });
    }

    res.json(formatEntityResponse(updatedCandidate));
  } catch (err) {
    next(err);
  }
};

// Delete candidate
const deleteCandidate = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Delete candidate from the database using raw SQL
    const result = await sequelize.query(`DELETE FROM Candidates WHERE CandidateID = ?`, {
      replacements: [id],
      type: sequelize.QueryTypes.BULKDELETE,
    });

    if (result === 0) {
      return res.status(404).json({ message: 'No candidate matches ID' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getScheduledInterviewsForCandidate = async (req, res, next) => {
  const { id } = req.params;
  console.log('Retrieving scheduled interviews for candidate with ID:', id);

  try {
    // Retrieve all scheduled interviews for a specific candidate using raw SQL
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

    if (interviews.length === 0) {
      return res.status(204).json({ message: 'No scheduled interviews found for this candidate.' });
    }

    res.json(interviews.map(formatEntityResponse));
  } catch (err) {
    console.error('Error retrieving scheduled interviews:', err);
    next(err);
  }
};

// Retrieve total number of interviews and types for each candidate
const getInterviewsSummary = async (req, res, next) => {
  try {
    // SQL query to get total number of interviews and types for each candidate
    const summary = await sequelize.query(
      `SELECT 
         c.CandidateID,
         c.FirstName,
         c.LastName,
         COUNT(i.InterviewID) AS totalInterviews,
         SUM(CASE WHEN i.InterviewType = 'Technical' THEN 1 ELSE 0 END) AS technicalInterviews,
         SUM(CASE WHEN i.InterviewType = 'HR' THEN 1 ELSE 0 END) AS hrInterviews,
         SUM(CASE WHEN i.InterviewType = 'Managerial' THEN 1 ELSE 0 END) AS managerialInterviews
       FROM 
         Candidates c
       LEFT JOIN 
         Interviews i ON c.CandidateID = i.CandidateID
       GROUP BY 
         c.CandidateID, c.FirstName, c.LastName`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (summary.length === 0) {
      return res.status(204).json({ message: 'No interview summary data found.' });
    }

    // Format the summary for response
    const formattedSummary = summary.map(formatEntityResponse);

    res.status(200).json(formattedSummary);
  } catch (err) {
    console.error('Error retrieving interview summary:', err);
    next(err);
  }
};

// Retrieve detailed information for a specific candidate
const getCandidateDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    // SQL query to get detailed information for the specific candidate
    const candidateDetails = await sequelize.query(
      `SELECT 
         c.CandidateID AS candidateId,
         c.FirstName AS firstName,
         c.LastName AS lastName,
         c.Email AS email,
         c.PhoneNumber AS phoneNumber,
         c.Resume AS resume,
         i.InterviewID AS interviewId,
         i.InterviewDate AS interviewDate,
         i.InterviewTime AS interviewTime,
         i.InterviewType AS interviewType,
         i.InterviewResult AS interviewResult,
         isch.ScheduleID AS scheduleId,
         isch.ScheduleDate AS scheduleDate,
         isch.ScheduleTime AS scheduleTime,
         isch.Room AS room,
         iv.FirstName AS interviewerFirstName,
         iv.LastName AS interviewerLastName,
         iv.InterviewerID AS interviewerId
       FROM 
         Candidates c
       LEFT JOIN 
         Interviews i ON c.CandidateID = i.CandidateID
       LEFT JOIN 
         Interview_Schedule isch ON i.InterviewID = isch.InterviewID
       LEFT JOIN 
         Interviewers iv ON i.InterviewerID = iv.InterviewerID
       WHERE 
         c.CandidateID = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (candidateDetails.length === 0) {
      return res.status(404).json({ message: 'No details found for this candidate.' });
    }

    // Format the result for response using the utility function
    const formattedDetails = formatCandidateDetails(candidateDetails);

    res.status(200).json(formattedDetails);
  } catch (err) {
    console.error('Error retrieving candidate details:', err);
    next(err);
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
