// src/components/ItemContainer.jsx
import React from "react";

export default  function ItemContainer({item, quantity = 0, onAdd, onRemove  }) {
  
  const hasDiscount = item?.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(item.price - (item.price * item.discount) / 100)
    : item?.price;

  return (
    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:scale-[1.015] flex flex-col relative">

      {/* ── Image — exact same height as original MenuCard ── */}
      <div className="h-44 bg-zinc-900 relative overflow-hidden">

        {item?.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Veg / Non-veg dot — top left */}
        <div className={`absolute top-3 left-3 w-4 h-4 border-2 rounded-sm flex items-center justify-center ${item?.veg ? "border-green-500" : "border-red-500"}`}>
          <div className={`w-2 h-2 rounded-full ${item?.veg ? "bg-green-500" : "bg-red-500"}`} />
        </div>

        {/* Discount ribbon takes priority over badge */}
        {hasDiscount ? (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
            {item.discount}% OFF
          </span>
        ) : item?.badge ? (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950">
            {item.badge}
          </span>
        ) : null}

        {/* Unavailable overlay */}
        {!item?.available && (
          <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Unavailable</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-3">

        {/* Name + Description */}
        <div>
          <h3 className="text-white font-bold text-base text-center md:text-lg mb-1">{item?.name || "Item Name"}</h3>
          <p className="text-zinc-400 text-xs leading-relaxed text-center line-clamp-2">{item?.descrip || ""}</p>
        </div>

        {/* Price + Buttons row */}
        <div className="flex items-center justify-between gap-2">

          {/* Price */}
          <div className="flex flex-col gap-0.5 min-w-0">
            {hasDiscount ? (
              <>
                {/* Discounted price + % pill on same line */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-amber-400 font-black text-base">₹{discountedPrice}</span>
                  {/* Original price struck through */}
                  <span className="text-zinc-400  line-through  ">₹{item.price}</span>
                </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {item.discount}% off
                  </span>
              </>
            ) : (
              <span className="text-amber-400 font-black text-base">₹{item?.price ?? 0}</span>
            )}
          </div>

          {/* Buttons */}
          <div className={`flex items-center gap-1.5 shrink-0 ${!item?.available ? "opacity-40 pointer-events-none" : ""}`}>

            {/* Remove button — only visible when quantity > 0 */}
            {quantity > 0 && (
              <button
                onClick={() => onRemove?.(item)}
                className="flex items-center gap-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/5 hover:border-red-500/40 text-zinc-300 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-300 active:scale-95 backdrop-blur-md"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
                {/* quantity count between the buttons */}
              </button>
            )}

            {/* Quantity badge between buttons */}
            {quantity > 0 && (
              <span className="text-amber-400 font-black text-sm w-5 text-center leading-none">
                {quantity}
              </span>
            )}

            {/* Add button */}
            <button
              onClick={() => onAdd?.(item)}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-400 text-white hover:text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 border border-white/5 hover:border-amber-300/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] ml-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}