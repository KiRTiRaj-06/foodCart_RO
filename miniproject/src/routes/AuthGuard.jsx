// src/routes/AuthGuard.jsx
// Protects routes that require authentication.
// Waits for authLoading to finish before deciding.
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AuthGuard() {
  const { isLoggedIn, authLoading } = useUser();

  // Still verifying token — show a loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — redirect to landing page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
