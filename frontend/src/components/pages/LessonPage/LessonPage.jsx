import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

import { Highlight, themes } from "prism-react-renderer";

import useLesson from "../../../hooks/useLesson";
import useCache from "../../../hooks/useCache";

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
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <Highlight
                      theme={themes.oneLight}
                      code={String(children).trim()}
                      language={match[1]}
                    >
                      {({ style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                          className={className}
                          style={{
                            ...style,
                            borderRadius: "10px",
                            padding: "16px",
                            overflowX: "auto",
                            border: "solid 2px #6ea8ffff",
                            fontSize: "0.85rem",
                            backgroundColor: "#e9f1ffff",
                          }}
                        >
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
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

export default LessonPage;
