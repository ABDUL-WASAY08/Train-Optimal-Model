const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../model/user");
const { processGithubProfile } = require("../controller/AuthController");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);    // user is sved in req.user
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GIT_CLIENTID,
      clientSecret: process.env.GIT_CLIENTSEC,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Business logic outsourced to controller function
        const user = await processGithubProfile(accessToken, profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;