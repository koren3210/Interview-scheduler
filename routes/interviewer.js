const express = require("express");
const router = express.Router();
const {
  createInterviewer,
  getAllInterviewers,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer,
} = require("../controllers/interviewerController");

router.post("/", createInterviewer); // POST /api/interviewers
router.get("/", getAllInterviewers); // GET /api/interviewers
router.get("/:id", getInterviewerById); // GET /api/interviewers/:id
router.put("/:id", updateInterviewer); // PUT /api/interviewers/:id
router.delete("/:id", deleteInterviewer); // DELETE /api/interviewers/:id

module.exports = router;
