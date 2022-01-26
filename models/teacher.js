const mongoose = require("mongoose");
const validator = require("validator");

const teacherSchema = new mongoose.Schema({
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
  courseTeaches:[{
      _courseId:mongoose.Schema.ObjectId,
      // ref:'Course'
  }],
  _classId: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
