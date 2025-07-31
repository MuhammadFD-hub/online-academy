import { useState } from "react";
import useCourses from "../../hooks/useCourses";

const EnrollButton = ({ courseId }) => {
  const { enroll } = useCourses();
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const spinColor = hover ? "white" : "initial";
  return (
    <Button
      className="mt-3"
      variant="outline-success"
      onClick={async () => {
        setEnrollLoading(true);
        await enroll(courseId);
        setEnrollLoading(false);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!enrollLoading ? (
        "Enroll to Start Learning"
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "161.333px",
            height: "24px",
          }}
        >
          <Spinner
            style={{
              maxHeight: "20px",
              maxWidth: "20px",
              borderTopColor: spinColor,
              borderLeftColor: spinColor,
              borderBottomColor: spinColor,
            }}
            variant="success"
            animation="border"
          />
        </div>
      )}
    </Button>
  );
};

export default EnrollButton;
