const express = require("express");
const router = express.Router();
const {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterviewResult,
  deleteInterview,
} = require("../controllers/interviewController");

router.post("/", createInterview); // POST /api/interviews
router.get("/", getAllInterviews); // GET /api/interviews
router.get("/:id", getInterviewById); // GET /api/interviews/:id
router.put("/:id", updateInterviewResult); // PUT /api/interviews/:id
router.delete("/:id", deleteInterview); // DELETE /api/interviews/:id

module.exports = router;
