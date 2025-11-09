import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import styles from "./Login.module.css";
import UseStore from "../../../stores/UseStore.jsx";

export default function Login() {
  const login = UseStore((s) => s.login);

  const [fields, setFields] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(fields.email, fields.password);
  };
  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <div className="w-100 d-flex justify-content-center">
        <Card
          className={`p-4 shadow-lg ${styles.cardWidth} ${styles.animateInitial}`}
        >
          <h3 className="mb-4 text-center text-primary">Login</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <input
                type="email"
                name="email"
                className={`form-control`}
                value={fields.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <input
                type="password"
                name="password"
                className={`form-control`}
                value={fields.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button
              className={`mt-3 w-100 ${styles.btns}`}
              type="submit"
              variant="primary"
            >
              Login
            </Button>
            <Button
              className={`mt-3 w-100 ${styles.btns}`}
              variant="outline-primary"
              onClick={() => navigate("/signup")}
            >
              Signup
            </Button>
          </Form>
        </Card>
      </div>
    </Container>
  );
}
