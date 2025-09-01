const cron = require('node-cron');
const Order = require('../models/Order');

// Deletes approved orders older than 1 hour
exports.startOrderCleanup = () => {
  cron.schedule('*/10 * * * *', async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const result = await Order.deleteMany({
      status: 'approved',
      approvalTime: { $lt: oneHourAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`${new Date()}: Deleted ${result.deletedCount} approved orders`);
    }
  });
};