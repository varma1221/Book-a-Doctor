const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true
  },
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  document: {
    path: {
      type: String
    }
  },
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

const appointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = appointmentModel;
