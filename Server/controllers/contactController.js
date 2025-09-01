const { sendMail } = require('../utils/sendEmail');

exports.contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const html = `
      <h3>New Contact Form Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `;

    // Send to all admin users in the database
    const User = require('../models/User');
    const adminUsers = await User.find({ role: 'admin' });
    const adminEmails = adminUsers.map(a => a.email);
    if (adminEmails.length > 0) {
      await sendMail(adminEmails, '📨 New Contact Submission - CraveCrush', html);
    }

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};