const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  order: { type: Number, required: true },
});
lessonSchema.index({ course: 1, order: 1 });
module.exports = mongoose.model("Lesson", lessonSchema);
