import { useContext } from "react";
import { LessonContext } from "../context/allContext";

const useLesson = () => useContext(LessonContext);
export default useLesson;
