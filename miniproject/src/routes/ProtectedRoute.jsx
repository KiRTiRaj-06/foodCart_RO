import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAdmin = localStorage.getItem("admin");

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}