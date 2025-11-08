import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/userModel";
import { Client, CLIENTS } from "../types/clients";
import crypto from "crypto";
dotenv.config();

const router = express.Router();
export const AUTH_CODES = new Map<
  string,
  { user: any; client_id: string; scope: string; expiresAt: number }
  >();
const STATE_STORE = new Map<string, string>();
// ===== User Schema (MongoDB) =====

// ===== Passport Config =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = new UserModel({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            picture: profile.photos?.[0]?.value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);



// serialize & deserialize
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ===== Routes =====

// router.get("/", (req, res) => {
//   const { client_id, redirect_uri, response_type, scope } = req.query;
//   console.log(client_id, redirect_uri, response_type, scope);
//   if (!CLIENTS.has(client_id as string)) {
//     return res.status(400).send("Invalid Client ID");
//   }
//   const client = CLIENTS.get(client_id as string) as Client;
//   if(client.redirectUris.includes(redirect_uri as string)){
//     // Proceed with OAuth flow
//   } else {
//     return res.status(400).send("Invalid Redirect URI");
//   }
//   if (!req.user) {
//     return res.redirect("/auth/google");
//   }
//   return res.send(req.user);
// });

router.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, response_type, scope } = req.query;

  // 1️⃣ Validate client
  if (!CLIENTS.has(client_id as string)) {
    return res.status(400).send("Invalid Client ID");
  }

  const client = CLIENTS.get(client_id as string)!;
  if (!client.redirectUris.includes(redirect_uri as string)) {
    return res.status(400).send("Invalid Redirect URI");
  }

  if (!req.user) {
    const state = crypto.randomBytes(16).toString("hex");
    const returnTo = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // store mapping (in memory/redis/db)
    STATE_STORE.set(state, returnTo);

    // construct Google auth URL with state
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set(
      "redirect_uri",
      `${process.env.BASE_URL}/auth/google/callback`
    );
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid profile email");
    googleAuthUrl.searchParams.set("state", state);

    return res.redirect(googleAuthUrl.toString());
  }

  // 3️⃣ Generate Authorization Code

  const code = crypto.randomBytes(20).toString("hex");

  AUTH_CODES.set(code, {
    user: req.user,
    client_id: client_id as string,
    scope: scope as string,
    expiresAt: Date.now() + 60 * 1000, // 1 minute
  });
  console.log("user " + req.user);
  // 4️⃣ Redirect back to client with code
  const redirectUrl = new URL(redirect_uri as string);
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", "xyz123");
  console.log(redirectUrl);
  console.log("code " + code);
  return res.redirect(redirectUrl.toString());
});


// start google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/data", async (req, res) => {
  await UserModel.find().then((users) => res.json(users));
});

router.get("/current-user", async (req, res) => {
  res.status(200).json({ user: req.user });
});

// callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Google will return ?code=...&state=...
    const state = (req.query.state as string) || (req.body && req.body.state);
    const returnTo = STATE_STORE.get(state);
    // IMPORTANT: remove state after use
    STATE_STORE.delete(state);

    if (returnTo) {
      return res.redirect(returnTo);
    }
    // fallback
    res.redirect("/");
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
