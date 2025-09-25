import { jwtDecode } from "jwt-decode";
const creatTokenStore = (set, get) => {
  let refreshPromise = null;
  function validToken(token) {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      console.error("Invalid token:", err);
      return false;
    }
  }
  return {
    refreshAccessToken: async () => {
      if (refreshPromise) return refreshPromise;
      refreshPromise = (async () => {
        try {
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
              return false;
            }
            throw new Error(
              `${res.status}: ${res.statusText}. ${data.error || ""}`
            );
          }
          localStorage.setItem("token", data.token);
          return true;
        } finally {
          refreshPromise = null;
        }
      })();

      return refreshPromise;
    },
    fetchWithAuth: async (url, options = {}) => {
      let token = localStorage.getItem("token");
      if (!validToken(token)) {
        const refreshed = await get().refreshAccessToken();
        if (!refreshed) {
          throw new Error("Unauthorized: session expired");
        }
        token = localStorage.getItem("token");
      }

      let res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

      // Fallback
      if (res.status === 401 || res.status === 403) {
        await get().refreshAccessToken();
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
