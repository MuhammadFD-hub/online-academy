import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Alert,
  Button,
  Card,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import useCourse from "../hooks/useCourse";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enroll } = useCourse();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${id}/lessons?userId=${user.userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
        setEnrolled(data.enrolled);
        console.log("Course data fetched:", data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourse();
  }, [id, user.userId]);

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

  if (!course) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!enrolled) {
    return (
      <Container className="mt-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-primary mb-3">{course.title}</h2>
          <p className="text-muted">{course.description}</p>
          <Button
            className="mt-3"
            variant="success"
            onClick={() => enroll(course, setEnrolled)}
          >
            Enroll to Start Learning
          </Button>
        </motion.div>
      </Container>
    );
  }

  const completedCount = course.lessons.filter((l) => Number(l.read)).length;
  const progress = (completedCount / course.lessons.length) * 100;

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
        {course.lessons.map((lesson) => (
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
