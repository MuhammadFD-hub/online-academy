import { Alert, Container, Spinner } from "react-bootstrap";
import CoursePreview from "./CoursePreview";
import useCourses from "../../../hooks/useCourses";
import { motion } from "framer-motion";
import { useEffect } from "react";
import UseStore from "../../../stores/UseStore";

export default function CourseList() {
  const user = UseStore((s) => s.user);
  const { error, courses, fetchCourses } = useCourses();
  useEffect(() => {
    if (user) fetchCourses();
  }, []);

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>⚠️ Error Occurred</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (courses.length === 0) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <motion.h2
        className="text-primary mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        📚 Available Courses
      </motion.h2>
      <div className="d-grid gap-4">
        {courses.map((course) => (
          <CoursePreview key={course.id} course={course} />
        ))}
      </div>
    </Container>
  );
}
