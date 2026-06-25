const mongoose = require('mongoose');
const { getIsFallbackMode, JsonCollection } = require('../config/db');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  specifications: { type: Map, of: String }
}, { timestamps: true });

const MongooseProduct = mongoose.model('Product', ProductSchema);
const JsonProduct = new JsonCollection('products');

module.exports = {
  find: (query) => getIsFallbackMode() ? JsonProduct.find(query) : MongooseProduct.find(query),
  findOne: (query) => getIsFallbackMode() ? JsonProduct.findOne(query) : MongooseProduct.findOne(query),
  findById: (id) => getIsFallbackMode() ? JsonProduct.findById(id) : MongooseProduct.findById(id),
  create: (data) => getIsFallbackMode() ? JsonProduct.create(data) : MongooseProduct.create(data),
  countDocuments: (query) => getIsFallbackMode() ? JsonProduct.countDocuments(query) : MongooseProduct.countDocuments(query),
  MongooseProduct
};
