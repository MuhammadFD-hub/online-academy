import { create } from "zustand";

const UseProfileStore = create((set) => ({
  cropperImage: null,
  setCropperImage: (newImage) => set({ cropperImage: newImage }),
  pfpCloudData: null,
  setPfpCloudData: (newImage) => set({ pfpCloudData: newImage }),
  bgCloudData: null,
  setBgCloudData: (newImage) => set({ bgCloudData: newImage }),
  isPfpChanging: false,
  setIsPfpChanging: (value) => set({ isPfpChanging: value }),
  personalForm: {},
  setPersonalForm: (newForm) => set({ personalForm: newForm }),
}));

export default UseProfileStore;
