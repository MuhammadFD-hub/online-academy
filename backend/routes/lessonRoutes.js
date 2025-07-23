const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const UserProgress = require("../models/UserProgress");
const authenticateToken = require("../middleware/authToken");

router.get("/:lessonId", authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    const lesson = await Lesson.findById(lessonId).select(
      "title content course"
    );
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const progress = await UserProgress.findOne(
      { user: userId, course: lesson.course },
      { readLessons: 1 }
    ).lean();

    const isRead =
      progress?.readLessons?.some((id) => id.toString() === lessonId) ?? false;

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

    const result = await UserProgress.updateOne(
      { user: userId, course: courseId },
      { $addToSet: { readLessons: lessonId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Progress record not found" });
    }

    res.json({ message: "Lesson marked as read" });
  } catch (err) {
    console.error("Error marking read:", err);
    res.status(500).json({ error: "Failed to mark lesson as read" });
  }
});

module.exports = router;
