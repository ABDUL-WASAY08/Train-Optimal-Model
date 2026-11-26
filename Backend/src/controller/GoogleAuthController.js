const Client = require("../model/clientSchema");
const Admin = require("../model/adminSchema");

const getModel = (role) => (role === "admin" ? Admin : Client);

const processGoogleProfile = async (profile, role) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    role === "admin" &&
    (!email || !adminEmail || email.trim().toLowerCase() !== adminEmail)
  ) {
    return null;
  }

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

  const Model = getModel(role);
  let user = await Model.findOne({ googleId: profile.id });

  if (user) {
    user = await Model.findByIdAndUpdate(user._id, userData, { new: true });
  } else {
    user = await Model.create(userData);
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

    const frontendUri = process.env.FRONTEND_URI;
    const redirectPath =
      role === "client"
        ? "/client-dashboard"
        : role === "admin"
          ? "/admin-dashboard"
          : "/dashboard";

    res.redirect(`${frontendUri}${redirectPath}`);
  } catch (error) {
    res.status(500).json({ message: "Google Auth Redirect Failed", error: error.message });
  }
};

module.exports = { processGoogleProfile, googleCallback };
