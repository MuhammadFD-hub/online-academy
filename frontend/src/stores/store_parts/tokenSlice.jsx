const creatTokenStore = (set, get) => {
  return {
    loadingToken: null,
    setLoadingToken: (boolVal) => {
      set({ loadingToken: boolVal });
    },
    refreshAccessToken: async () => {
      const res = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return true;
    },
    fetchWithAuth: async (url, options = {}) => {
      let token = localStorage.getItem("token");

      let res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        const refreshed = await get().refreshAccessToken();
        if (!refreshed) {
          throw new Error("403: Unauthorized - please log in again");
        }

        token = localStorage.getItem("token");
        res = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return res;
    },
  };
};
export default creatTokenStore;
