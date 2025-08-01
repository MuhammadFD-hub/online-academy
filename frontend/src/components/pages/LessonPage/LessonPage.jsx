import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

import { Highlight, themes } from "prism-react-renderer";

import useLesson from "../../../hooks/useLesson";
import useCache from "../../../hooks/useCache";
import MarkButton from "../../buttons/MarkButton/MarkButton";
import PageSpinner from "../../Spinner/PageSpinner/PageSpinner";
import styles from "./LessonPage.module.css";

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
  }, [lessonId]);

  if (!lesson) return <PageSpinner />;

  return (
    <>
      <div className="container mt-4">
        <h1 className={`mb-3 ${styles.heading}`}>{lesson.title}</h1>
        <div className={`${styles.contentAlignment}`}>
          <div className={`p-3 rounded ${styles.contentWidth}`}>
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
                          className={`${className} ${styles.codeBlock}`}
                          style={{
                            ...style,
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
