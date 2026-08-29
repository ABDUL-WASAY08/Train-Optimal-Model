// GitHub Callback Handler (Successful Login ke baad Frontend par Redirect)
const githubCallback = (req, res) => {
  try {
       const frontenduri=process.env.FRONTEND_URI
    res.redirect(frontenduri);
  } catch (error) {
    res.status(500).json({ message: "Auth Redirect Failed", error: error.message });
  }
};

// Logged-in User Profile Endpoint Handler
const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
module.exports= {githubCallback,getProfile}