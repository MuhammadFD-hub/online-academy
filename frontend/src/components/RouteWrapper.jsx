import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "./Login";
import CourseList from "./CourseList";
import CoursePage from "./CoursePage";
import "bootstrap/dist/css/bootstrap.min.css";
import LessonPage from "./LessonPage";
import Signup from "./Signup";
import Home from "./Home";
import Layout from "./Layout/Layout";
import Dashboard from "./Dashboard";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
export default function RouteWrapper() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
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
