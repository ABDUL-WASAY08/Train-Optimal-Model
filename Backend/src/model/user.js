const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: String,
    username: String,
    name: String,
    bio: String,
    email: String,
    avatarUrl: String,
    role: {
      type: String,
      enum: ["developer", "client", "admin"],
      default: "developer",
    },
    accessToken: String,
    topLanguages: Array,
    repositories: [
      {
        name: String,
        description: String,
        html_url: String,
        stargazers_count: Number,
        language: String,
        has_readme: Boolean,
      },
    ],
    Filteredrepositories: [
      {
        name: String,
        description: String,
        html_url: String,
        stargazers_count: Number,
        language: String,
        has_readme: Boolean,
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: Array,
      default: [],
    },
    workExperience: {
      type: Array,
      default: [],
    },
    dob: {
      type: Date,
      default: null,
    },
    githubUrl: String,
    twitterUrl: String,
    websiteUrl: String,
    portfolioUrl: String,
    SetRepo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
