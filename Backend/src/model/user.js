const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  bio: { type: String },
  topLanguages: [
    {
      language: { type: String },
      count: { type: Number },
      percentage: { type: Number }, 
    },
  ],
  accessToken: { type: String }, // Access token for API calls
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
