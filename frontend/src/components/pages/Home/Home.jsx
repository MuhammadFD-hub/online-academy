import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import style from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={`${style.homeBg} `}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="display-4 fw-bold text-primary">
                Welcome to <span className="text-dark">Online Academy</span>
              </h1>
              <p className="lead mt-3 text-secondary">
                Learn anytime, anywhere. Enroll in top-tier courses, track your
                progress, and elevate your skills with interactive lessons.
              </p>

              <div className="mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="d-inline-block me-3"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/login")}
                    className={`${style.shadow}`}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="d-inline-block"
                >
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => navigate("/signup")}
                    className={`${style.shadow}`}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </Col>

          <Col md={6} className="text-center mt-5 mt-md-0"></Col>
        </Row>
      </Container>
    </div>
  );
}
