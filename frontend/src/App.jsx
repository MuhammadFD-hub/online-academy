import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/pages/Login/Login";
import CourseList from "./components/pages/CourseList/CourseList";
import CoursePage from "./components/pages/CoursePage/CoursePage";
import "bootstrap/dist/css/bootstrap.min.css";
import LessonPage from "./components/pages/LessonPage/LessonPage";
import Signup from "./components/pages/Signup/Signup";
import Home from "./components/pages/Home/Home";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Profile from "./components/pages/Profile/Profile";
import { useEffect } from "react";
import UseStore from "./stores/UseStore";
export default function App() {
  const navigate = useNavigate();
  const user = UseStore((s) => s.user);
  const getUsername = UseStore((s) => s.getUsername);
  const getUser = UseStore((s) => s.getUser);
  const setNavigate = UseStore((s) => {
    return s.setNavigate;
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    getUsername();
    getUser(token);
    setNavigate(navigate);
  }, []);

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/courses"
          element={user ? <CourseList /> : <Navigate to="/" />}
        />
        <Route
          path="/course/:id"
          element={user ? <CoursePage /> : <Navigate to="/" />}
        />
        <Route
          path="/course/:id/lesson/:lessonId"
          element={user ? <LessonPage /> : <Navigate to="/" />}
        />
      </Route>
    </Routes>
  );
}
