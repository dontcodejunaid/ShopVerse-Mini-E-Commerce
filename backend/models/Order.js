const mongoose = require('mongoose');
const { getIsFallbackMode, JsonCollection } = require('../config/db');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  shippingDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Completed' }
}, { timestamps: true });

const MongooseOrder = mongoose.model('Order', OrderSchema);
const JsonOrder = new JsonCollection('orders');

module.exports = {
  find: (query) => getIsFallbackMode() ? JsonOrder.find(query) : MongooseOrder.find(query),
  findOne: (query) => getIsFallbackMode() ? JsonOrder.findOne(query) : MongooseOrder.findOne(query),
  findById: (id) => getIsFallbackMode() ? JsonOrder.findById(id) : MongooseOrder.findById(id),
  create: (data) => getIsFallbackMode() ? JsonOrder.create(data) : MongooseOrder.create(data),
  countDocuments: (query) => getIsFallbackMode() ? JsonOrder.countDocuments(query) : MongooseOrder.countDocuments(query),
  MongooseOrder
};
