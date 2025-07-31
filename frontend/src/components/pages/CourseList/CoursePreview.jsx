import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CoursePreview = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
    </motion.div>
  );
};

export default CoursePreview;
