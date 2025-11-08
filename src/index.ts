import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import dotenv from "dotenv";
import router from "./services/passport";
import { connectDb } from "./lib/connectDb";
import tokenRouter from "./routes/tokenRoutes";
import cors from "cors";
dotenv.config();

const app = express();

connectDb();
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" }, // secure:true breaks localhost http
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", router);

app.use("/token", tokenRouter);

app.get("/", (req, res) => {
  res.send("Home Page 🚀 <a href='/auth/google'>Login with Google</a>");
});

// server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
