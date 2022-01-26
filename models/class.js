const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [32, "at max 32 characters in name"],
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  noOfStudents: {
    type: Number,
    default: 0,
  },
  standard: {
    type: String,
    required: true,
  },
  _teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

classSchema.methods.incrementStudent = function () {
  this.noOfStudents = this.noOfStudents + 1;
};
classSchema.methods.decrementStudent = function () {
  if (this.noOfStudents > 0) this.noOfStudents = this.noOfStudents - 1;
};

module.exports = mongoose.model("Class", classSchema);
