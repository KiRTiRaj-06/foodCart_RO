import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { user, authLoading, logout } = useUser();
  const [redirecting, setRedirecting] = useState(false);
  const [bounced, setBounced] = useState(false);

  useEffect(() => {
    // If auth is finished and we have a valid user who is NOT an admin
    if (!authLoading && user && !user.is_admin) {
      const strikes = parseInt(sessionStorage.getItem("adminStrikes") || "0", 10) + 1;
      sessionStorage.setItem("adminStrikes", strikes.toString());

      if (strikes >= 5) {
        // Strike limit reached, completely unauthorize rogue access by logging out
        sessionStorage.removeItem("adminStrikes");
        logout().then(() => setRedirecting(true));
      } else {
        // Just bounce them gracefully without logging out
        setBounced(true);
      }
    }
  }, [user, authLoading, logout]);

  if (authLoading) return null; // Wait for auth resolution

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_admin) {
    if (redirecting) return <Navigate to="/login" replace />;
    if (bounced) return <Navigate to="/menu" replace />;
    return null; // Render nothing while waiting for effect
  }

  return <Outlet />;
}