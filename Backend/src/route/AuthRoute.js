const express = require("express");
const passport = require("passport");
const {githubCallback,getProfile,logout,deleteAccount,} = require("../controller/AuthController");
const { googleCallback } = require("../controller/GoogleAuthController");
const ensureAuthenticated = require("../middleware/isAuthenticate");
const router = express.Router();


// for githib 
router.get(
  "/github",
  (req, res, next) => {
    req.session.signupRole = req.query.role;
    next();
  },
  passport.authenticate("github", { scope: ["user:email", "read:user", "repo"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http://localhost:5173/Authorization?error=true" }),
  githubCallback
);

// for google 

router.get(
  "/google",
  (req, res, next) => {
    const role = req.query.role;
    if (!["developer", "client", "admin"].includes(role)) {
      return res.redirect(`${process.env.FRONTEND_URI}/Authorization?error=role`);
    }
    req.session.signupRole = role;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/Authorization?error=true" }),
  googleCallback
);
router.get("/me",ensureAuthenticated, getProfile);
router.post("/logout",ensureAuthenticated, logout);
router.delete("/delete-account",ensureAuthenticated, deleteAccount);
module.exports = router;