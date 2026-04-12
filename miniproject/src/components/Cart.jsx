// src/components/Cart.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    subtotal,
    tax,
    orderTotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    placeOrder,
    orderLoading,
    orderError,
  } = useCart();
  const navigate = useNavigate();
  const [placingError, setPlacingError] = useState("");

  const handleConfirmOrder = async () => {
    setPlacingError("");
    try {
      const order = await placeOrder();       // calls POST /api/order/place
      navigate("/order", { state: { order } }); // pass order data to Order page
    } catch (err) {
      setPlacingError(err.message || "Failed to place order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-24">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.03)] backdrop-blur-2xl">
          <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <p className="text-zinc-300 font-semibold text-sm">Your cart is empty</p>
          <p className="text-zinc-600 text-xs mt-1">Add items from the menu to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Cart Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h2 className="text-white font-bold text-xl tracking-tight">
          Your Order
          <span className="ml-2 text-zinc-400 font-normal text-sm tracking-normal">({cartItems.length} items)</span>
        </h2>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors duration-200 uppercase tracking-widest font-semibold"
        >
          Clear all
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest border-b border-white/5 pb-3">
          Bill Summary
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>GST (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-zinc-700 my-1" />
          <div className="flex justify-between text-base font-black text-zinc-100">
            <span>Total</span>
            <span className="text-amber-400">₹{orderTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Error message */}
        {(placingError || orderError) && (
          <p className="text-red-400 text-xs text-center">{placingError || orderError}</p>
        )}

        <button
          onClick={handleConfirmOrder}
          disabled={orderLoading}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-300/50 hover:border-white/50"
        >
          {orderLoading ? "Placing Order..." : "Confirm Order →"}
        </button>
      </div>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-3 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] group relative">
      {/* Color Swatch / Thumbnail */}
      <div className="w-14 h-14 rounded-[1rem] bg-white/5 flex items-center justify-center shrink-0 text-xl border border-white/10 overflow-hidden shadow-inner">
        <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-zinc-100 text-sm font-medium truncate">{item.name}</p>
        <p className="text-amber-400 text-xs font-bold mt-0.5">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-8 h-8 rounded-[0.6rem] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-zinc-300 flex items-center justify-center text-sm transition-all duration-300 active:scale-90 shadow-sm"
        >
          −
        </button>
        <span className="text-zinc-100 font-bold text-sm w-5 text-center">{item.quantity}</span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-8 h-8 rounded-[0.6rem] bg-white/5 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-amber-400 border border-white/5 hover:border-amber-300/50 hover:text-zinc-950 text-zinc-300 flex items-center justify-center text-sm transition-all duration-300 active:scale-90 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-1 text-zinc-600 hover:text-red-400 transition-colors duration-150"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
