import { useContext } from "react";
import { CourseContext } from "../context/allContext";

const useCourse = () => useContext(CourseContext);
export default useCourse;
