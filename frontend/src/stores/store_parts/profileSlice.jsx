const creatProfileStore = (set, get) => ({
  cropperImage: null,
  setCropperImage: (newImage) => set({ cropperImage: newImage }),
  pfpCloudData: null,
  setPfpCloudData: (newImage) => set({ pfpCloudData: newImage }),
  bgCloudData: null,
  setBgCloudData: (newImage) => set({ bgCloudData: newImage }),
  isPfpChanging: false,
  setIsPfpChanging: (value) => set({ isPfpChanging: value }),
  personalForm: null,
  setPersonalForm: (newForm) => set({ personalForm: newForm }),
  croppedAreaPixels: null,
  setCroppedAreaPixels: (pixels) => set({ croppedAreaPixels: pixels }),
  cropBgFocus: { focus: "focusMid" },
  setCropBgFocus: (newPosition) => set({ cropBgFocus: newPosition }),
  selectFocus: { focus: null },
  setSelectFocus: (newPosition) => set({ selectFocus: newPosition }),
  getBgFocus: async () => {
    const res = await get().fetchWithAuth(
      "http://localhost:5000/api/user/getBgFocus"
    );
    const data = await res.json();
    const fetchedFocus = await data.focus;
    let bgFocus = "focusMid";
    if (fetchedFocus === 1) {
      bgFocus = "focusTop";
    } else if (fetchedFocus === 3) {
      bgFocus = "focusBot";
    }
    set({ selectFocus: { focus: bgFocus } });
  },
  postBgFocus: async (selectFocus) => {
    try {
      let bgFocus = 2;
      const focus = selectFocus.focus;
      if (focus === "focusTop") {
        bgFocus = 1;
      } else if (focus === "focusBot") {
        bgFocus = 3;
      }
      const res = await get().fetchWithAuth(
        "http://localhost:5000/api/user/updateBgFocus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bgFocus: bgFocus }),
        }
      );
      if (!res.ok) throw new Error("Somthing went wrong");

      set({ selectFocus: { focus: focus } });
    } catch (error) {
      console.error("postBgFocus failed:", error.message);
    }
  },
  imgOverlayCloudData: null,
  setImgOverlayCloudData: (newImage) => set({ imgOverlayCloudData: newImage }),
});

export default creatProfileStore;
