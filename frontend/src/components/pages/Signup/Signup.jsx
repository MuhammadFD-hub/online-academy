import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import styles from "./Signup.module.css";
import UseStore from "../../../stores/UseStore";

export default function Signup() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: "", password: "" });
  const signup = UseStore((s) => s.signup);
  const inputConfig = [
    { label: "Email", type: "email", name: "email", required: true },
    { label: "Password", type: "password", name: "password", required: true },
  ];
  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(fields.email, fields.password);
  };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <div className="w-100 d-flex justify-content-center">
        <Card
          className={`p-4 shadow-lg ${styles.cardWidth} ${styles.animateInitial}`}
        >
          <h3 className="mb-4 text-center text-success">Sign Up</h3>
          <Form onSubmit={handleSignup}>
            {inputConfig.map(({ label, type, name, required }, idx) => (
              <Form.Group className={idx === 1 ? "mt-3" : undefined} key={name}>
                <Form.Label>{label}</Form.Label>
                <input
                  type={type}
                  name={name}
                  className="form-control"
                  value={fields[name]}
                  onChange={handleChange}
                  required={required}
                />
              </Form.Group>
            ))}
            <Button
              className={`mt-3 w-100 ${styles.btns}`}
              type="submit"
              variant="success"
            >
              Create Account
            </Button>
            <Button
              className={`mt-3 w-100 ${styles.btns}`}
              variant="outline-secondary"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </Form>
        </Card>
      </div>
    </Container>
  );
}
