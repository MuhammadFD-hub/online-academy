import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const creatUserStore = (set, get) => {
  async function loginOrSignup(method, email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/` + method, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const Method = capitalizeFirst(method);
        const errorData = await response.json();
        throw new Error(
          `${Method} error: ${errorData.error || `${Method} failed`}`
        );
      }
      const data = await response.json();
      setLocal(data.token, email);
      set({ pfpCloudData: data.pfpCloudData });
      set({ username: data.username });
      get().navigate("/courses");
    } catch (error) {
      alert(error.message);
    }
  }
  function setLocal(token, email) {
    const decoded = jwtDecode(token);
    const user = {
      email,
      userId: decoded.userId,
      exp: decoded.exp,
    };
    localStorage.setItem("token", token);
    get().setUser(user);
  }
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    email: null,
    setEmail: (newEmail) => set({ email: newEmail }),
    getEmail: async () => {
      if (!get().email) {
        const res = await get().fetchWithAuth(`${API_URL}/api/user/getEmail`);
        const data = await res.json();
        const email = await data.email;
        set({ email: email });
      }
    },
    username: null,
    setUsername: (newName) => set({ username: newName }),
    getUsername: async () => {
      if (!get().username) {
        const res = await get().fetchWithAuth(
          `${API_URL}/api/user/getUsername`
        );
        const data = await res.json();
        const username = await data.username;
        set({ username: username });
      }
    },
    user: null,
    setUser: (newUser) => set({ user: newUser }),
    loadingUser: true,
    getUser: async () => {
      if (!get().user) {
        set({ loadingUser: true });
        try {
          const res = await get().fetchWithAuth(`${API_URL}/api/user/getUser`);
          const data = await res.json();
          if (!res.ok)
            throw new Error(
              `${res.status}: ${res.statusText}. ${data.error || ""}`
            );

          let token = localStorage.getItem("token");
          const decoded = jwtDecode(token);
          const email = await data.email;
          const pfpCloudData = await data.pfpCloudData;

          const user = {
            userId: decoded.userId,
            exp: decoded.exp,
          };
          set({ pfpCloudData: pfpCloudData });
          set({ user: user });
          set({ email: email });
        } catch (error) {
          console.error("Error during user data retrieval:", error);
          await get().logout();
        } finally {
          set({ loadingUser: false });
        }
      }
    },
    login: async (email, password) => {
      loginOrSignup("login", email, password);
    },
    signup: async (email, password) => loginOrSignup("signup", email, password),
    logout: async () => {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout request failed", err);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("currLesson");
      set({ courses: null });
      set({ lesson: null });
      set({ cachedLessons: new Map() });
      set({ fullLessons: new Map() });
      set({ cropperImage: null });
      set({ pfpCloudData: null });
      set({ bgCloudData: null });
      set({ personalForm: null });
      get().navigate("/login");
      get().setUser(null);
    },
  };
};

export default creatUserStore;
