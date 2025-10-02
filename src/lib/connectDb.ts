import mongoose from "mongoose";

export const connectDb = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/auth";
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
