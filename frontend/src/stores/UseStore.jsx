import { create } from "zustand";
import creatProfileStore from "./store_parts/profileSlice";

const UseStore = create((set, get) => ({
  ...creatProfileStore(set, get),
}));

export default UseStore;
