import { useContext } from "react";
import { AuthContext } from "../context/allContext";

const useAuth = () => useContext(AuthContext);
export default useAuth;
