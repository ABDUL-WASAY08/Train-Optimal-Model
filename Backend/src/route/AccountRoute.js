const express = require("express");
const { updateAccountDetails, updateDob } = require("../controller/AccountController");
const ensureAuthenticated = require("../middleware/isAuthenticate");
const router = express.Router();
router.put("/update",ensureAuthenticated, updateAccountDetails);
router.put("/update-dob",ensureAuthenticated, updateDob);
module.exports = router;