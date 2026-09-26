const express = require("express");
const { uploadCertificate, getCertificates, deleteCertificate } = require("../controller/ImageController");
const ensureAuthenticated = require("../middleware/isAuthenticate");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/upload", ensureAuthenticated, upload.single("image"), uploadCertificate);
router.get("/", ensureAuthenticated, getCertificates);
router.delete("/:id", ensureAuthenticated, deleteCertificate);

module.exports = router;
