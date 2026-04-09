// src/App.jsx
// Single source of truth for all routes.
// main.jsx only renders <App /> wrapped in providers.
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

// Layouts
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";

// Route guards
import AuthGuard from "./routes/AuthGuard";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./components/Login";
import Signup from "./components/Signup";
import MenuItems from "./components/MenuItems";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Profile from "./components/Profile";
import WelcomeHero from "./components/WelcomeHero"
// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import AllMenuDetails from "./components/admin/AllMenuDetails";
import AllUserDetails from "./components/admin/AllUserDetails";
import OrderHistory from "./components/admin/OrderHistory";
import MenuUploadForm from "./components/admin/menu_upload_form";

import "./App.css";

// Small wrapper: redirects logged-in users away from public pages
function RedirectIfAuth({ children }) {
  const { isLoggedIn, authLoading } = useUser();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/menu" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* ── Home page — accessible to everyone ────────────── */}
      <Route element={<PublicLayout />}>
        <Route index element={<WelcomeHero />} />
      </Route>

      {/* ── Login / Signup — redirect if already logged in ── */}
      <Route
        element={
          <RedirectIfAuth>
            <PublicLayout />
          </RedirectIfAuth>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* ── Authenticated pages (Header + Sidebar + Footer) ── */}
      <Route element={<AuthGuard />}>
      
        <Route element={<AppLayout />}>
          <Route path="menu" element={<MenuItems />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order" element={<Order />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin — must be logged in + admin flag in localStorage */}
        <Route path="admin" element={<ProtectedRoute />}>
          <Route element={<AdminDashboard />}>
            <Route index element={<AllMenuDetails />} />
            <Route path="users" element={<AllUserDetails />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="uploads" element={<MenuUploadForm />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all — redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}