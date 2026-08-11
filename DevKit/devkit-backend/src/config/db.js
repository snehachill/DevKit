const mongoose = require("mongoose");

// This connects us to MongoDB Atlas - our SOURCE OF TRUTH.
// Every link, click, and user record lives here permanently.
// Redis (see redis.js) is just a fast cache in front of this - it can be
// wiped or lost and we lose nothing important, because Mongo has it all.
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
