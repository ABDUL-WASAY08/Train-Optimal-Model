const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    username: String,
    name: String,
    email: String,
    avatarUrl: String,
    role: { type: String, enum: ["client"], default: "client", index: true },
    dob: { type: Date, default: null },
  },
  { timestamps: true }
);

const adminSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    username: String,
    name: String,
    email: String,
    avatarUrl: String,
    role: { type: String, enum: ["admin"], default: "admin", index: true },
    dob: { type: Date, default: null },
  },
  { timestamps: true }
);

const developerSchema = new mongoose.Schema(
  {
    githubId: { type: String, index: true },
    username: String,
    name: String,
    bio: String,
    email: String,
    avatarUrl: String,
    role: { type: String, enum: ["developer"], default: "developer", index: true },
    accessToken: String,
    topLanguages: Array,
    repositories: [
      {
        id: Number,
        name: String,
        description: String,
        html_url: String,
        stargazers_count: Number,
        forks_count: Number,
        watchers_count: Number,
        open_issues_count: Number,
        language: String,
        private: Boolean,
        updated_at: Date,
        has_readme: Boolean,
        subtitle: String,
        liveUrl: String,
        imageUrl: String,
        imagePublicId: String,
        topics: Array,
      },
    ],
    Filteredrepositories: [
      {
        id: Number,
        name: String,
        description: String,
        html_url: String,
        stargazers_count: Number,
        forks_count: Number,
        watchers_count: Number,
        open_issues_count: Number,
        language: String,
        private: Boolean,
        updated_at: Date,
        has_readme: Boolean,
        subtitle: String,
        liveUrl: String,
        imageUrl: String,
        imagePublicId: String,
        topics: Array,
      },
    ],
    skills: { type: [String], default: [] },
    education: { type: Array, default: [] },
    workExperience: { type: Array, default: [] },
    dob: { type: Date, default: null },
    githubUrl: String,
    linkedinUrl: String,
    twitterUrl: String,
    websiteUrl: String,
    portfolioUrl: String,
    cvUrl: String,
    cvPublicId: String,
    cvName: String,
    SetRepo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema, "client");
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admin");
const Developer =
  mongoose.models.Developer || mongoose.model("Developer", developerSchema, "developer");

const models = { client: Client, admin: Admin, developer: Developer };

const getUserModel = (role) => models[role] || Developer;

module.exports = { Client, Admin, Developer, getUserModel };
