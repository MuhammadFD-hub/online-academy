const creatLessonStore = (set, get) => {
  return {
    fetchLesson: async (lessonId, setLesson) => {
      try {
        const response = await get().fetchWithAuth(
          `http://localhost:5000/api/lesson/${lessonId}?userId=${
            get().user.userId
          }`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText} ${
              data.error || ""
            }`
          );
        }

        // cacheLessonContent(lessonId, data);
        setLesson(data);
      } catch (err) {
        console.error(err.message || "Something went wrong");
      }
    },
    markRead: async (courseId, lessonId) => {
      try {
        const userId = get().user.userId;
        const response = await get().fetchWithAuth(
          "http://localhost:5000/api/lesson/mark-read",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, courseId, lessonId }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: ${response.statusText} ${
              data.error || ""
            }`
          );
        }
        // markCacheLessonRead(courseId, lessonId);
      } catch (err) {
        console.error(err.message || "Something went wrong");
      }
    },
  };
};
export default creatLessonStore;
