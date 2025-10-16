import { create } from "zustand";
import creatProfileStore from "./store_parts/profileSlice";
import creatUserStore from "./store_parts/userSlice";
import creatNavStore from "./store_parts/navSlice";
import creatTokenStore from "./store_parts/tokenSlice";
import creatCoursesStore from "./store_parts/coursesSlice";
import creatLessonStore from "./store_parts/lessonSlice";
import creatCacheStore from "./store_parts/cacheSlice";

const UseStore = create((set, get) => ({
  ...creatTokenStore(set, get),
  ...creatNavStore(set, get),
  ...creatProfileStore(set, get),
  ...creatUserStore(set, get),
  ...creatCoursesStore(set, get),
  ...creatLessonStore(set, get),
  ...creatCacheStore(set, get),
}));

export default UseStore;
