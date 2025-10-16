import LessonProvider from "./context/Providers/LessonProvider";
import CacheProvider from "./context/Providers/CacheProvider";

const Providers = ({ children }) => {
  return (
    <CacheProvider>
      <LessonProvider>{children}</LessonProvider>
    </CacheProvider>
  );
};

export default Providers;
