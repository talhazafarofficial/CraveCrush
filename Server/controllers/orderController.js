const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { sendMail } = require('../utils/sendEmail');

// ✅ PLACE AN ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items, address, mobile, note, name, email } = req.body;
    let userId = null;
    let user = null;
    let guest = false;

    if (req.user && req.user.id) {
      userId = req.user.id;
      user = await User.findById(userId);
    } else {
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required for guest orders' });
      }
      guest = true;
    }

    let total = 0;
    for (let cartItem of items) {
      const product = await MenuItem.findById(cartItem.item);
      if (!product) throw new Error('Menu item not found');
      total += product.price * cartItem.quantity;
    }

    const orderData = {
      items,
      address,
      mobile,
      note,
      totalPrice: total,
      autoDeleteAt: new Date(Date.now() + 60 * 60 * 1000)
    };
    if (userId) orderData.user = userId;
    if (guest) {
      orderData.guestName = name;
      orderData.guestEmail = email;
    }
    const order = await Order.create(orderData);

    if (user) {
      if (!user.address) user.address = address;
      if (!user.mobileNumber) user.mobileNumber = mobile;
      await user.save();
    }

    const toEmail = guest ? email : user.email;
    const toName = guest ? name : user.name;

    // ✅ Send confirmation email
    await sendMail(toEmail, "🧾 CraveCrush - Order Confirmation", `
      <h2>Hi ${toName},</h2>
      <p>Thank you for placing your order with <strong>CraveCrush</strong>!</p>
      <p>Your order has been received and is currently pending approval.</p>
      <p><strong>Total Amount:</strong> PKR ${total.toFixed(2)}</p>
      <p>We’ll notify you as soon as your order has been approved.</p>
      <br/>
      <p>Cheers,</p>
      <p>The CraveCrush Team</p>
    `);

    // 📩 Notify all admins
    const adminUsers = await User.find({ role: 'admin' });
    const adminEmails = adminUsers.map(a => a.email);
    if (adminEmails.length > 0) {
      await sendMail(adminEmails, "🆕 New Order Received - CraveCrush", `
        <h2>New Order Alert</h2>
        <p><strong>Customer:</strong> ${toName} (${toEmail})</p>
        <p><strong>Total:</strong> PKR ${total.toFixed(2)}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <br/>
        <p style="color: #d32f2f;"><strong>Action Required:</strong> This order is awaiting your approval.</p>
      `);
    }

    res.status(201).json({ success: true, message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ CANCEL ORDER (within 10 minutes)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order || order.user._id.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    const cancelWindow = 10 * 60 * 1000;
    if (Date.now() - new Date(order.createdAt).getTime() > cancelWindow) {
      return res.status(400).json({ error: 'Cancel window expired (10 min)' });
    }

    await order.deleteOne();

    // Notify user
    await sendMail(order.user.email, "❌ CraveCrush - Order Cancelled", `
      <h2>Order Cancelled</h2>
      <p>Your order has been successfully cancelled within the permitted cancellation window.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <br/>
      <p>Thank you,</p>
      <p>The CraveCrush Team</p>
    `);

    // Notify admins
    const adminUsers = await User.find({ role: 'admin' });
    const adminEmails = adminUsers.map(a => a.email);
    if (adminEmails.length > 0) {
      await sendMail(adminEmails, "❌ Order Cancelled - CraveCrush", `
        <h2>An Order Has Been Cancelled</h2>
        <p><strong>Customer:</strong> ${order.user.name} (${order.user.email})</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p>This order was cancelled by the customer within the allowed timeframe.</p>
      `);
    }

    res.json({ message: 'Order cancelled and deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 GET USER ORDER HISTORY
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.item');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 ADMIN FUNCTIONS

// 🕓 GET ALL PENDING ORDERS (Admin)
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .populate('user')
      .populate('items.item');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ APPROVE ORDER (Admin)
exports.approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'approved';
    order.approvalTime = new Date();
    await order.save();

    const emailTo = order.user?.email || order.guestEmail;
    if (emailTo) {
      await sendMail(emailTo, "✅ CraveCrush - Order Approved", `
        <h2>Your Order Has Been Approved ✅</h2>
        <p>We're now preparing your delicious meal!</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p>Our rider will reach out to you once your food is ready for delivery.</p>
        <br/>
        <p>Thanks for choosing CraveCrush!</p>
      `);
    }

    res.json({ message: 'Order approved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ REJECT ORDER (Admin)
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const reason = req.body.reason || 'Unspecified';
    order.status = 'rejected';
    order.rejectionReason = reason;
    await order.save();

    const emailTo = order.user?.email || order.guestEmail;
    if (emailTo) {
      await sendMail(emailTo, "🚫 CraveCrush - Order Rejected", `
        <h2>Order Update</h2>
        <p>We regret to inform you that your order has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please feel free to place another order or contact our support if needed.</p>
        <br/>
        <p>Regards,</p>
        <p>The CraveCrush Team</p>
      `);
    }

    res.json({ message: 'Order rejected with reason' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};