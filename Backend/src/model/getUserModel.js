const { Developer } = require("./developerSchema");
const Client = require("./clientSchema");
const Admin = require("./adminSchema");

const getUserModel = (role) => {
  if (role === "client") return Client;
  if (role === "admin") return Admin;
  return Developer;
};

module.exports = getUserModel;
