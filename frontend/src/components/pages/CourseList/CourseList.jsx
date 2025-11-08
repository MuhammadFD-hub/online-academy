import { Alert, Container, Spinner } from "react-bootstrap";
import CoursePreview from "./CoursePreview";
import { useEffect } from "react";
import UseStore from "../../../stores/UseStore";
import styles from "./CourseList.module.css";

export default function CourseList() {
  const error = UseStore((s) => s.error);
  const courses = UseStore((s) => s.courses);
  const fetchCourses = UseStore((s) => s.fetchCourses);

  useEffect(() => {
    if (!courses) fetchCourses();
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

  if (!courses) {
    return (
      <Container
        className={`d-flex justify-content-center align-items-center ${styles.animateInitial}`}
        style={{ height: "90vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className={`text-primary mb-4 text-center ${styles.animateInitial}`}>
        📚 Available Courses
      </h2>
      <div className="d-grid gap-4">
        {courses.map((course, i) => (
          <CoursePreview key={course.id} course={course} i={i} />
        ))}
      </div>
    </Container>
  );
}
