// server/routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Get menu
router.get('/', menuController.getMenu);

// Admin: upload image
router.post('/upload', auth, admin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// Admin: create menu item
router.post('/', auth, admin, menuController.createMenuItem);

// Admin: update menu item
router.put('/:id', auth, admin, menuController.updateMenuItem);

// Admin: delete menu item
router.delete('/:id', auth, admin, menuController.deleteMenuItem);

module.exports = router;