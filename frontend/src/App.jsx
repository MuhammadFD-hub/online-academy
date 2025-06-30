import CourseProvider from "./components/CourseProvider";
import LessonProvider from "./components/LessonProvider";
import RouteWrapper from "./components/RouteWrapper";
import useAuth from "./hooks/useAuth";
import Header from "./components/Header";

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
    <CourseProvider>
      <LessonProvider>
        <RouteWrapper />
      </LessonProvider>
    </CourseProvider>
  );
}
