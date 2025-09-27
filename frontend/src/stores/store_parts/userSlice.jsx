import { jwtDecode } from "jwt-decode";

const creatUserStore = (set, get) => {
  async function loginOrSignup(method, email, password) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/" + method, {
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
    username: null,
    setUsername: (newName) => set({ username: newName }),
    getUsername: async () => {
      if (!get().username) {
        const res = await get().fetchWithAuth(
          "http://localhost:5000/api/user/getUsername"
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
          const res = await get().fetchWithAuth(
            "http://localhost:5000/api/user/getUser"
          );
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
            email: email,
            exp: decoded.exp,
          };
          set({ pfpCloudData: pfpCloudData });
          set({ user: user });
        } catch (error) {
          console.error("Error during user data retrieval:", error);
          get().logout();
        } finally {
          set({ loadingUser: false });
        }
      }
    },
    login: async (email, password) => loginOrSignup("login", email, password),
    signup: async (email, password) => loginOrSignup("signup", email, password),
    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("currLesson");
      localStorage.removeItem("token");
      get().navigate("/login");
      get().setUser(null);
    },
  };
};

export default creatUserStore;
