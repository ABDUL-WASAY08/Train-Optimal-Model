const express = require("express");
const { updateAccountDetails, updateDob } = require("../controller/AccountController");

const router = express.Router();

// Single PUT endpoint for all profile updates
router.put("/update", updateAccountDetails);
router.put("/update-dob", updateDob);
module.exports = router;