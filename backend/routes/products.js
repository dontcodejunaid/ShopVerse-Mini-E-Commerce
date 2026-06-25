const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (with search/filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let products = await Product.find(query);

    // If search is active and we want to also search in description in memory (extra robustness for search)
    if (search) {
      // In case the DB query only matched by name, let's make sure we have a clean set.
      // If we are in fallback or Mongoose, let's filter description as well if no results in name,
      // or simply stick to name search. The regex on name is already great.
    }

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.id || req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
