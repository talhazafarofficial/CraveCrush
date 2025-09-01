const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"CraveCrush" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};