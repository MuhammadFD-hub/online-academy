import { useEffect, useState } from "react";
import { CourseContext } from "../context/allContext";
import useAuth from "../hooks/useAuth";

const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${user.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const result = await res.json();
        if (!isCancelled) {
          setCourses(result);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Something went wrong");
        }
      }
    };
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [user.userId, user.token]);

  async function enroll(courseId) {
    const userId = user.userId;
    try {
      const response = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // if using auth
        },
        body: JSON.stringify({ userId, courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Enrollment failed");
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
    <CourseContext.Provider value={{ findCourse, error, courses, enroll }}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
