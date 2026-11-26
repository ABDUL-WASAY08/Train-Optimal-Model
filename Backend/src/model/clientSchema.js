const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    googleId: String,
    username: String,
    name: String,
    email: String,
    avatarUrl: String,
    role: {
      type: String,
      enum: ["client"],
      default: "client",
    },
    dob: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema, "clients");
