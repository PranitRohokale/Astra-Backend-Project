const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [32, "at max 32 characters in name"],
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Enter correct format email"],
  },
  password: {
    type: String,
    required: true,
  },
  standard: {
    type: String,
    required: true,
  },
  _classId: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
