const User = require("../model/user");

const updateAccountDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }

    const { skills, education, workExperience, dob, selectedRepositories, isSetupCompleted } = req.body;

    const updateData = {};
    if (skills !== undefined) updateData.skills = skills;
    if (education !== undefined) updateData.education = education;
    if (workExperience !== undefined) updateData.workExperience = workExperience;
    if (dob !== undefined) updateData.dob = dob ? new Date(dob) : null;
    if (selectedRepositories !== undefined) updateData.selectedRepositories = selectedRepositories;
    if (isSetupCompleted !== undefined) updateData.isSetupCompleted = isSetupCompleted;

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
      { dob: dob ? new Date(dob) : null },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update DOB" });
  }
};

module.exports = {
  updateAccountDetails,
  updateDob,
};