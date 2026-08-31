const express = require("express");
const passport = require("passport");
const {
  githubCallback,
  getProfile,
  logout,
} = require("../controller/AuthController");

const router = express.Router();
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/Authorization?error=true" }),
  githubCallback
);
router.get("/me", getProfile);

router.post("/logout", logout);

module.exports = router;