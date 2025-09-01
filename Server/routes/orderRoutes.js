const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  placeOrder,
  cancelOrder,
  getPendingOrders,
  approveOrder,
  rejectOrder,
  getUserOrders
} = require('../controllers/orderController');

// USER ROUTES
const authOptional = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (token) {
    // If token exists, use auth middleware
    return auth(req, res, next);
  }
  // No token, proceed as guest
  next();
};
router.post('/', authOptional, placeOrder);
router.delete('/:id', auth, cancelOrder);
router.get('/my/history', auth, getUserOrders);

// ADMIN ROUTES
router.get('/admin/all', auth, admin, getPendingOrders);
router.patch('/admin/approve/:id', auth, admin, approveOrder);
router.patch('/admin/reject/:id', auth, admin, rejectOrder);

module.exports = router;