import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./EnrollButton.module.css";
import sharedStyles from "../SharedBtn.module.css";
import UseStore from "../../../stores/UseStore";

const EnrollButton = ({ courseId, setCourse }) => {
  const enroll = UseStore((s) => s.enroll);
  const [enrollLoading, setEnrollLoading] = useState(false);
  return (
    <Button
      className="mt-3"
      variant="outline-success"
      onClick={async () => {
        setEnrollLoading(true);
        await enroll(courseId);
        setCourse((course) => ({ ...course, enrolled: true }));
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
