import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import useLesson from "../hooks/useLesson";
import useCache from "../hooks/useCache";

const schema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, "u", "mark", "sub", "sup"],
  attributes: {
    ...defaultSchema.attributes,
    u: [],
    mark: [],
    sub: [],
    sup: [],
  },
};

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
        <h1 className="mb-3" style={{ color: "#0D6EFD" }}>
          {lesson.title}
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="p-3 rounded"
            style={{
              border: "solid .5px #6ea8ffff",
              boxShadow: "0 0 100px #a8cbffff",
              backgroundColor: "#ffffffff",
              width: "100%",
              maxWidth: "800px",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                rehypeRaw,
                [rehypeSanitize, { ...schema, prefix: false }],
              ]}
              components={{
                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={coy}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: "10px",
                        border: "solid 2px #6ea8ffff",
                        padding: "20px 0 0 0",
                      }}
                    >
                      {String(children).concat("\n")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
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
