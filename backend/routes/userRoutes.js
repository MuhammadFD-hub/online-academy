const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const UserProgress = require("../models/UserProgress.js");
const authenticateToken = require("../middleware/authToken.js");
const router = express.Router();
// /user
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
router.post("/uploadPfp", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const pfpCloudData = req.body;

    if (!pfpCloudData && !pfpCloudData?.delete)
      return res.status(400).json({ error: "Profile picture is required" });

    await User.updateOne(
      { _id: userId },
      { $set: { pfpCloudData: pfpCloudData } }
    );
    res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});
router.get("/getPfp", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("pfpCloudData");
    if (!user) return res.status(404).json({ error: "user id not found" });
    else if (!user.pfpCloudData) {
      return res.json({ pfpCloudData: null });
    }
    res.json({ pfpCloudData: user.pfpCloudData });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

router.post("/uploadBg", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bgCloudData = req.body;

    if (!bgCloudData && !bgCloudData?.delete)
      return res.status(400).json({ error: "Background picture is required" });

    await User.updateOne(
      { _id: userId },
      { $set: { bgCloudData: bgCloudData } }
    );
    res.json({ message: "Background picture updated successfully" });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});
router.get("/getBg", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("bgCloudData");
    if (!user) return res.status(404).json({ error: "user id not found" });
    else if (!user.bgCloudData) {
      return res.json({ bgCloudData: null });
    }
    res.json({ bgCloudData: user.bgCloudData });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch Background picture" });
  }
});

router.get("/getEmail", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    const user = await User.findById(userId).select("email");
    return res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
router.post("/updateEmail", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldEmail, newEmail } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!newEmail)
      return res.status(400).json({ error: "New email is required" });
    if (oldEmail === newEmail)
      return res.status(400).json({ error: "Email is same as old one" });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail))
      return res.status(400).json({ error: "Email not valid" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.email !== oldEmail) {
      return res.status(400).json({ error: "Old email does not match" });
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    await User.updateOne({ _id: userId }, { $set: { email: newEmail } });
    return res.json({ message: "Updated email successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update email" });
  }
});

router.post("/updatePassword", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!newPassword)
      return res.status(400).json({ error: "New password is required" });
    if (oldPassword === newPassword)
      return res.status(400).json({ error: "Password is same as old one" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordHash = user.passwordHash;
    const match = await bcrypt.compare(oldPassword, passwordHash);

    if (!match) return res.status(404).json({ error: "Incorrect password" });
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: userId },
      { $set: { passwordHash: newPasswordHash } }
    );
    return res.json({ message: "Updated password successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.get("/getUsername", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    const user = await User.findById(userId).select("username");
    return res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
router.post("/uploadUsername", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          username: username,
        },
      }
    );
    return res.json({ message: "personal info updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.get("/getUserInfo", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    const user = await User.findById(userId).select(
      "username dateOfBirth gender"
    );
    return res.json({ personalForm: user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
router.post("/uploadUserInfo", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const personalForm = req.body;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          username: personalForm.username,
          gender: personalForm.gender,
          dateOfBirth: personalForm.dateOfBirth,
        },
      }
    );
    return res.json({ message: "personal info updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});
router.get("/getBgFocus", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return res.status(400).json({ error: "User ID missing from token" });

    const user = await User.findById(userId).select("settings.bgFocus");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ focus: user.settings?.bgFocus });
  } catch (error) {
    console.error("Error fetching bgFocus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/updateBgFocus", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { bgFocus } = req.body;

    if (!userId)
      return res.status(400).json({ error: "User ID missing from token" });
    if (![1, 2, 3].includes(bgFocus))
      return res.status(400).json({ error: "Invalid bgFocus value" });

    const result = await User.updateOne(
      { _id: userId },
      { $set: { "settings.bgFocus": bgFocus } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "bgFocus updated successfully" });
  } catch (error) {
    console.error("Error updating bgFocus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getUser", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({ error: "user id not found" });
    const user = await User.findById(userId).select("email pfpCloudData");
    return res.json({ email: user.email, pfpCloudData: user.pfpCloudData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
module.exports = router;
