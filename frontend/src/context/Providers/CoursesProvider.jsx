import { useState } from "react";
import { CoursesContext } from "../allContext";
import UseStore from "../../stores/UseStore";

const CoursesProvider = ({ children }) => {
  const fetchWithAuth = UseStore((s) => s.fetchWithAuth);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    try {
      let res = await fetchWithAuth(`http://localhost:5000/api/courses/`, {
        "Content-Type": "application/json",
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(
          `Error ${res.status}: ${res.statusText} ${result.error || ""}`
        );

      setCourses(result);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };
  async function enroll(courseId) {
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/courses/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          `Error ${response.status}: ${response.statusText} ${data.error || ""}`
        );
      }
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.id === courseId ? { ...c, enrolled: true } : c
        )
      );
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
  function findCourse(id) {
    return courses.find((course) => course.id === id) || null;
  }
  return (
    <CoursesContext.Provider
      value={{ fetchCourses, setCourses, findCourse, error, courses, enroll }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
