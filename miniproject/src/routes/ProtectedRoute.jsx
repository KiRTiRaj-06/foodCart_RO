import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { user, authLoading } = useUser();

  if (authLoading) return null; // Wait for session recovery

  // 1. Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but not an admin
  if (user.is_admin !== true) {
    // Graceful bounce to menu rather than aggressive logout
    return <Navigate to="/menu" replace />;
  }

  // 3. User is an admin — proceed to children (Admin Dashboard)
  return <Outlet />;
}