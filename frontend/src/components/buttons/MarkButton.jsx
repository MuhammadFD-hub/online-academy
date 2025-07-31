import { useState } from "react";
import useLesson from "../../hooks/useLesson";

const MarkButton = ({ courseId, lessonId, setLesson }) => {
  const [markLoading, setMarkLoading] = useState(false);
  const { markRead } = useLesson();
  const [hover, setHover] = useState(false);
  const spinColor = hover ? "white" : "initial";
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!markLoading ? (
        "Mark as Read"
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "94.7px",
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

export default MarkButton;
