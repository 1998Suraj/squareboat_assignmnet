const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { protect, restrictTo } = require("../middleware/auth");

router.post(
  "/:jobId",
  protect,
  restrictTo("candidate"),
  applicationController.applyToJob
);
router.get(
  "/my-applications",
  protect,
  restrictTo("candidate"),
  applicationController.getUserApplications
);

module.exports = router;
