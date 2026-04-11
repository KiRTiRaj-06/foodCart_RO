// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { apiOrderHistory } from "../api/api";

function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch this user's order history on mount
  useEffect(() => {
    apiOrderHistory()
      .then((data) => setOrders(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6">
      
      {/* Top action row */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exit to Menu
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* ── Profile Card ──────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full md:w-1/3 sticky top-24 shrink-0">
        <h2 className="text-zinc-100 font-bold text-lg mb-5 tracking-wide">My Profile</h2>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-black text-xl uppercase">
              {user?.username?.charAt(0) || "?"}
            </span>
          </div>
          <div>
            <p className="text-zinc-100 font-semibold text-base">{user?.username || "Unknown"}</p>
            <p className="text-zinc-500 text-xs">{user?.email || "—"}</p>
          </div>
        </div>

        {/* User details grid */}
        <div className="flex flex-col gap-4">
          <ProfileField label="Username" value={user?.username} />
          <ProfileField label="Email" value={user?.email} />
          <ProfileField label="Password" value="••••••••" />
          {user?.created_at && (
            <ProfileField
              label="Member Since"
              value={new Date(user.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
        </div>

        {/* Logout button */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* ── Order History ─────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full md:flex-1">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-zinc-100 font-bold text-lg tracking-wide">Order History</h2>
          {orders.length > 0 && (
            <span className="text-zinc-500 text-xs">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No previous orders found</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors duration-200"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-100 font-semibold text-sm">Order #{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "placed"
                        ? "bg-amber-500/15 text-amber-400"
                        : order.status === "completed"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-xs">
                    {new Date(order.placed_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(order.items || []).map((item, idx) => (
                    <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-lg">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Totals row */}
                <div className="flex items-center gap-4 text-xs border-t border-zinc-800 pt-3">
                  <span className="text-zinc-500">Subtotal: <span className="text-zinc-300">₹{order.subtotal}</span></span>
                  <span className="text-zinc-500">Tax: <span className="text-zinc-300">₹{order.tax}</span></span>
                  <span className="text-zinc-300 font-bold">Total: <span className="text-amber-400">₹{order.total}</span></span>
                  {order.table_number && (
                    <span className="ml-auto text-zinc-500">
                      Table <span className="text-amber-400 font-bold">{order.table_number}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      </div>
    </div>
  );
}

/* Reusable profile field row */
function ProfileField({ label, value }) {
  return (
    <div>
      <label className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">{label}</label>
      <div className="mt-1 bg-zinc-800/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 text-sm">
        {value || "—"}
      </div>
    </div>
  );
}

export default Profile;