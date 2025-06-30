import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, ProgressBar, Button, Alert } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : authUser || null;
  });

  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const navigate = useNavigate();

  let currLesson = localStorage.getItem("currLesson");
  if (currLesson) currLesson = JSON.parse(currLesson);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/dashboard/${user.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user progress");

        const data = await response.json();
        setEnrollments(data.enrollments || []);
        if (!authUser) setUser(data.user);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchProgress();
  }, [user?.userId]);

  const totalProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) /
            enrollments.length
        )
      : 0;

  if (!user)
    return (
      <motion.div
        className="text-danger m-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3>Please log in.</h3>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        className="m-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </motion.div>
    );

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="mb-4 text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome, {"User"}!
      </motion.h2>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>📘 Enrolled Courses</Card.Title>
                <Card.Text className="text-muted">
                  You're enrolled in <strong>{enrollments.length}</strong>{" "}
                  course{enrollments.length !== 1 && "s"}.
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col md={6} lg={4}>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>📊 Overall Progress</Card.Title>
                <Card.Text className="text-muted">
                  You’ve completed <strong>{totalProgress}%</strong> of your
                  lessons.
                </Card.Text>

                <Button
                  className="mt-2"
                  variant="outline-primary"
                  onClick={() => setShowProgressDetails((prev) => !prev)}
                >
                  {showProgressDetails ? "Hide Details" : "Show Progress"}
                </Button>

                <AnimatePresence>
                  {showProgressDetails && (
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {enrollments.map((e, index) => (
                        <div key={index} className="mb-3">
                          <strong>{e.course}</strong>
                          <ProgressBar
                            now={e.progress}
                            label={`${e.progress}%`}
                            striped
                            variant={e.progress > 75 ? "success" : "info"}
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {currLesson && (
          <Col md={6} lg={4}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card
                className="shadow-sm rounded-4"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/course/${currLesson.courseId}/lesson/${currLesson.lessonId}`
                  )
                }
              >
                <Card.Body>
                  <Card.Title>📖 Last Viewed Lesson</Card.Title>
                  <Card.Text className="text-muted">
                    {currLesson.title}
                  </Card.Text>
                  <small className="text-primary">
                    Continue where you left off
                  </small>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        )}
      </Row>
    </motion.div>
  );
}
