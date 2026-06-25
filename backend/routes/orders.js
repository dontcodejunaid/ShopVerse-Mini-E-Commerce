const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order (Checkout)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { items, shippingDetails, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.zipCode) {
    return res.status(400).json({ message: 'Please provide all shipping details' });
  }

  try {
    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      shippingDetails,
      totalAmount,
      status: 'Completed' // Pre-completed since no payment is required
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders
// @desc    Get logged in user's order history
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all orders for the current user, sorted by newest first
    const orders = await Order.find({ userId: req.user.id });
    
    // Sort in code if in fallback mode (or mongoose doesn't have sort chained here)
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(sortedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
