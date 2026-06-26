const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController
} = require("../controllers/DoctorController");
const authMiddleware = require("../middlewares/AuthMiddleware");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/updateprofile", authMiddleware, updateDoctorProfileController);
router.get("/getdoctorappointments", authMiddleware, getAllDoctorAppointmentsController);
router.post("/handlestatus", authMiddleware, handleStatusController);
router.get("/getdocumentdownload", authMiddleware, documentDownloadController);

module.exports = router;
