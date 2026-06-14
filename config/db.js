const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB... Target: ${connUri}`);
    
    // Mongoose connection setup
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5004, // Timeout after 5 seconds instead of 30 seconds
    });

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend server running without MongoDB database connection (fallback mode active).');
  }
};

module.exports = connectDB;
