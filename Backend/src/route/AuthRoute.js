const express = require("express");
const passport = require("passport");
const {
  githubCallback,
  getProfile,
  logout,
} = require("../controller/AuthController");
const ensureAuthenticated = require("../middleware/isAuthenticate");

const router = express.Router();
router.get(
  "/github",
  (req, res, next) => {
    req.session.signupRole = req.query.role || "developer";
    next();
  },
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/Autorization?error=true" }),
  githubCallback
);
router.get("/me",ensureAuthenticated, getProfile);

router.post("/logout",ensureAuthenticated, logout);

module.exports = router;