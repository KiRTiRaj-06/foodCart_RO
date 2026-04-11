// src/context/UserContext.jsx
import { createContext, useContext, useState,useEffect } from "react";
import {apiLogin, apiRegister, apiMe, apiLogout} from '../api/api'

const UserContext = createContext(null);


export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tableNumber , setTableNumber] = useState(0)

  // On mount — try to restore the session
  useEffect(() => {

    // Always attempt to restore user via apiMe() for HttpOnly cookies.
    // If it fails/401s, they just aren't logged in.
    apiMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);


  // LOGIN 
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const data = await apiLogin({ email, password });
      setUser(data.user);
      setTableNumber(Math.floor(Math.random() * 30 + 1));
      
      // Navigate to admin dash if robustly marked as admin in Postgres
      if (data.user.is_admin) {
        return "admin";
      }
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
      setUser(data.user);
      setTableNumber(Math.floor(Math.random() * 30 + 1));
    } catch (err) {
      setAuthError(err.message ||"Signup failed. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // Ignored
    }
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