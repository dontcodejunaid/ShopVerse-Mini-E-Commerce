const mongoose = require('mongoose');
const { getIsFallbackMode, JsonCollection } = require('../config/db');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const MongooseUser = mongoose.model('User', UserSchema);
const JsonUser = new JsonCollection('users');

module.exports = {
  find: (query) => getIsFallbackMode() ? JsonUser.find(query) : MongooseUser.find(query),
  findOne: (query) => getIsFallbackMode() ? JsonUser.findOne(query) : MongooseUser.findOne(query),
  findById: (id) => getIsFallbackMode() ? JsonUser.findById(id) : MongooseUser.findById(id),
  create: (data) => getIsFallbackMode() ? JsonUser.create(data) : MongooseUser.create(data),
  countDocuments: (query) => getIsFallbackMode() ? JsonUser.countDocuments(query) : MongooseUser.countDocuments(query),
  MongooseUser
};
