import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function Enroll({ course, onEnroll }) {
  const [name, setName] = useState("");

  const handleEnroll = () => {
    onEnroll(course.id, { name });
  };

  return (
    <Card className="p-4 shadow">
      <h5 className="mb-3 text-success">Enroll in {course.title}</h5>
      <Form>
        <Form.Group>
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-3" variant="success" onClick={handleEnroll}>
          Enroll
        </Button>
      </Form>
    </Card>
  );
}
