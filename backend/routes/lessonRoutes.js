const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const UserProgress = require("../models/UserProgress");
const authenticateToken = require("../middleware/authToken");

router.get("/:lessonId", authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    const lesson = await Lesson.findById(lessonId).populate("course");
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    let isRead = false;

    if (userId) {
      const progress = await UserProgress.findOne({
        user: userId,
        course: lesson.course._id,
      });

      if (progress) {
        isRead = progress.readLessons.some(
          (readId) => readId.toString() === lessonId.toString()
        );
      }
    }

    res.json({
      id: lesson._id,
      title: lesson.title,
      content: lesson.content,
      read: isRead,
    });
  } catch (err) {
    console.error("Error fetching lesson:", err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

router.post("/mark-read", authenticateToken, async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.userId;

    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    const alreadyRead = progress.readLessons.some(
      (id) => id.toString() === lessonId.toString()
    );

    if (!alreadyRead) {
      progress.readLessons.push(lessonId);
      await progress.save();
    }

    res.json({ message: "Lesson marked as read" });
  } catch (err) {
    console.error("Error marking read:", err);
    res.status(500).json({ error: "Failed to mark lesson as read" });
  }
});

module.exports = router;
