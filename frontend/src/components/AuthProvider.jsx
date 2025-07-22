import { useEffect, useState } from "react";
import { AuthContext } from "../context/allContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const scheduleLogout = (exp) => {
      const now = Date.now();
      const expirationTime = exp - now;
      if (expirationTime > 0) {
        setTimeout(() => {
          logout();
          alert("Session expired. Please log in again.");
        }, expirationTime);
      } else logout();
    };
    if (user) {
      const now = Date.now(); // in milliseconds
      const expiry = user.exp * 1000; // converted seconds to milliseconds
      if (expiry > now) scheduleLogout(expiry);
      else logout();
    }
  }, []);

  async function loginOrSignup(method, email, password) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/" + method, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert("session expired. Please log in again.", errorData.message);
          logout();
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
      navigate("/courses");
    } catch (error) {
      alert(error.message);
    }
  }

  async function login(email, password) {
    loginOrSignup("login", email, password);
  }
  async function signup(email, password) {
    loginOrSignup("signup", email, password);
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currLesson");
    localStorage.removeItem("token");
    navigate("/");
  }

  function setLocal(token, email) {
    const decoded = jwtDecode(token);
    const user = {
      email,
      userId: decoded.userId,
      exp: decoded.exp,
      // will be used for future features
      // name: data.name,
      // picture: data.picture,
    };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
  }
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <AuthContext.Provider value={{ setLocal, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
