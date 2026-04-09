// src/context/UserContext.jsx
import { createContext, useContext, useState,useEffect } from "react";
import {apiLogin, apiRegister, apiMe} from '../api/api'

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // On mount — if a token exists in localStorage try to restore the session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token")); // token expired/invalid
  }, []);


  // Call your real API here — stub for now
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const data = await apiLogin({ email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message || "Login failed. Please try again.");
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
    } catch (err) {
      setAuthError(err.message ||"Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthError("");
  };

  const clearError = () => setAuthError("");

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        isLoading,
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