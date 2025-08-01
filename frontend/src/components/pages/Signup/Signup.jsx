import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import styles from "./Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const { signup } = useAuth();

  const inputConfig = [
    { label: "Email", type: "email", name: "email", required: true },
    { label: "Password", type: "password", name: "password", required: true },
  ];

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleFocus = (name) => setFocused(name);
  const handleBlur = () => setFocused(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(fields.email, fields.password);
  };

  const inputAnim = (key) =>
    focused === key
      ? { scale: 1.02, boxShadow: "0px 0px 5px rgba(0,123,255,0.5)" }
      : { scale: 1, boxShadow: "none" };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-100 d-flex justify-content-center"
      >
        <Card className={`p-4 shadow-lg ${styles.cardWidth}`}>
          <motion.h3
            className="mb-4 text-center text-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign Up
          </motion.h3>
          <Form onSubmit={handleSignup}>
            {inputConfig.map(({ label, type, name, required }, idx) => (
              <Form.Group className={idx === 1 ? "mt-3" : undefined} key={name}>
                <Form.Label>{label}</Form.Label>
                <motion.input
                  type={type}
                  name={name}
                  className="form-control"
                  value={fields[name]}
                  onChange={handleChange}
                  required={required}
                  onFocus={() => handleFocus(name)}
                  onBlur={handleBlur}
                  animate={inputAnim(name)}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </Form.Group>
            ))}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              tabIndex={-1}
            >
              <Button className="mt-4 w-100" type="submit" variant="success">
                Create Account
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              tabIndex={-1}
            >
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
