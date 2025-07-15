import React, { useEffect, useState } from "react";
import useLesson from "../hooks/useLesson";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import useCache from "../hooks/useCache";
const LessonPage = () => {
  const { id: courseId, lessonId } = useParams();
  const { markRead, fetchLesson, parseLessonString } = useLesson();
  const { getLessonContent } = useCache();
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    if (!getLessonContent(lessonId)) fetchLesson(lessonId, setLesson);
    else {
      const lessonContent = getLessonContent(lessonId);
      setLesson(lessonContent);
    }
  }, [lessonId, fetchLesson, getLessonContent]);
  if (!lesson) return <h1 className="m-4">Loading...</h1>;
  return (
    <div className="container mt-4">
      <h2 className="mb-3">{lesson.title}</h2>
      <div
        className="bg-light p-3 rounded"
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: parseLessonString(lesson.content) }}
      />
      {!lesson.read && (
        <Button
          className="mt-3"
          variant="outline-success"
          onClick={async () => {
            await markRead(courseId, lessonId);
            setLesson((prev) => ({ ...prev, read: true }));
          }}
        >
          Mark as Read
        </Button>
      )}
    </div>
  );
};

export default LessonPage;
