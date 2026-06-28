const express = require("express");
const {
  registerController,
  loginController,
  authController
} = require("../controllers/UserController");
const authMiddleware = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/getuserdata", authMiddleware, authController);

module.exports = router;
