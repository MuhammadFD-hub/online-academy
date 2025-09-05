const creatNavStore = (set, get) => {
  return {
    navigate: null,
    setNavigate: (nav) => {
      set({ navigate: nav });
    },
  };
};
export default creatNavStore;
