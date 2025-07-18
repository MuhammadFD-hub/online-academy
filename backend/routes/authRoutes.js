const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash });
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });

    res.json({
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
