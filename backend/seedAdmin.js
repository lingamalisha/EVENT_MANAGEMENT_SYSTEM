import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists:", adminExists.email);
      process.exit();
    }

    const admin = await User.create({
      name: "Evently Admin",
      email: "admin@evently.com",
      password: "adminpassword123",
      role: "admin",
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@evently.com");
    console.log("Password: adminpassword123");
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
