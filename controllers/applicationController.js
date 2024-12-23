const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendApplicationEmail } = require("../utils/emailService");

exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate("recruiter");

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user._id,
    });

    // Send complete user details in email
    await sendApplicationEmail(
      {
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
      },
      job.recruiter.email,
      job
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    }).populate("job");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
