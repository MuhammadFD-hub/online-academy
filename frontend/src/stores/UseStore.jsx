import { create } from "zustand";
import creatProfileStore from "./store_parts/profileSlice";
import creatUserStore from "./store_parts/userSlice";
import creatNavStore from "./store_parts/navSlice";
import creatTokenStore from "./store_parts/tokenSlice";
import creatCoursesStore from "./store_parts/coursesSlice";

const UseStore = create((set, get) => ({
  ...creatTokenStore(set, get),
  ...creatNavStore(set, get),
  ...creatProfileStore(set, get),
  ...creatUserStore(set, get),
  ...creatCoursesStore(set, get),
}));

export default UseStore;
