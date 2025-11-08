import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={`${styles.homeBg} `}>
      <Container>
        <Row className="align-items-center">
          <Col
            md={6}
            className={`text-center text-md-start ${styles.animateInitial}`}
          >
            <h1 className="display-4 fw-bold text-primary">
              Welcome to <span className="text-dark">Online Academy</span>
            </h1>
            <p className="lead mt-3 text-secondary">
              Learn anytime, anywhere. Enroll in top-tier courses, track your
              progress, and elevate your skills with interactive lessons.
            </p>

            <div className="mt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login")}
                className={`d-inline-block me-3 ${styles.btn}`}
              >
                Login
              </Button>

              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => navigate("/signup")}
                className={`d-inline-block ${styles.btn}`}
              >
                Sign Up
              </Button>
            </div>
          </Col>

          <Col md={6} className="text-center mt-5 mt-md-0"></Col>
        </Row>
      </Container>
    </div>
  );
}
