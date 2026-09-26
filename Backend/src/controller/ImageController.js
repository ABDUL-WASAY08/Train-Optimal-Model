const cloudinary = require("../api/cloudinary");
const Certificate = require("../model/userData");

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

module.exports = { uploadCertificate, getCertificates, deleteCertificate };
