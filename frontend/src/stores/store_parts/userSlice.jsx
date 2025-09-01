const creatUserStore = (set, get) => ({
  username: null,
  setUsername: (newName) => set({ username: newName }),
  getUsername: async (token) => {
    if (!get().username) {
      const res = await fetch("http://localhost:5000/api/user/getUsername", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const username = await data.username;
      set({ username: username });
    }
  },
});

export default creatUserStore;
