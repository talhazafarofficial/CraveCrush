const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestName: { type: String },
  guestEmail: { type: String },

  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true }
    }
  ],

  totalPrice: { type: Number, required: true },
  address: String,
  mobile: String,
  note: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },

  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
  approvalTime: Date,
  cancellationRequestedAt: Date,
  autoDeleteAt: Date,
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);