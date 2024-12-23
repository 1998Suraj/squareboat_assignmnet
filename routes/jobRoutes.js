const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", protect, jobController.getAllJobs);
router.post("/", protect, restrictTo("recruiter"), jobController.createJob);
router.get(
  "/:jobId/applicants",
  protect,
  restrictTo("recruiter"),
  jobController.getJobApplicants
);

module.exports = router;
