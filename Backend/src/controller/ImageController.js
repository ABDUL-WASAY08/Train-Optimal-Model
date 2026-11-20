const cloudinary = require("../api/cloudinary");
const Certificate = require("../model/userData");
const User = require("../model/user");
const uploadCertificate = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const { certificateName, companyName, role, description, issueDate } = req.body;

    if (!certificateName || !companyName) {
      return res.status(400).json({ success: false, message: "Certificate name and company name are required" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "fyp_certificates",
      resource_type: "image",
    });
    const certificate = await Certificate.create({
      userId: req.user._id,
      certificateUrl: result.secure_url,
      certificateName,
      companyName,
      role: role || "",
      description: description || "",
      issueDate: issueDate || "",
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload certificate",
      error: error.message,
    });
  }
};
const getCertificates = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const certificates = await Certificate.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message,
    });
  }
};
const deleteCertificate = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const { id } = req.params;
    const certificate = await Certificate.findOne({ _id: id, userId: req.user._id });
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    await cloudinary.uploader.destroy(certificate.publicId);
    await Certificate.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete certificate",
      error: error.message,
    });
  }
};
const uploadProjectImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "fyp_projects",
      resource_type: "image",
    });
    res.status(201).json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
const uploadCv = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No CV file provided" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "fyp_cvs",
      resource_type: "raw",
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cvUrl: result.secure_url, cvPublicId: result.public_id, cvName: req.file.originalname } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload CV",
      error: error.message,
    });
  }
};
const deleteCv = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.cvPublicId) {
      await cloudinary.uploader.destroy(user.cvPublicId, { resource_type: "raw" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cvUrl: null, cvPublicId: null, cvName: null } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "CV removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove CV",
      error: error.message,
    });
  }
};
const deleteImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: "No publicId provided" });
    }
    if (!String(publicId).startsWith("fyp_projects/")) {
      return res.status(403).json({ success: false, message: "Not allowed to remove this image" });
    }
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (error) {
      console.error("Failed to remove image from Cloudinary:", error.message);
    }
    res.status(200).json({
      success: true,
      message: "Image removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove image",
      error: error.message,
    });
  }
};
const updateCertificate = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login first" });
    }
    const { id } = req.params;
    const certificate = await Certificate.findOne({ _id: id, userId: req.user._id });
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    const { certificateName, companyName, role, description, issueDate } = req.body;
    const updateData = {};
    if (certificateName !== undefined) updateData.certificateName = certificateName;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (role !== undefined) updateData.role = role;
    if (description !== undefined) updateData.description = description;
    if (issueDate !== undefined) updateData.issueDate = issueDate;
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update certificate",
      error: error.message,
    });
  }
};
module.exports = {
  uploadCertificate,
  getCertificates,
  deleteCertificate,
  uploadProjectImage,
  uploadCv,
  deleteCv,
  deleteImage,
  updateCertificate,
};
