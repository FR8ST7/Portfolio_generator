import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://portfoliouser:portfolioPass@127.0.0.1:27017/portfolioDB?authSource=portfolioDB";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
