import { useState } from "react";
import useLesson from "../../../hooks/useLesson";
import { Button, Spinner } from "react-bootstrap";
import sharedStyles from "../SharedBtn.module.css";
import styles from "./MarkButton.module.css";

const MarkButton = ({ courseId, lessonId, setLesson }) => {
  const [markLoading, setMarkLoading] = useState(false);
  const { markRead } = useLesson();
  return (
    <Button
      className="mt-3"
      variant="outline-success"
      onClick={async () => {
        setMarkLoading(true);
        await markRead(courseId, lessonId);
        setLesson((prev) => ({ ...prev, read: true }));
        setMarkLoading(false);
      }}
    >
      {!markLoading ? (
        "Mark as Read"
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

export default MarkButton;
