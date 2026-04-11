import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute() {
  const { user, authLoading } = useUser();

  if (authLoading) return null; // Wait for auth resolution

  if (!user || !user.is_admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}