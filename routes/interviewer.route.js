const express = require('express');
const router = express.Router();
const {
  createInterviewer,
  getAllInterviewers,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer,
  getCandidatesByInterviewer,
} = require('../controllers/interviewer.controller');
const validateRequest = require('../middleware/validateRequest');
const interviewerSchema = require('../validation/interviewerSchema');

router.post('/', validateRequest(interviewerSchema), createInterviewer); // POST /api/interviewers
router.get('/', getAllInterviewers); // GET /api/interviewers
router.get('/:id', getInterviewerById); // GET /api/interviewers/:id
router.put('/:id', validateRequest(interviewerSchema), updateInterviewer); // PUT /api/interviewers/:id
router.delete('/:id', deleteInterviewer); // DELETE /api/interviewers/:id
router.get('/:id/candidates', getCandidatesByInterviewer); // GET  /api/interviewers/:id/candidates

module.exports = router;
