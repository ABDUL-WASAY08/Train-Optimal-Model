const mongoose = require("mongoose");
const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  certificateUrl: {
    type: String,
    required: true,
  },
  certificateName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  issueDate: {
    type: String,
    default: "",
  },
  publicId: {
    type: String,
    required: true,
  },
}, { timestamps: true });
module.exports = mongoose.model("Certificate", certificateSchema);
