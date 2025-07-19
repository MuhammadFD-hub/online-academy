import AuthProvider from "./components/AuthProvider";
import CacheProvider from "./components/CacheProvider";
import CoursesProvider from "./components/CoursesProvider";
import LessonProvider from "./components/LessonProvider";
import RouteWrapper from "./components/RouteWrapper";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();
  return (
    <>
      {!user ? (
        <RouteWrapper />
      ) : (
        <CacheProvider>
          <CoursesProvider>
            <LessonProvider>
              <RouteWrapper />
            </LessonProvider>
          </CoursesProvider>
        </CacheProvider>
      )}
    </>
  );
}
