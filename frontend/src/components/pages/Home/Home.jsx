import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient( #dbeafe, #ffffff)",
        padding: "2rem 0",
      }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Text Section */}
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
                    style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.4)" }}
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
                    style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.1)" }}
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
