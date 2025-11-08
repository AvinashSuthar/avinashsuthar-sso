import express from "express";
import { AUTH_CODES } from "../services/passport";
const tokenRouter = express.Router();
import jwt from "jsonwebtoken";

tokenRouter.post("/", (req, res) => {
  const { code, client_id, client_secret, redirect_uri, grant_type } = req.body;
  console.log("toknen");
  //   // 1️⃣ Verify grant type
  //   if (grant_type !== "authorization_code") {
  //     return res.status(400).send("Unsupported grant type");
  //   }

  // 2️⃣ Check if code exists and valid
  const storedCode = AUTH_CODES.get(code);
  if (!storedCode) {
    return res.status(400).send("Invalid or expired code");
  }

  if (storedCode.expiresAt < Date.now()) {
    AUTH_CODES.delete(code);
    return res.status(400).send("Code expired");
  }

  // 3️⃣ Check client match
  if (storedCode.client_id !== client_id) {
    return res.status(400).send("Invalid client");
  }

  // 4️⃣ Issue JWT tokens
  const user = storedCode.user;
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const idToken = jwt.sign(
    { sub: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // Delete the code after use
  AUTH_CODES.delete(code);

  // 5️⃣ Return tokens
  res.json({
    access_token: accessToken,
    id_token: idToken,
    token_type: "Bearer",
    expires_in: 900,
  });
});

export default tokenRouter;
