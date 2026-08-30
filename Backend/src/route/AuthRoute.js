const express = require("express");
const passport = require("passport");
const {
  githubCallback,
  getProfile,
  updateDob,
  updateSkills,
} = require("../controller/AuthController");

const router = express.Router();

// Initiate GitHub Login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);

// GitHub Callback Route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/Autorization?error=true" }),
  githubCallback
);

// Get Full Profile Route
router.get("/me", getProfile);

// Dynamic Profile Update Routes
router.put("/update-dob", updateDob);
router.put("/update-skills", updateSkills);

module.exports = router;