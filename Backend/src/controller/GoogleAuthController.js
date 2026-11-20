const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const User = require("../model/user");
const serviceAccount = require("../services/serviceAccountKey.json");

const firebaseApp =
  getApps()[0] ||
  initializeApp({
    credential: cert(serviceAccount),
  });

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (typeof idToken !== "string" || !idToken) {
    return res.status(400).json({
      success: false,
      message: "A Google sign-in ID token is required",
    });
  }

  let decodedToken;
  try {
    decodedToken = await getAuth(firebaseApp).verifyIdToken(idToken, true);
  } catch (error) {
    if (
      [
        "auth/argument-error",
        "auth/id-token-expired",
        "auth/invalid-id-token",
        "auth/id-token-revoked",
      ].includes(error.code)
    ) {
      return res.status(401).json({
        success: false,
        message: "Google sign-in token is invalid or expired",
      });
    }

    console.error("Google sign-in token verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not verify Google sign-in",
    });
  }

  const email = decodedToken.email;
  if (
    decodedToken.firebase?.sign_in_provider !== "google.com" ||
    !email ||
    decodedToken.email_verified !== true
  ) {
    return res.status(401).json({
      success: false,
      message: "A verified Google account is required",
    });
  }

  try {
    let user = await User.findOne({ googleId: decodedToken.uid });
    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      user.googleId = decodedToken.uid;
      user.email = email;
      user.name = decodedToken.name || user.name || email.split("@")[0];
      user.avatarUrl = decodedToken.picture || user.avatarUrl || "";
      await user.save();
    } else {
      user = await User.create({
        googleId: decodedToken.uid,
        username: decodedToken.name || email.split("@")[0],
        name: decodedToken.name || email.split("@")[0],
        email,
        avatarUrl: decodedToken.picture || "",
        role: "client",
      });
    }

    req.login(user, (error) => {
      if (error) {
        console.error("Google sign-in session creation failed:", error);
        return res.status(500).json({
          success: false,
          message: "Could not create a login session",
        });
      }

      return res.status(200).json({ success: true, user });
    });
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return res.status(500).json({
      success: false,
      message: "Google sign-in failed",
    });
  }
};

module.exports = { googleLogin };
