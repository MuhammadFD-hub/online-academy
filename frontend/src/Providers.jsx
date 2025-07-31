import AuthProvider from "./context/Providers/AuthProvider";
import CoursesProvider from "./context/Providers/CoursesProvider";
import LessonProvider from "./context/Providers/LessonProvider";
import CacheProvider from "./context/Providers/CacheProvider";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <CacheProvider>
        <CoursesProvider>
          <LessonProvider>{children}</LessonProvider>
        </CoursesProvider>
      </CacheProvider>
    </AuthProvider>
  );
};

export default Providers;
