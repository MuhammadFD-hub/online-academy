import { useEffect, useState } from "react";
import useLesson from "../hooks/useLesson";
import { useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import useCache from "../hooks/useCache";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const LessonPage = () => {
  const { id: courseId, lessonId } = useParams();
  const { fetchLesson } = useLesson();
  const { getLessonContent } = useCache();
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    if (!getLessonContent(lessonId)) fetchLesson(lessonId, setLesson);
    else {
      const lessonContent = getLessonContent(lessonId);
      setLesson(lessonContent);
    }
  }, [lessonId, fetchLesson, getLessonContent]);

  if (!lesson)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spinner variant="primary" animation="border" />
      </div>
    );

  return (
    <>
      <div className="container mt-4">
      <h2 className="mb-3">{lesson.title}</h2>
        <div
        className="bg-light p-3 rounded"
        style={{ whiteSpace: "pre-wrap" }}
          //
        >
          <ReactMarkdown
            components={{
              code({ inline, className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <div>
                    <code className={className}>{children}</code>
                  </div>
                );
              },
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>
        {!lesson.read && (
          <MarkButton
            courseId={courseId}
            lessonId={lessonId}
            setLesson={setLesson}
          />
        )}
      </div>
    </>
  );
};

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

export default LessonPage;
