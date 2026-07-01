const userModel = require("../models/UserModel");
const docModel = require("../models/DocModel");
const appointmentModel = require("../models/AppointmentModel");

const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users list fetched successfully",
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching users"
    });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching doctors"
    });
  }
};

const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "approved" },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found"
      });
    }
    const user = await userModel.findByIdAndUpdate(
      doctor.userID,
      { isdoctor: true },
      { new: true }
    );
    if (user) {
      user.notification.push({
        type: "doctor-account-approved",
        message: "Your doctor application has been approved!",
        onClickPath: "/doctor/profile"
      });
      await user.save();
    }
    res.status(200).send({
      success: true,
      message: "Doctor status updated to approved successfully",
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error approving doctor status"
    });
  }
};

const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "rejected" },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found"
      });
    }
    const user = await userModel.findById(doctor.userID);
    if (user) {
      user.notification.push({
        type: "doctor-account-rejected",
        message: "Your doctor application has been rejected.",
        onClickPath: "/apply-doctor"
      });
      await user.save();
    }
    res.status(200).send({
      success: true,
      message: "Doctor status updated to rejected successfully",
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error rejecting doctor status"
    });
  }
};

const displayAllAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
      .populate("doctorInfo")
      .populate("userInfo");
    res.status(200).send({
      success: true,
      message: "All appointments fetched successfully",
      data: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching appointments"
    });
  }
};

module.exports = {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController
};
