// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // user shape: { name, email, tableNumber } or null when logged out

  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Call your real API here — stub for now
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError("");
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
      // const data = await res.json();
      const mockUser = { name: "Guest", email, tableNumber: 7 };
      setUser(mockUser);
    } catch (err) {
      setAuthError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ name, email, password }) => {
    setIsLoading(true);
    setAuthError("");
    try {
      // TODO: replace with real API call
      const mockUser = { name, email, tableNumber: null };
      setUser(mockUser);
    } catch (err) {
      setAuthError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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