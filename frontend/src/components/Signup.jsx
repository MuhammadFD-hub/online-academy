import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth"; // Update path as needed

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(email, password, navigate);
  };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-100 d-flex justify-content-center"
      >
        <Card
          className="p-4 shadow-lg"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <motion.h3
            className="mb-4 text-center text-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign Up
          </motion.h3>
          <Form onSubmit={handleSignup}>
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
                  boxShadow: "0px 0px 5px rgba(0, 123, 255, 0.5)",
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
                  boxShadow: "0px 0px 5px rgba(0, 123, 255, 0.5)",
                }}
              />
            </Form.Group>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="mt-4 w-100" type="submit" variant="success">
                Create Account
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="mt-3 w-100"
                variant="outline-secondary"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </motion.div>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
}
