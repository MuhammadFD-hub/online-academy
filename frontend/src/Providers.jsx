import CoursesProvider from "./context/Providers/CoursesProvider";
import LessonProvider from "./context/Providers/LessonProvider";
import CacheProvider from "./context/Providers/CacheProvider";

const Providers = ({ children }) => {
  return (
    <CacheProvider>
      <CoursesProvider>
        <LessonProvider>{children}</LessonProvider>
      </CoursesProvider>
    </CacheProvider>
  );
};

export default Providers;
