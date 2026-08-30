const express = require("express");
const passport = require("passport");
const {
  githubCallback,
  getProfile,
  updateDob,
  updateSkills,
  logout,
} = require("../controller/AuthController");

const router = express.Router();
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/Autorization?error=true" }),
  githubCallback
);
router.get("/me", getProfile);

router.put("/update-dob", updateDob);
router.put("/update-skills", updateSkills);
router.post("/logout", logout);

module.exports = router;