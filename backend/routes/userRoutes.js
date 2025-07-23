const express = require("express");
const User = require("../models/User.js");
const UserProgress = require("../models/UserProgress.js");
const authenticateToken = require("../middleware/authToken.js");
const router = express.Router();

router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    // .select("name").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const progressList = await UserProgress.find({ user: userId })
      .populate({
        path: "course",
        select: "title lessons",
        populate: { path: "lessons", select: "_id" },
      })
      .select("course readLessons")
      .lean();

    const enrollments = progressList.map((progress) => {
      const totalLessons = progress.course.lessons?.length || 0;
      const readCount = progress.readLessons?.length || 0;

      return {
        course: progress.course.title,
        progress: totalLessons
          ? Math.round((readCount / totalLessons) * 100)
          : 0,
      };
    });

    res.json({
      // name: user.name,
      enrollments,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
