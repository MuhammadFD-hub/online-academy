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
        if (response.status === 401) {
          const errorData = await response.json();
          alert("session expired. Please log in again.", errorData.message);
          get().logout();
          return;
        }

        const Method = capitalizeFirst(method);
        const errorData = await response.json();
        throw new Error(
          `${Method} error: ${errorData.error || `${Method} failed`}`
        );
      }
      const data = await response.json();
      setLocal(data.token, email);
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
    get().setPfpCloudData(decoded.pfpCloudData);
    get().setUser(user);
  }
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    username: null,
    setUsername: (newName) => set({ username: newName }),
    getUsername: async (token) => {
      if (!get().username) {
        const res = await get().fetchWithAuth(
          "http://localhost:5000/api/user/getUsername",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        const username = await data.username;
        set({ username: username });
      }
    },
    user: null,
    setUser: (newUser) => set({ user: newUser }),
    getUser: async (token) => {
      if (!get().user) {
        const res = await get().fetchWithAuth(
          "http://localhost:5000/api/user/getUser",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        const email = await data.email;
        const pfpCloudData = await data.pfpCloudData;
        const decoded = jwtDecode(token);
        const user = { userId: decoded.userId, email: email, exp: decoded.exp };
        set({ user: user });
        get().setPfpCloudData(pfpCloudData);
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
