const userModel = require("../models/UserModel");
const docModel = require("../models/DocModel");
const appointmentModel = require("../models/AppointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).send({ message: "Login Success", success: true, token, data: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}`, success: false });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).send({ success: true, data: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Auth error", success: false, error });
  }
};

module.exports = {
  registerController,
  loginController,
  authController
};
