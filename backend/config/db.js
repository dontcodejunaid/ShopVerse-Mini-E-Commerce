const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE_PATH = path.join(__dirname, '../data/db.json');
const SEED_FILE_PATH = path.join(__dirname, '../data/seedProducts.json');

let isFallbackMode = false;
let localDb = { users: [], products: [], orders: [] };

// Helper to load local database from db.json
async function loadLocalDb() {
  try {
    const data = await fs.readFile(DB_FILE_PATH, 'utf8');
    localDb = JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, seed products and write a new file
    console.log('No local database file found. Seeding initial data...');
    let seedProducts = [];
    try {
      const seedData = await fs.readFile(SEED_FILE_PATH, 'utf8');
      seedProducts = JSON.parse(seedData);
      // Give each seeded product a unique id
      seedProducts = seedProducts.map((p, idx) => ({ _id: `prod_${idx + 1}`, ...p }));
    } catch (seedErr) {
      console.error('Failed to read seedProducts.json:', seedErr);
    }
    localDb = { users: [], products: seedProducts, orders: [] };
    await saveLocalDb();
  }
}

// Helper to save local database to db.json
async function saveLocalDb() {
  try {
    await fs.mkdir(path.dirname(DB_FILE_PATH), { recursive: true });
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local database file:', err);
  }
}

// Custom JSON Collection class mimicking basic Mongoose model queries
class JsonCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get items() {
    return localDb[this.collectionName] || [];
  }

  set items(newItems) {
    localDb[this.collectionName] = newItems;
  }

  async find(query = {}) {
    await loadLocalDb();
    let results = [...this.items];

    // Basic query matching
    for (const [key, value] of Object.entries(query)) {
      if (value && typeof value === 'object' && value.$regex) {
        const regex = new RegExp(value.$regex, value.$options || '');
        results = results.filter(item => regex.test(item[key]));
      } else if (value !== undefined) {
        results = results.filter(item => String(item[key]) === String(value));
      }
    }
    return results;
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id) {
    await loadLocalDb();
    return this.items.find(item => String(item._id) === String(id)) || null;
  }

  async create(data) {
    await loadLocalDb();
    const newItem = {
      _id: `${this.collectionName.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.items.push(newItem);
    await saveLocalDb();
    return newItem;
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}

// Mongoose connection setup
async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  console.log(`Attempting to connect to MongoDB at ${mongoUri}...`);

  try {
    // Attempt Mongoose connection with a short 3-second timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB successfully connected.');
    
    // Seed products if MongoDB collection is empty
    const Product = mongoose.model('Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('MongoDB database is empty. Seeding initial products...');
      try {
        const seedData = await fs.readFile(SEED_FILE_PATH, 'utf8');
        const seedProducts = JSON.parse(seedData);
        await Product.insertMany(seedProducts);
        console.log('Seeded products into MongoDB successfully.');
      } catch (err) {
        console.error('Failed to seed MongoDB:', err);
      }
    }
  } catch (err) {
    console.warn('\n⚠️  MongoDB connection failed! Falling back to Local JSON File Database.');
    console.warn(`Local DB path: ${DB_FILE_PATH}\n`);
    isFallbackMode = true;
    await loadLocalDb();
  }
}

module.exports = {
  connectDb,
  getIsFallbackMode: () => isFallbackMode,
  JsonCollection
};
