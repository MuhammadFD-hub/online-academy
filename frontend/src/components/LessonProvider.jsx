import { LessonContext } from "../context/allContext";
import useAuth from "../hooks/useAuth";
import useCache from "../hooks/useCache";

const LessonProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const { cacheLessonContent, markCacheLessonRead } = useCache();
  const token = localStorage.getItem("token");
  const fetchLesson = async (lessonId, setLesson) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/lesson/${lessonId}?userId=${user.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert("session expired. Please log in again.", errorData.message);
          logout();
          return;
        }
        throw new Error("Failed to fetch lesson");
      }

      const data = await response.json();
      cacheLessonContent(lessonId, data);
      setLesson(data);
    } catch (error) {
      throw new Error("Failed loading lesson", error);
    }
  };
  const markRead = async (courseId, lessonId) => {
    try {
      const userId = user.userId;
      const response = await fetch(
        "http://localhost:5000/api/lesson/mark-read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, courseId, lessonId }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert("session expired. Please log in again.", errorData.message);
          logout();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "mark as read failed");
      }
      markCacheLessonRead(courseId, lessonId);
    } catch (error) {
      console.error(`markRead error: ${error.message}`);
    }
  };

  return (
    <LessonContext.Provider
      value={{
        markRead,
        fetchLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export default LessonProvider;
