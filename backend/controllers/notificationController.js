const Notification = require('../models/Notification');
const Product = require('../models/Product');

exports.getNotifications = async (req, res) => {
  try {
    // 1. Sync Low Stock Alerts dynamically:
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", { $ifNull: ["$quantityAlert", 10] }] }
    });

    for (const prod of lowStockProducts) {
      // Check if low stock notification already exists for this product
      const exists = await Notification.findOne({
        type: 'LOW_STOCK',
        productId: prod._id,
        isRead: false
      });

      if (!exists) {
        await Notification.create({
          type: 'LOW_STOCK',
          title: 'Low Stock Alert',
          message: `Low Stock: ${prod.name} (${prod.quantity} left)`,
          productId: prod._id
        });
      }
    }

    // 2. Automatically clear/remove LOW_STOCK alerts for products that are replenished
    const healthyProducts = await Product.find({
      $expr: { $gt: ["$quantity", { $ifNull: ["$quantityAlert", 10] }] }
    });
    const healthyProductIds = healthyProducts.map(p => p._id);
    if (healthyProductIds.length > 0) {
      await Notification.deleteMany({
        type: 'LOW_STOCK',
        productId: { $in: healthyProductIds }
      });
    }

    // 3. Retrieve notifications from DB
    const notifications = await Notification.find()
      .populate('productId', 'name quantity')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
