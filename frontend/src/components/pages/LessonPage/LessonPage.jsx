import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

import MarkButton from "../../buttons/MarkButton/MarkButton";
import PageSpinner from "../../Spinner/PageSpinner/PageSpinner";

import "highlight.js/styles/github.css";
import styles from "./LessonPage.module.css";
import UseStore from "../../../stores/UseStore";
import { motion } from "framer-motion";

const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "u",
    "mark",
    "sub",
    "sup",
    "span",
  ],
  attributes: {
    ...defaultSchema.attributes,
    code: [["className"]],
    span: [["className"]],
    u: [],
    mark: [],
    sub: [],
    sup: [],
  },
};

const LessonPage = () => {
  const { id: courseId, lessonId } = useParams();
  const fetchLesson = UseStore((s) => s.fetchLesson);
  const getLessonContent = UseStore((s) => s.getLessonContent);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const cached = getLessonContent(lessonId);
    if (!cached) {
      fetchLesson(lessonId, setLesson);
    } else {
      setLesson(cached);
    }
  }, []);

  if (!lesson) return <PageSpinner />;

  return (
    <div className="container mt-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className={`mb-3 ${styles.heading}`}>{lesson.title}</h1>
      </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${styles.contentAlignment}`}
      >
        <div className={`p-3 rounded ${styles.contentWidth}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              rehypeRaw,
              rehypeHighlight,
              [rehypeSanitize, { ...schema }],
            ]}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {!lesson.read && (
        <MarkButton
          courseId={courseId}
          lessonId={lessonId}
          setLesson={setLesson}
        />
      )}
    </div>
  );
};

export default LessonPage;
