const express = require('express');
const router = express.Router();
const {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterviewResult,
  deleteInterview,
  getInterviewSchedulesByDateRange,
} = require('../controllers/interview.controller');
const validateRequest = require('../middleware/validateRequest');
const interviewSchema = require('../validation/interviewSchema');
const dateRangeSchema = require('../validation/dateRangeSchema');

router.post('/', validateRequest(interviewSchema), createInterview); // POST /api/interviews
router.get('/', getAllInterviews); // GET /api/interviews
router.get('/schedule', validateRequest(dateRangeSchema), getInterviewSchedulesByDateRange); // GET /api/interviews/schedule
router.get('/:id', getInterviewById); // GET /api/interviews/:id
router.put('/:id', updateInterviewResult); // PUT /api/interviews/:id
router.delete('/:id', deleteInterview); // DELETE /api/interviews/:id

module.exports = router;
