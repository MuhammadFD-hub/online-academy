import { useEffect, useState } from "react";
import { CoursesContext } from "../allContext";
import UseStore from "../../stores/UseStore";

const CoursesProvider = ({ children }) => {
  const logout = UseStore((s) => s.logout);
  const user = UseStore((s) => s.user);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            const errorData = await res.json();
            alert("session expired. Please log in again.", errorData.message);
            logout();
            return;
          }
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
    if (token && user) {
      fetchData();
    }
    return () => {
      isCancelled = true;
    };
  }, [token, user]);

  async function enroll(courseId) {
    try {
      const response = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert("session expired. Please log in again.", errorData.message);
          logout();
          return;
        }
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
    <CoursesContext.Provider value={{ findCourse, error, courses, enroll }}>
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
