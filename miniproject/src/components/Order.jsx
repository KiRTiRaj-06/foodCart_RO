// src/components/Order.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const time = Math.floor(Math.random() *(30-18)+18)
  // If someone navigates here directly without placing an order
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-24">
        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">No recent order found</p>
        <button
          onClick={() => navigate("/menu")}
          className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors"
        >
          ← Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6">

        {/* Success checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Thank you message */}
        <div className="text-center">
          <h2 className="text-zinc-100 font-bold text-2xl mb-2">Thank You! 🎉</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your order has been placed successfully.
            <br />
            It will be on your table in about <span className="text-amber-400 font-bold">{time} minutes</span>.
          </p>
        </div>

        {/* Order details card */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-zinc-300 font-semibold text-xs uppercase tracking-widest">Order Details</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
              #{order.id}
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">{item.name}</span>
                  <span className="text-zinc-600 text-xs">× {item.quantity}</span>
                </div>
                <span className="text-zinc-300">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-zinc-800 pt-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>GST (5%)</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="border-t border-zinc-700 my-1" />
            <div className="flex justify-between text-base font-bold text-zinc-100">
              <span>Total Paid</span>
              <span className="text-amber-400">₹{order.total}</span>
            </div>
          </div>

          {/* Table info */}
          {order.table_number && (
            <div className="flex items-center gap-2 bg-zinc-800/50 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-zinc-400 text-xs">
                Delivering to Table <span className="text-amber-400 font-bold">{order.table_number}</span>
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 bg-green-500/10 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400 text-xs font-medium">
              Order {order.status} — Being prepared by our chefs
            </span>
          </div>
        </div>

        {/* Back to menu */}
        <button
          onClick={() => navigate("/menu")}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}