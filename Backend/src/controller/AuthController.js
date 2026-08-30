const axios = require("axios");
const User = require("../model/user");

// Private Helper: Email Fetching Logic
const fetchPrivateEmail = async (accessToken) => {
  try {
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
        "User-Agent": "NodeApp",
      },
    });
    const primaryEmail = emailRes.data.find((e) => e.primary);
    return primaryEmail ? primaryEmail.email : null;
  } catch (error) {
    return null;
  }
};

// Private Helper: Fetch User Repositories & Top Languages
const fetchGithubRepoData = async (accessToken) => {
  try {
    const repoRes = await axios.get(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `token ${accessToken}`,
          "User-Agent": "NodeApp",
        },
      }
    );

    const reposList = Array.isArray(repoRes.data) ? repoRes.data : [];

    // Extract Repositories Array for Frontend
    const repositories = reposList.map((repo) => ({
      name: repo.name,
      description: repo.description || "No description provided.",
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count || 0,
      language: repo.language || "Plain Text",
      has_readme: repo.has_readme !== undefined ? repo.has_readme : true,
    }));

    // Calculate Top Languages Share
    const langMap = {};
    let totalCount = 0;

    reposList.forEach((repo) => {
      if (repo && repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        totalCount += 1;
      }
    });

    const topLanguages = Object.keys(langMap)
      .map((lang) => ({
        language: lang,
        count: langMap[lang],
        percentage:
          totalCount > 0
            ? parseFloat(((langMap[lang] / totalCount) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { repositories, topLanguages };
  } catch (error) {
    return { repositories: [], topLanguages: [] };
  }
};

// 1. Process GitHub Profile
const processGithubProfile = async (accessToken, profile) => {
  let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  if (!email) {
    email = await fetchPrivateEmail(accessToken);
  }

  const { repositories, topLanguages } = await fetchGithubRepoData(accessToken);

  const userData = {
    githubId: profile.id,
    username: profile.username,
    name: profile.displayName || profile.username,
    bio: profile._json.bio || "No bio available",
    email: email,
    avatarUrl: profile._json.avatar_url || "",
    topLanguages: topLanguages,
    repositories: repositories,
    accessToken: accessToken,
    githubUrl: profile.profileUrl || `https://github.com/${profile.username}`,
    twitterUrl: profile._json.twitter_username
      ? `https://twitter.com/${profile._json.twitter_username}`
      : "",
    websiteUrl: profile._json.blog || "",
  };

  let user = await User.findOne({ githubId: profile.id });

  if (user) {
    user = await User.findByIdAndUpdate(user._id, userData, { new: true });
  } else {
    user = await User.create(userData);
  }

  return user;
};

// 2. Redirect Handler
const githubCallback = (req, res) => {
  try {
    const frontendUri = process.env.FRONTEND_URI || "http://localhost:5173";
    res.redirect(frontendUri);
  } catch (error) {
    res.status(500).json({ message: "Auth Redirect Failed", error: error.message });
  }
};

// 3. Get Full Profile Handler
const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
  }

  try {
    const fullUser = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: fullUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
};

// 4. Update DOB
const updateDob = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { dob } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { dob },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update DOB" });
  }
};

// 5. Update Skills List
const updateSkills = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { skills } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update skills" });
  }
};
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Logout action failed", 
        error: err.message 
      });
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({
          success: false,
          message: "Could not destroy session",
          error: sessionErr.message,
        });
      }
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Successfully logged out",
      });
    });
  });
};
module.exports = {
  processGithubProfile,
  githubCallback,
  getProfile,
  updateDob,
  updateSkills,
  logout
};