const express = require('express');
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getScheduledInterviewsForCandidate,
  getInterviewsSummary,
  getCandidateDetails,
} = require('../controllers/candidate.controller');
const validateRequest = require('../middleware/validateRequest');
const candidateSchema = require('../validation/candidateSchema');

router.post('/', validateRequest(candidateSchema), createCandidate); // POST /api/candidates
router.get('/', getAllCandidates); // GET /api/candidates
router.get('/interviews-summary', getInterviewsSummary); // GET api/candidates/interview-summary
router.get('/:id/details', getCandidateDetails); //GET /api/candidates/:id/details
router.get('/:id/interviews', getScheduledInterviewsForCandidate); // GET api/candidates/:id/interviews
router.get('/:id', getCandidateById); // GET /api/candidates/:id
router.put('/:id', validateRequest(candidateSchema), updateCandidate); // PUT /api/candidates/:id
router.delete('/:id', deleteCandidate); // DELETE /api/candidates/:id

module.exports = router;
