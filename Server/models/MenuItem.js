const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['deals', 'burger', 'pizza', 'drinks', 'desert'],
    required: true
  },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);