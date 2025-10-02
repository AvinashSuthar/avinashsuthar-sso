import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import dotenv from "dotenv";
import router from "./services/passport";
import authRouter from "./routes/authRoutes";

dotenv.config();

const app = express();

// DB connect
mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("MongoDB connected ✅");
});

// middleware
app.use(
  session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", router);

app.get("/", (req, res) => {
  res.send("Home Page 🚀 <a href='/auth/google'>Login with Google</a>");
});

// server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
