const express = require("express");
const {
  uploadCertificate,
  getCertificates,
  deleteCertificate,
  uploadProjectImage,
  uploadCv,
  deleteCv,
  deleteImage,
  updateCertificate,
} = require("../controller/ImageController");
const ensureAuthenticated = require("../middleware/isAuthenticate");
const upload = require("../middleware/multer");
const { uploadDocument } = require("../middleware/multer");
const router = express.Router();
router.post("/upload", ensureAuthenticated, upload.single("image"), uploadCertificate);
router.post("/project-image", ensureAuthenticated, upload.single("image"), uploadProjectImage);
router.post("/cv", ensureAuthenticated, uploadDocument.single("cv"), uploadCv);
router.get("/", ensureAuthenticated, getCertificates);
router.delete("/cv", ensureAuthenticated, deleteCv);
router.delete("/image", ensureAuthenticated, deleteImage);
router.put("/certificate/:id", ensureAuthenticated, updateCertificate);
router.delete("/:id", ensureAuthenticated, deleteCertificate);
module.exports = router;
