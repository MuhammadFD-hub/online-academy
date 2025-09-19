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

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          console.error(`${res.status} ${res.statusText} ${data.error}`);
          alert("Session Expired");
          get().logout();
          return;
        }
        throw new Error(
          `${res.status}: ${res.statusText}. ${data.error || ""}`
        );
      }

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
