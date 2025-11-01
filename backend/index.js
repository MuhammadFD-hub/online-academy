const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const coursesRoutes = require("./routes/coursesRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
let DB_URL = "";

if (!process.env.MONGO_URI) DB_URL = "mongodb://127.0.0.1:27017/online-academy";
else DB_URL = process.env.MONGO_URI;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://0nline-academy.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});
// Routes
app.use("/api/courses", coursesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lesson", lessonRoutes);

app.use((req, res) => {
  console.log("No matching route for:", req.method, req.path);
  res.status(404).json({ error: "Not found" });
});

console.log("Connecting to MongoDB URI:", DB_URL);

async function startServer() {
  try {
    await mongoose.connect(DB_URL, { autoIndex: true });
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
