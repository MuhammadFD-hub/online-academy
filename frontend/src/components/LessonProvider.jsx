import { LessonContext } from "../context/allContext";
import useAuth from "../hooks/useAuth";
import useCache from "../hooks/useCache";

const LessonProvider = ({ children }) => {
  const { user } = useAuth();
  const { cacheLessonContent, markCacheLessonRead } = useCache();
  const fetchLesson = async (lessonId, setLesson) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/lesson/${lessonId}?userId=${user.userId}`, // Pass userId as query param
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId, lessonId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "mark as read failed");
      }
      markCacheLessonRead(courseId, lessonId);
    } catch (error) {
      console.error(`markRead error: ${error.message}`);
    }
  };

  function parseLessonString(content) {
    if (!content) return "";

    const escapeHtml = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    content = content.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_, lang = "", code) =>
        `<div class="code-block bg-dark text-light rounded p-2 mb-3"><h5 class="bg-secondary rounded p-2 text-light ">${lang}</h5><pre><code>${escapeHtml(
          code
        )}</code></pre></div>`
    );

    content = content.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    content = content.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
    content = content.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
    content = content.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    content = content.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    content = content.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    content = content.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    content = content.replace(/^(?!<h\d>|<|<b>|<div)(.+)$/gm, "<p>$1</p>");

    return content;
  }
  return (
    <LessonContext.Provider
      value={{
        markRead,
        fetchLesson,
        parseLessonString,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export default LessonProvider;
