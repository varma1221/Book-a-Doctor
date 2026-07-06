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
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY || "medicare_default_secret_key_123", { expiresIn: "1d" });
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

const docController = async (req, res) => {
  try {
    const newDoctor = new docModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ type: "admin" });
    if (adminUser) {
      adminUser.notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.fullName} has applied for a doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.fullName,
          onClickPath: "/admin/doctors"
        }
      });
      await adminUser.save();
    }
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor"
    });
  }
};

const getallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error
    });
  }
};

const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List Fetched Successfully",
      data: doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctors"
    });
  }
};

const appointmentController = async (req, res) => {
  try {
    let userInfoVal = req.body.userInfo;
    let doctorInfoVal = req.body.doctorInfo;
    if (typeof userInfoVal === "string") {
      userInfoVal = JSON.parse(userInfoVal);
    }
    if (typeof doctorInfoVal === "string") {
      doctorInfoVal = JSON.parse(doctorInfoVal);
    }
    const newAppointment = new appointmentModel({
      doctorInfo: doctorInfoVal._id || doctorInfoVal,
      userInfo: userInfoVal._id || userInfoVal,
      date: req.body.date,
      status: "pending",
      document: req.file ? { path: req.file.path } : undefined
    });
    await newAppointment.save();
    const doctor = await docModel.findById(newAppointment.doctorInfo);
    if (doctor) {
      const docUser = await userModel.findById(doctor.userID);
      if (docUser) {
        docUser.notification.push({
          type: "New-appointment-request",
          message: `A new appointment request from ${userInfoVal.fullName || "patient"}`,
          onClickPath: "/doctor/appointments"
        });
        await docUser.save();
      }
    }
    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment"
    });
  }
};

const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userInfo: req.body.userId })
      .populate("doctorInfo");
    const mappedAppointments = appointments.map(app => {
      const docName = app.doctorInfo ? app.doctorInfo.fullName : "Unknown Doctor";
      return {
        ...app.toObject(),
        docName
      };
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetched Successfully",
      data: mappedAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments"
    });
  }
};

const getDocsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userInfo: req.body.userId,
      "document.path": { $exists: true, $ne: null }
    }).populate("doctorInfo");
    const docs = appointments.map(app => ({
      appointmentId: app._id,
      doctorName: app.doctorInfo ? app.doctorInfo.fullName : "Unknown Doctor",
      date: app.date,
      documentPath: app.document.path
    }));
    res.status(200).send({
      success: true,
      message: "Documents fetched successfully",
      data: docs
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching user documents"
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController
};
