const createCoursesStore = (set, get) => {
  return {
    courses: null,
    setCourses: (newCourses) => {
      set({ courses: newCourses });
    },
    fetchCourses: async () => {
      try {
        let res = await get().fetchWithAuth(
          `http://localhost:5000/api/courses/`
        );
        const result = await res.json();
        if (!res.ok)
          throw new Error(
            `Error ${res.status}: ${res.statusText} ${result.error || ""}`
          );

        set({ courses: result });
        set({ error: null });
      } catch (err) {
        set({ error: err.message || "Something went wrong" });
      }
    },
    editCourses: (courseId, name, value) => {
      set((state) => ({
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, [name]: value } : c
        ),
      }));
    },

    enroll: async (courseId) => {
      try {
        const response = await get().fetchWithAuth(
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
            `Error ${response.status}: ${response.statusText} ${
              data.error || ""
            }`
          );
        }
        get().editCourses(courseId, "enrolled", true);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    },
    findCourse: (id) => {
      return get().courses?.find((course) => course.id === id) || null;
    },
    error: null,
    setError: (newErr) => {
      set({ error: newErr });
    },
  };
};

export default createCoursesStore;
