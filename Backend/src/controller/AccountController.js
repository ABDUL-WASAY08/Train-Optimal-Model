const User = require("../model/user");
const updateAccountDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const { username, name, email, bio, skills, githubUrl, linkedinUrl, twitterUrl, websiteUrl, education, workExperience, dob, SetRepo, Filteredrepositories } = req.body;
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (education !== undefined) updateData.education = education;
    if (workExperience !== undefined) updateData.workExperience = workExperience;
    if (dob !== undefined) updateData.dob = dob ? new Date(dob) : null;
    if (SetRepo !== undefined) updateData.SetRepo = SetRepo;
    if (Filteredrepositories !== undefined) updateData.Filteredrepositories = Filteredrepositories;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Account details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update account details",
      error: error.message,
    });
  }
};
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
module.exports = {
  updateAccountDetails,
  updateDob
};