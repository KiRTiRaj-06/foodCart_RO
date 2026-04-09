// src/components/Sidebar.jsx
import { useCart } from "../context/CartContext";

export default function Sidebar({ activePage, onNavigate }) {
    const {cartCount , orderTotal} = useCart()
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-20 lg:w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between py-6 z-40">
      {/* Nav Links */}
      <nav className="flex flex-col gap-2 px-3">

        {/* Menu Button */}
        <button
          onClick={() => onNavigate("menu")}
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
            activePage === "menu"
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent"
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
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
            activePage === "cart"
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent"
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
        <div className="my-2 border-t border-zinc-800" />

      </nav>
      
      {/* Total Section */}
      <div className=" flex flex-col gap-3 px-3">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 flex flex-col items-center lg:items-start gap-1">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <span className="text-amber-400 font-black text-base hidden lg:block">
            ₹{orderTotal?.toFixed(2) || "0.00"}
          </span>
        </div>
      
        {/* Place Order Button */}
      <button
          onClick={() => onNavigate("cart")}
          className="flex items-center gap-3 rounded-xl px-3 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
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
