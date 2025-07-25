const express = require("express");
const Course = require("../models/Course");
const UserProgress = require("../models/UserProgress");
const User = require("../models/User");
const authenticateToken = require("../middleware/authToken");

const router = express.Router();
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userProgressList = await UserProgress.find({ user: userId }).select(
      "course"
    );

    const enrolledCourseIds = new Set(
      userProgressList.map((entry) => entry.course.toString())
    );

    const courses = await Course.find();

    const result = courses.map((course) => ({
      id: course._id,
      title: course.title,
      description: course.description,
      enrolled: enrolledCourseIds.has(course._id.toString()),
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching course data:", err.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.post("/enroll", authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user?.userId;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing userId or courseId" });
  }

  try {
    const existingProgress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });
    if (existingProgress) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    await UserProgress.create({
      user: userId,
      course: courseId,
      readLessons: [],
    });

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
});

router.get("/:courseId/lessons", authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?.userId;

  try {
    const course = await Course.findById(courseId).populate({
      path: "lessons",
      options: { sort: { order: 1 } },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    }).lean();
    const readLessonIds = new Set(
      (progress?.readLessons || []).map((id) => id.toString())
    );

    const lessons = course.lessons.map((lesson) => ({
      id: lesson._id,
      title: lesson.title,
      read: readLessonIds.has(lesson._id.toString()),
    }));

    res.json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
