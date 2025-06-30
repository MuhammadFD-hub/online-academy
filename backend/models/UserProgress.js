const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  readLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
