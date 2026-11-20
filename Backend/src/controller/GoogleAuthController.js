const { getUserModel } = require("../model/user");

const processGoogleProfile = async (profile, role) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!["client", "admin"].includes(role)) {
    return null;
  }

  if (
    role === "admin" &&
    (!email || !adminEmail || email.trim().toLowerCase() !== adminEmail)
  ) {
    return null;
  }

  const UserModel = getUserModel(role);
  const name =
    profile.displayName ||
    profile.username ||
    (email ? email.split("@")[0] : "Google User");

  const userData = {
    googleId: profile.id,
    username: name,
    name,
    email,
    avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
    role,
  };
  
  let user = await UserModel.findOne({ googleId: profile.id });

  if (user) {
    user = await UserModel.findByIdAndUpdate(user._id, userData, { new: true });
  } else {
    user = await UserModel.create(userData);
  }

  return user;
};

const googleCallback = async (req, res) => {
  try {
    const role = req.session?.signupRole;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      role === "admin" &&
      (!req.user?.email ||
        !adminEmail ||
        req.user.email.trim().toLowerCase() !== adminEmail)
    ) {
      return res.redirect(`${process.env.FRONTEND_URI}/Authorization?error=admin`);
    }

    if (req.user && req.user._id) {
      const UserModel = getUserModel(role);
      await UserModel.findByIdAndUpdate(req.user._id, { role }, { new: true });
    }

    const frontendUri = process.env.FRONTEND_URI;
    const redirectPath =
      role === "admin" ? "/admin-dashboard" : "/client-dashboard";

    res.redirect(`${frontendUri}${redirectPath}`);
  } catch (error) {
    res.status(500).json({ message: "Google Auth Redirect Failed", error: error.message });
  }
};

module.exports = { processGoogleProfile, googleCallback };
