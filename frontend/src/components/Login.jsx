import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password, navigate);
  };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-100 d-flex justify-content-center"
      >
        <Card
          className="p-4 shadow-lg"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <motion.h3
            className="mb-4 text-center text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Login
          </motion.h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <motion.input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0px 0px 6px rgba(0, 123, 255, 0.5)",
                }}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <motion.input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0px 0px 6px rgba(0, 123, 255, 0.5)",
                }}
              />
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="mt-4 w-100" type="submit" variant="primary">
                Login
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="mt-3 w-100"
                variant="outline-primary"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </motion.div>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
}
