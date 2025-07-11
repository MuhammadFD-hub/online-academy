const express = require("express");
const Course = require("../models/Course");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");

const router = express.Router();
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const courses = await Course.find().populate("lessons");
    const userProgressList = await UserProgress.find({ user: userId }).lean();

    const progressMap = new Map();
    for (const progress of userProgressList) {
      const courseId = progress.course.toString();
      const readLessonIds = new Set(
        progress.readLessons.map((id) => id.toString())
      );
      progressMap.set(courseId, readLessonIds);
    }

    const result = courses.map((course) => {
      const courseIdStr = course._id.toString();
      const enrolled = progressMap.has(courseIdStr);

      return {
        id: course._id,
        title: course.title,
        description: course.description,
        enrolled,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching course data:", err.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.post("/enroll", async (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing userId or courseId" });
  }

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ error: "User or Course not found" });
    }

    const existingProgress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });
    if (existingProgress) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    const newProgress = new UserProgress({
      user: userId,
      course: courseId,
      readLessons: [],
    });

    await newProgress.save();

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enrollment error:", err.message);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
});

router.get("/:courseId/lessons", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.query;

    const course = await Course.findById(courseId).populate("lessons");
    if (!course) return res.status(404).json({ error: "Course not found" });

    let readLessonIds = [];

    if (userId) {
      const progress = await UserProgress.findOne({
        user: userId,
        course: courseId,
      });
      if (progress) {
        readLessonIds = progress.readLessons.map((id) => id.toString());
      }
    }

    const lessons = course.lessons.map((lesson) => ({
      id: lesson._id,
      title: lesson.title,
      read: readLessonIds.includes(lesson._id.toString()),
    }));

    res.json(lessons);
  } catch (err) {
    console.error("Error fetching course detail:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
