const axios = require("axios");
const { Developer, Certificate } = require("../model/developerSchema");
const getUserModel = require("../model/getUserModel");
const cloudinary = require("../api/cloudinary");
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
const fetchGithubRepoData = async (accessToken) => {
  try {
    const reposList = [];
    let page = 1;
    let pageRepos;

    do {
      const repoRes = await axios.get(
        `https://api.github.com/user/repos?per_page=100&sort=updated&page=${page}`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
            "User-Agent": "NodeApp",
          },
        }
      );
      pageRepos = Array.isArray(repoRes.data) ? repoRes.data : [];
      reposList.push(...pageRepos);
      page += 1;
    } while (pageRepos.length === 100);

    const repositories = reposList.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description provided.",
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      watchers_count: repo.watchers_count || 0,
      open_issues_count: repo.open_issues_count || 0,
      language: repo.language || "Plain Text",
      private: repo.private,
      updated_at: repo.updated_at,
      has_readme: repo.has_readme !== undefined ? repo.has_readme : true,
    }));
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
            ? parseFloat(((langMap[lang] / totalCount) * 120).toFixed(2))
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { repositories, topLanguages };
  } catch (error) {
    return { repositories: [], topLanguages: [] };
  }
};
const processGithubProfile = async (accessToken, profile, role = "developer") => {
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
    portfolioUrl:`user/portfolio/${profile.username}`,
    role,
  };
  let user = await Developer.findOne({ githubId: profile.id });

  if (user) {
    user = await Developer.findByIdAndUpdate(user._id, userData, { new: true });
  } else {
    user = await Developer.create(userData);
  }

  return user;
};
const githubCallback = async (req, res) => {
  try {
    const role = req.session?.signupRole || req.user?.role || "developer";

    if (req.user && req.user._id) {
      await Developer.findByIdAndUpdate(req.user._id, { role }, { new: true });
    }

    const frontendUri = process.env.FRONTEND_URI;
    const redirectPath =
      role === "client"
        ? "/client-dashboard"
        : role === "admin"
          ? "/admin-dashboard"
          : "/dashboard";

    res.redirect(`${frontendUri}${redirectPath}`);
  } catch (error) {
    res.status(500).json({ message: "Auth Redirect Failed", error: error.message });
  }
};
const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
  }
  try {
    const fullUser = await getUserModel(req.user.role).findById(req.user._id);
    res.status(200).json({
      success: true,
      user: fullUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user data" });
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
const deleteAccount = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
  }

  const userId = req.user._id;
  const UserModel = getUserModel(req.user.role);

  try {
    const [user, certificates] = await Promise.all([
      UserModel.findById(userId),
      Certificate.find({ userId }).select("publicId"),
    ]);

    const destroyAsset = async (publicId, options) => {
      try {
        await cloudinary.uploader.destroy(publicId, options);
      } catch (cloudError) {
        console.error(`Failed to destroy cloudinary asset ${publicId}:`, cloudError.message);
      }
    };

    await Promise.all([
      ...certificates.map((certificate) => destroyAsset(certificate.publicId)),
      ...(user?.cvPublicId ? [destroyAsset(user.cvPublicId, { resource_type: "raw" })] : []),
    ]);

    await Certificate.deleteMany({ userId });
    await UserModel.findByIdAndDelete(userId);
    req.logout((logoutErr) => {
      if (logoutErr) {
        return res.status(500).json({
          success: false,
          message: "Account deleted but logout failed, please clear cookies manually",
          error: logoutErr.message,
        });
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return res.status(500).json({
            success: false,
            message: "Account deleted but session could not be destroyed",
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
          message: "Account deleted successfully",
          redirectUrl: `${process.env.FRONTEND_URI}/Authorization`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};
module.exports = {
  processGithubProfile,
  githubCallback,
  getProfile,
  logout,
  deleteAccount
};