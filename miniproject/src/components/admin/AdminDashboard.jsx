// src/components/admin/AdminDashboard.jsx
// Layout shell — sidebar with nav links + Outlet for child routes
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const NAV_ITEMS = [
  { label: "Menu Details",  path: "/admin"         },
  { label: "User Details",  path: "/admin/users"   },
  { label: "Order History", path: "/admin/orders"  },
  { label: "Upload Menu",   path: "/admin/uploads" },
];

export default function AdminDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-zinc-950 font-black text-sm">A</span>
          </div>
          <div>
            <h1 className="text-zinc-100 font-bold text-lg tracking-wide">Admin Dashboard</h1>
            <p className="text-zinc-500 text-xs">Manage your restaurant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-zinc-500 text-xs hidden sm:block">
              Logged in as <span className="text-amber-400 font-semibold">{user.username}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </header>

      {/* ── Main body: sidebar + content ────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-50 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 shrink-0">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold px-3 mb-3">Sections</p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent"
                  }`
                }
              >
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content area — child routes render here */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}