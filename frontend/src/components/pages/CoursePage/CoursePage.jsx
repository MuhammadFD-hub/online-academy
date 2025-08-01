import { useNavigate, useParams } from "react-router-dom";
import { Container, Alert, Card, ProgressBar, Spinner } from "react-bootstrap";
import useCourses from "../../../hooks/useCourses";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { motion } from "framer-motion";
import useCache from "../../../hooks/useCache";
import EnrollButton from "../../buttons/EnrollButton/EnrollButton";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const { findCourse } = useCourses();
  const { cacheLessons, getLessons } = useCache();
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);
  let course = findCourse(id);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${id}/lessons`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          if (res.status === 401) {
            const errorData = await res.json();
            alert("session expired. Please log in again.", errorData.message);
            logout();
            return;
          }
          throw new Error("Failed to fetch course");
        }
        const data = await res.json();
        cacheLessons(id, data);
        setLessons(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (!getLessons(id)) fetchLessons();
    else {
      setLessons(getLessons(id));
    }
  }, [id, course, getLessons, cacheLessons, token, logout]);

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>❌ Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!course || (!lessons && course.enrolled)) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!course.enrolled) {
    return (
      <Container className="mt-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-primary mb-3">{course.title}</h2>
          <p className="text-muted">{course.description}</p>
          <EnrollButton courseId={course.id} />
        </motion.div>
      </Container>
    );
  }

  const completedCount = lessons.filter((l) => Number(l.read)).length;
  const progress = (completedCount / lessons.length) * 100;

  return (
    <Container className="mt-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-primary">{course.title}</h2>
        <ProgressBar
          className="mt-3 mb-4"
          now={progress}
          label={`${Math.round(progress)}% Complete`}
          striped
          animated
          variant={progress === 100 ? "success" : "info"}
        />
      </motion.div>

      <div className="d-grid gap-4">
        {lessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * lesson.id }}
          >
            <Card
              className={`p-3 shadow-sm border-0 rounded-4 ${
                lesson.read ? "bg-light" : ""
              }`}
              role="button"
              onClick={() => {
                navigate(`lesson/${lesson.id}`);
                localStorage.setItem(
                  "currLesson",
                  JSON.stringify({
                    lessonId: lesson.id,
                    title: lesson.title,
                    courseId: course.id,
                  })
                );
              }}
            >
              <h5 className={`text-${lesson.read ? "success" : "secondary"}`}>
                {lesson.title}
              </h5>
              {lesson.read && <small className="text-muted">✓ Completed</small>}
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
