import { useContext } from "react";
import { CoursesContext } from "../context/allContext";

const useCourses = () => useContext(CoursesContext);
export default useCourses;
