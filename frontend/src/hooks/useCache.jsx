import { useContext } from "react";
import { CacheContext } from "../context/allContext";

function useCache() {
  return useContext(CacheContext);
}
export default useCache;
