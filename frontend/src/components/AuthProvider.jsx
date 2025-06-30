import { useEffect, useState } from "react";
import { AuthContext } from "../context/allContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      const now = Date.now();
      const expiry = user.exp * 1000;

      if (expiry > now) {
        setUser(user);
        scheduleLogout(user.exp);
      } else {
        logout();
      }
    }
  }, []);

  const scheduleLogout = (exp) => {
    const now = Date.now();
    const expirationTime = exp * 1000 - now;

    if (expirationTime > 0) {
      setTimeout(() => {
        logout();
        alert("Session expired. Please log in again.");
      }, expirationTime);
    } else {
      logout(); // Already expired
    }
  };

  const login = async (email, password, navigate) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const decoded = jwtDecode(data.token);

      const userData = {
        email,
        token: data.token,
        userId: decoded.userId,
        exp: decoded.exp,
        name: data.name,
        picture: data.picture,
      };

      setLocal(userData);
      navigate("/courses");
    } catch (error) {
      alert(`Login error: ${error.message}`);
    }
  };

  const signup = async (email, password, navigate) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      alert("Account created. Please log in.");
      navigate("/login");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currLesson");
  };
  function setLocal(user) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ setLocal, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
