import { CourseContext } from "../context/allContext";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";

const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const {
    data: courses,
    error,
    loading,
  } = useFetch(`http://localhost:5000/api/courses/${user.userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });
  const enroll = async (course, setEnrolled) => {
    const courseId = course.id;
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
        throw new Error(errorData.message || "Enrollment failed");
      }
      console.log(`User enrolled in course ${courseId}`);
      course.enrolled = true;
      setEnrolled(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  function findCourse(courses, id) {
    return (
      courses.find((course) => course._id === id || course.id === id) || null
    );
  }
  return (
    <CourseContext.Provider
      value={{ findCourse, loading, error, courses, enroll }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
