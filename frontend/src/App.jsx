import CoursesProvider from "./components/CoursesProvider";
import LessonProvider from "./components/LessonProvider";
import RouteWrapper from "./components/RouteWrapper";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  if (user === null) {
    return (
      <>
        <RouteWrapper />
      </>
    );
  }

  return (
    <CoursesProvider>
      <LessonProvider>
        <RouteWrapper />
      </LessonProvider>
    </CoursesProvider>
  );
}
