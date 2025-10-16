const creatCacheStore = (set, get) => {
  return {
    cachedLessons: new Map(),

    fullLessons: new Map(),
    getLessons: (courseId) => {
      return get().cachedLessons.get(courseId);
    },
    cacheLessons: (courseId, lesson) => {
      get().cachedLessons.set(courseId, lesson);
    },
    updateLessonsCache: (courseId, lesson) => {
      get().cachedLessons.set(courseId, lesson);
    },
    markCacheLessonRead: (courseId, lessonId) => {
      const lesns = get().cachedLessons.get(courseId);
      lesns.forEach((lesson) => {
        if (lesson.id === lessonId) lesson.read = true;
      });
      get().cachedLessons.set(courseId, lesns);
    },

    getLessonContent: (lessonId) => {
      return get().fullLessons.get(lessonId);
    },
    cacheLessonContent: (lessonId, content) => {
      get().fullLessons.set(lessonId, content);
    },
  };
};
export default creatCacheStore;
