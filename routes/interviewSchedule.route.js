const express = require('express');
const router = express.Router();
const {
  createInterviewSchedule,
  getInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
  getAllInterviewSchedules,
} = require('../controllers/interviewSchedule.controller');
const validateRequest = require('../middleware/validateRequest');
const interviewScheduleSchema = require('../validation/interviewScheduleSchema');

router.post('/', validateRequest(interviewScheduleSchema), createInterviewSchedule); // POST /api/interview-schedules
router.get('/', getAllInterviewSchedules); // GET /api/interviews/schedule
router.get('/:id', getInterviewScheduleById); // GET /api/interviews/schedule/:id
router.put('/:id', validateRequest(interviewScheduleSchema), updateInterviewSchedule); // PUT /api/interviews//:id
router.delete('/:id', deleteInterviewSchedule); // DELETE /api/interviews/schedule/:id

module.exports = router;
