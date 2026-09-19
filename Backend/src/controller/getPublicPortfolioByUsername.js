const User = require("../model/user");

const GetPublicPortfolio = async (req, res) => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, "i") } 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Portfolio fetched successfully",
            data: user,
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
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const portfolioURL = user.portfolioUrl;
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