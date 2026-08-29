const express = require("express");
const passport = require("passport");
const { githubCallback, getProfile } = require("../controller/AuthController");
const router = express.Router();


// 1. GitHub Auth Initiate Route
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);

// 2. GitHub Callback Route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/login?error=true" }),
  githubCallback
);

// 3. Current Authenticated User Route
router.get("/me", getProfile);

module.exports = router;