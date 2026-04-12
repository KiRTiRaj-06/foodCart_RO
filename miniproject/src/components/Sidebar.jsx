// src/components/Sidebar.jsx
import { useCart } from "../context/CartContext";

export default function Sidebar({ activePage, onNavigate }) {
    const {cartCount , orderTotal} = useCart()
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-20 lg:w-56 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col justify-between py-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Nav Links */}
      <nav className="flex flex-col gap-2 px-3">

        {/* Menu Button */}
        <button
          onClick={() => onNavigate("menu")}
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
            activePage === "menu"
              ? "bg-linear-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
          }`}
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-sm font-medium hidden lg:block">Menu</span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => onNavigate("cart")}
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
            activePage === "cart"
              ? "bg-linear-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
          }`}
        >
          {/* Cart Icon */}
          <div className="relative shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-sm font-medium hidden lg:block">Cart</span>
        </button>


        {/* Divider */}
        <div className="my-2 border-t border-white/5" />

      </nav>
      
      {/* Total Section */}
      <div className=" flex flex-col gap-3 px-3">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center lg:items-start gap-1 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold hidden lg:block">
            Total
          </span>
          <svg
            className="w-5 h-5 text-zinc-500 lg:hidden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"
            />
          </svg>
          <span className="text-amber-400 font-black text-base hidden lg:block">
            ₹{orderTotal?.toFixed(2) || "0.00"}
          </span>
        </div>
      
        {/* Place Order Button */}
      <button
          onClick={() => onNavigate("cart")}
          className="flex items-center justify-center gap-3 rounded-xl px-3 py-3 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-95 border border-amber-300/50 hover:border-white/50"

        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm font-bold hidden lg:block">Place Order</span>
        </button>
        </div>
    </aside>
  );
}
