// src/context/UserContext.jsx
import { createContext, useContext, useState,useEffect } from "react";
import {apiLogin, apiRegister, apiMe} from '../api/api'

const UserContext = createContext(null);

// Admin credentials from .env (VITE_ prefix required by Vite)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASS  = import.meta.env.VITE_ADMIN_PASS;

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tableNumber , setTableNumber] = useState(0)

  // On mount — if a token exists in localStorage try to restore the session
  useEffect(() => {
    // Restore admin session
    const isAdmin = localStorage.getItem("admin");
    if (isAdmin) {
      setUser({ id: 0, username: "Admin", email: ADMIN_EMAIL });
      setAuthLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    apiMe()
    .then((data) => {
      if (data && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
      }
    })
    .finally(() => setAuthLoading(false));
  }, []);


  // LOGIN 
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      localStorage.setItem("admin", "true");
      setUser({ id: 0, username: "Admin", email: ADMIN_EMAIL });
      setIsLoading(false);
      return "admin";   // signal to Login.jsx to navigate to /admin
    }

    if (email === ADMIN_EMAIL) {
      setAuthError("Invalid admin password");
      setIsLoading(false);
      throw new Error("Invalid admin password");
    }

    try {
      const data = await apiLogin({ email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setTableNumber(Math.floor(Math.random() * 30 + 1));
    } catch (err) {
      setAuthError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ name, email, password }) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const data = await apiRegister({ username: name, email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setTableNumber(Math.floor(Math.random() * 30 + 1));
    } catch (err) {
      setAuthError(err.message ||"Signup failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setUser(null);
    setAuthError("");
    setTableNumber(0);
  };

  const clearError = () => setAuthError("");

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        tableNumber,
        isLoggedIn,
        isLoading,
        authLoading,
        authError,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}