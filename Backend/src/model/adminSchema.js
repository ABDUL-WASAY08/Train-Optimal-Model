const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    googleId: String,
    username: String,
    name: String,
    email: String,
    avatarUrl: String,
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    dob: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema, "admins");
