const docModel = require("../models/DocModel");
const appointmentModel = require("../models/AppointmentModel");
const userModel = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await docModel.findOneAndUpdate(
      { userID: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Doctor Profile Updated Successfully",
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Updating Doctor Profile"
    });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docModel.findOne({ userID: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found"
      });
    }
    const appointments = await appointmentModel.find({ doctorInfo: doctor._id })
      .populate("userInfo");
    res.status(200).send({
      success: true,
      message: "Doctor Appointments Fetched Successfully",
      data: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Fetching Doctor Appointments"
    });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found"
      });
    }
    const user = await userModel.findById(appointment.userInfo);
    if (user) {
      user.notification.push({
        type: "appointment-status-updated",
        message: `Your appointment request status has been updated to: ${status}`,
        onClickPath: "/appointments"
      });
      await user.save();
    }
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated Successfully",
      data: appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error updating appointment status"
    });
  }
};

const documentDownloadController = async (req, res) => {
  try {
    const { appointId } = req.query;
    const appointment = await appointmentModel.findById(appointId);
    if (!appointment || !appointment.document || !appointment.document.path) {
      return res.status(404).send({
        success: false,
        message: "Document not found or unavailable"
      });
    }
    const filePath = path.resolve(appointment.document.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({
        success: false,
        message: "File does not exist on server"
      });
    }
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error downloading file"
    });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController
};
