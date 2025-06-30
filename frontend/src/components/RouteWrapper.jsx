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
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Header from "./Header";

export default function RouteWrapper() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>
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
        </Route>
      </Routes>
    </Router>
  );
}
