import { Router } from "express";
import passport from "passport";
const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.send("Google authentication successful");
  }
);

authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.send("Logged out successfully");
  });
});

authRouter.get("/current_user", (req, res) => {
  res.send(req.user);
});

export default authRouter;
