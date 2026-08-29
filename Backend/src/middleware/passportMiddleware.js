const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");
const User = require("../model/user");

//centeralize

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
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
        // A. Private Email Handle Karna
        let email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          const emailRes = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
                "User-Agent": "NodeApp",
              },
            },
          );
          const primaryEmail = emailRes.data.find((e) => e.primary);
          email = primaryEmail ? primaryEmail.email : null;
        }

        // B. Repositories fetch karke Language Frequency aur Percentage (Intensity) Calculate Karna
        const repoRes = await axios.get(
          "https://api.github.com/user/repos?per_page=100",
          {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "NodeApp",
            },
          },
        );

        const reposList = Array.isArray(repoRes.data) ? repoRes.data : [];
        const langMap = {};
        let totalCount = 0;

        // Har repository ki primary language count karein
        reposList.forEach((repo) => {
          if (repo && repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            totalCount += 1;
          }
        });

        // Intensity (Percentage) calculate karein
        const topLanguages = Object.keys(langMap)
          .map((lang) => ({
            language: lang,
            count: langMap[lang],
            percentage:
              totalCount > 0
                ? parseFloat(((langMap[lang] / totalCount) * 100).toFixed(2))
                : 0,
          }))
          .sort((a, b) => b.count - a.count); // High percentage se low sort karein

        // C. Mongoose MongoDB Mein Save ya Update (Upsert)
        let user = await User.findOne({ githubId: profile.id });

        const userData = {
          githubId: profile.id,
          username: profile.username,
          name: profile.displayName || profile.username,
          bio: profile._json.bio || "No bio available",
          email: email,
          topLanguages: topLanguages, // Array of objects containing intensity/percentage
          accessToken: accessToken,
        };

        if (user) {
          user = await User.findByIdAndUpdate(user._id, userData, {
            new: true,
          });
        } else {
          user = await User.create(userData);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
