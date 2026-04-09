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
        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-100 font-semibold text-sm tracking-wide">
          Your Order
          <span className="ml-2 text-zinc-500 font-normal">({cartItems.length} items)</span>
        </h2>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors duration-200"
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
        <h3 className="text-zinc-300 font-semibold text-xs uppercase tracking-widest">
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
          className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {orderLoading ? "Placing Order..." : "Confirm Order →"}
        </button>
      </div>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors duration-200">
      {/* Color Swatch / Thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-xl">
        <img src={item.image} alt="" className="w-10 h-10 rounded-3xl" />
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
          className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-sm transition-colors duration-150 active:scale-90"
        >
          −
        </button>
        <span className="text-zinc-100 font-bold text-sm w-5 text-center">{item.quantity}</span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 flex items-center justify-center text-sm transition-all duration-150 active:scale-90"
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
