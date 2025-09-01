import { create } from "zustand";
import creatProfileStore from "./store_parts/profileSlice";
import creatUserStore from "./store_parts/userSlice";

const UseStore = create((set, get) => ({
  ...creatProfileStore(set, get),
  ...creatUserStore(set, get),
}));

export default UseStore;
