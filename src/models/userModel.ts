import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  picture: String,
});

export const UserModel = mongoose.model("UserModel", userSchema);
