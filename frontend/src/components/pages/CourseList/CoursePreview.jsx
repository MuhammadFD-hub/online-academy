import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./CoursePreview.module.css";

const CoursePreview = ({ course, i }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.animateInitial}`}
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <Card className="shadow-sm border-0 rounded-4 p-4 hover-shadow transition">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="text-dark">{course.title}</h4>
          {course.enrolled && <Badge bg="success">Enrolled</Badge>}
        </div>
        <p className="text-muted mb-3">{course.description.slice(0, 100)}...</p>
        <Button
          variant={course.enrolled ? "outline-primary" : "info"}
          onClick={() => navigate(`/course/${course.id}`)}
        >
          {course.enrolled ? "Continue Course" : "View Course"}
        </Button>
      </Card>
    </div>
  );
};

export default CoursePreview;
