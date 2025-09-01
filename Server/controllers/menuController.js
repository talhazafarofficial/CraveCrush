const MenuItem = require('../models/MenuItem');

exports.getMenu = async(req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
};

exports.createMenuItem = async(req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  const item = await MenuItem.create({ title, description, price, category, imageUrl });
  res.status(201).json(item);
};

exports.deleteMenuItem = async(req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Deleted' });
};

// Edit menu item
exports.updateMenuItem = async (req, res) => {
  const { title, description, price, category, imageUrl } = req.body;
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { title, description, price, category, imageUrl },
    { new: true }
  );
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  res.json(item);
};