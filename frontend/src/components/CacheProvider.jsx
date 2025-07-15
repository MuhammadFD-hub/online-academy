import React, { useRef } from "react";
import { CacheContext } from "../context/allContext";

const CacheProvider = ({ children }) => {
  const lessons = useRef(new Map());
  const lessonsContent = useRef(new Map());
  // const courses = useRef(new Map());

  // function getCourse(id) {
  //   return courses.current.get(id);
  // }
  // function cacheCourse(course) {
  //   courses.current.set(course.id, course);
  // }
  // function updateCourseCache(course) {
  //   courses.current.set(course.id, course);
  // }

  function getLessons(courseId) {
    return lessons.current.get(courseId);
  }
  function cacheLessons(courseId, lesson) {
    lessons.current.set(courseId, lesson);
  }
  function updateLessonsCache(courseId, lesson) {
    lessons.current.set(courseId, lesson);
  }
  function markCacheLessonRead(courseId, lessonId) {
    const lesns = lessons.current.get(courseId);
    lesns.forEach((lesson) => {
      if (lesson.id === lessonId) lesson.read = true;
    });
    lessons.current.set(courseId, lesns);
  }

  function getLessonContent(lessonId) {
    return lessonsContent.current.get(lessonId);
  }
  function cacheLessonContent(lessonId, content) {
    lessonsContent.current.set(lessonId, content);
  }

  return (
    <CacheContext.Provider
      value={{
        getLessons,
        cacheLessons,
        updateLessonsCache,
        getLessonContent,
        cacheLessonContent,
        markCacheLessonRead,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export default CacheProvider;
