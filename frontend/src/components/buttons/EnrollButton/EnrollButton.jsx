import { useState } from "react";
import useCourses from "../../../hooks/useCourses";
import { Button, Spinner } from "react-bootstrap";
import styles from "./EnrollButton.module.css";
import sharedStyles from "../SharedBtn.module.css";

const EnrollButton = ({ courseId }) => {
  const { enroll } = useCourses();
  const [enrollLoading, setEnrollLoading] = useState(false);
  return (
    <Button
      className="mt-3"
      variant="outline-success"
      onClick={async () => {
        setEnrollLoading(true);
        await enroll(courseId);
        setEnrollLoading(false);
      }}
    >
      {!enrollLoading ? (
        "Enroll to Start Learning"
      ) : (
        <div className={`${sharedStyles.btnLoading} ${styles.btnWidth}`}>
          <Spinner
            className={`${sharedStyles.btnSpinner}`}
            variant="success"
            animation="border"
          />
        </div>
      )}
    </Button>
  );
};

export default EnrollButton;
