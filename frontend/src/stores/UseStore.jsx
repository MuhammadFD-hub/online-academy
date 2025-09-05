import { create } from "zustand";
import creatProfileStore from "./store_parts/profileSlice";
import creatUserStore from "./store_parts/userSlice";
import creatNavStore from "./store_parts/navSlice";

const UseStore = create((set, get) => ({
  ...creatNavStore(set, get),
  ...creatProfileStore(set, get),
  ...creatUserStore(set, get),
}));

export default UseStore;
