const express = require("express");
const { updateAccountDetails, updateDob } = require("../controller/AccountController");
const isAuthenticate = require("../middleware/isAuthenticate");

const router = express.Router();

router.put("/update", isAuthenticate, updateAccountDetails);
router.put("/update-dob", isAuthenticate, updateDob);
module.exports = router;