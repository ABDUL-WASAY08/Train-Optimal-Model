const { Developer, Certificate } = require("../model/developerSchema");
const getUserModel = require("../model/getUserModel");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const GetPublicPortfolio = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await Developer.findOne({
            username: { $regex: new RegExp(`^${escapeRegex(username)}$`, "i") }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found",
            });
        }
        const certificates = await Certificate.find({ userId: user._id })
            .select("-publicId -__v")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Portfolio fetched successfully",
            data: {
                ...user.toObject(),
                accessToken: undefined,
                githubId: undefined,
                cvPublicId: undefined,
                certificates,
            },
        });
    } catch (error) {
        console.error("Error fetching public portfolio:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch portfolio",
            error: error.message, 
        });
    }
};
const GetportfolioUrl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const userId = req.user._id;
    const user = await getUserModel(req.user.role).findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const portfolioURL = user.username
      ? `user/portfolio/${user.username}`
      : user.portfolioUrl;
    res.status(200).json({
      status: true,
      message: "url Copied sussessfully",
      data: portfolioURL,
    });
  } catch (error) {
    return res.status(401).json({
        success: false,
        message: "User not found",
      });
  }
};
module.exports = {GetPublicPortfolio,GetportfolioUrl};
