const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    set: function(val) {
      if (typeof val !== "string") return val;
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: "user"
  },
  isdoctor: {
    type: Boolean,
    default: false
  },
  notification: {
    type: Array,
    default: []
  },
  seennotification: {
    type: Array,
    default: []
  }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
