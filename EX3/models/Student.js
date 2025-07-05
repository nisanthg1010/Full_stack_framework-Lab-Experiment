const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  roll: String,
  email: String,
  contact: String,
  college: String,
  degree: String,
  photo: String,
  theoryMarks: [Number],
  labMarks: [Number],
  gpa: Number,
  cgpa: Number
});

module.exports = mongoose.model('Student', studentSchema);
