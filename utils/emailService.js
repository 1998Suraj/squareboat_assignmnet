const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendApplicationEmail = async (candidate, recruiterEmail, job) => {
  // Email to candidate
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: candidate.email,
    subject: `Application Submitted for ${job.title}`,
    text: `Dear ${candidate.name},

You have successfully applied for the position of ${job.title}.

Best regards,
Job Portal Team`,
  });

  // Email to recruiter
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recruiterEmail,
    subject: `New Application for ${job.title}`,
    html: `
      <h2>New Job Application</h2>
      <p>A new candidate has applied for the position of ${job.title}</p>
      
      <h3>Candidate Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${candidate.name}</li>
        <li><strong>Email:</strong> ${candidate.email}</li>
        <li><strong>Mobile:</strong> ${candidate.mobile}</li>
      </ul>
      
      <h3>Job Details:</h3>
      <ul>
        <li><strong>Position:</strong> ${job.title}</li>
        <li><strong>Description:</strong> ${job.description}</li>
      </ul>
    `,
  });
};
