import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error("👉 Please ensure MongoDB is running on your machine.");
    console.error("💻 Check your `.env` file and make sure the MongoDB service is started.");
    process.exit(1);
  }
};

export default connectDB;