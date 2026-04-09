// src/components/admin/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import { apiAdminOrders } from "../../api/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiAdminOrders()
      .then((data) => setOrders(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;
  if (!orders || orders.length === 0) return <EmptyState text="No orders placed yet" />;

  return (
    <div>
      <SectionHeader title="All Orders" count={orders.length} />
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors duration-200"
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
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                {order.table_number && (
                  <span>Table <span className="text-amber-400 font-bold">{order.table_number}</span></span>
                )}
                <span>{new Date(order.placed_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-400 text-[10px] font-bold uppercase">{order.username?.charAt(0) || "?"}</span>
              </div>
              <span className="text-zinc-400 text-xs">{order.username || "Unknown"}</span>
              <span className="text-zinc-600 text-xs">({order.email})</span>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(order.items || []).map((item, idx) => (
                <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-lg">
                  {item.name} × {item.quantity}
                </span>
              ))}
            </div>

            {/* Totals */}
            <div className="flex items-center gap-4 text-xs border-t border-zinc-800 pt-3">
              <span className="text-zinc-500">Subtotal: <span className="text-zinc-300">₹{order.subtotal}</span></span>
              <span className="text-zinc-500">Tax: <span className="text-zinc-300">₹{order.tax}</span></span>
              <span className="text-zinc-300 font-bold">Total: <span className="text-amber-400">₹{order.total}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-zinc-100 font-semibold text-sm tracking-wide">
        {title}<span className="ml-2 text-zinc-500 font-normal">({count})</span>
      </h2>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-zinc-500 text-sm">{text}</p>
    </div>
  );
}
