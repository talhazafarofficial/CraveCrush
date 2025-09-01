module.exports = (req, res, next) => {
  // First, check if user is available
  if (!req.user) {
    console.log('No user found in request');
    return res.status(401).json({ error: 'Unauthorized - No user found' });
  }

  // Then check role
  if (req.user.role !== 'admin') {
    console.log('Access denied - Admin only'); // ✅ now runs
    return res.status(403).json({ error: 'Access denied - Admin only' });
  }

  // Allow admin
  next();
};
