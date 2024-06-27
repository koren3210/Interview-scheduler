const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

router.post("/", createCandidate); // POST /api/candidates
router.get("/", getAllCandidates); // GET /api/candidates
router.get("/:id", getCandidateById); // GET /api/candidates/:id
router.put("/:id", updateCandidate); // PUT /api/candidates/:id
router.delete("/:id", deleteCandidate); // DELETE /api/candidates/:id

module.exports = router;
