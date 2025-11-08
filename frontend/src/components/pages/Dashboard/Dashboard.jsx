import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  Alert,
  Container,
} from "react-bootstrap";
import ItemSpinner from "../../Spinner/ItemSpinner/ItemSpinner";
import Username from "../../Username/Username";
import UseStore from "../../../stores/UseStore";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const fetchWithAuth = UseStore((s) => s.fetchWithAuth);
  const user = UseStore((s) => s.user);

  const [enrollments, setEnrollments] = useState(null);
  const [error, setError] = useState(null);
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const navigate = useNavigate();

  let currLesson = localStorage.getItem("currLesson");
  if (currLesson) currLesson = JSON.parse(currLesson);
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetchWithAuth(`api/user/dashboard/`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            `Error ${response.status}: ${response.statusText} ${
              data.error || ""
            }`
          );

        setEnrollments(data.enrollments);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    };
    if (user) fetchProgress();
    else {
      setError("Please log in to view your dashboard.");
    }
  }, []);
  const totalProgress = Math.round(
    enrollments?.reduce((sum, e) => sum + e.progress, 0) / enrollments?.length
  );

  if (!user)
    return (
      <div className={`text-danger m-5 ${styles.appearInitial}`}>
        <h3>Please log in.</h3>
      </div>
    );

  if (error)
    return (
      <div className={`m-4 ${styles.appearInitial}`}>
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );

  return (
    <Container className={`px-3 mt-4 ${styles.animateInitial}`}>
      <h2
        className={`mb-4 text-primary ${styles.appearInitial}`}
        style={{ animationDelay: "0.2s" }}
      >
        Welcome, {<Username />}!
      </h2>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <div whileHover={{ scale: 1.03 }}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>📘 Enrolled Courses</Card.Title>
                {enrollments ? (
                  <Card.Text className="text-muted">
                    You're enrolled in <strong>{enrollments?.length}</strong>{" "}
                    course{enrollments?.length !== 1 && "s"}.
                  </Card.Text>
                ) : (
                  <ItemSpinner />
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col md={6} lg={4}>
          <div whileHover={{ scale: 1.03 }}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>📊 Overall Progress</Card.Title>
                {enrollments ? (
                  <>
                    <Card.Text className="text-muted">
                      You’ve completed{" "}
                      <strong>{totalProgress ? totalProgress : "0"}%</strong> of
                      your lessons.
                    </Card.Text>

                    <Button
                      className="mt-2"
                      variant="outline-primary"
                      onClick={() => setShowProgressDetails((prev) => !prev)}
                    >
                      {showProgressDetails ? "Hide Details" : "Show Progress"}
                    </Button>
                    <div
                      className={`mt-3 ${
                        !showProgressDetails && styles.hideProgress
                      } ${styles.progress} `}
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
                    </div>
                  </>
                ) : (
                  <ItemSpinner />
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        {currLesson && (
          <Col md={6} lg={4}>
            <div className={`${styles.largeOnHover}`}>
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
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}
