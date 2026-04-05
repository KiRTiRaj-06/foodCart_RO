import React from 'react'
import { Link } from 'react-router-dom';

    const CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Drinks"];

    const MENU_ITEMS = [
        { id: 1, name: "Paneer Tikka", category: "Starters", price: 220, desc: "Grilled cottage cheese with spiced marinade", badge: "Popular", veg: true },
        { id: 2, name: "Chicken Wings", category: "Starters", price: 280, desc: "Crispy wings tossed in tangy sauce", badge: null, veg: false },
        { id: 3, name: "Dal Makhani", category: "Mains", price: 180, desc: "Slow-cooked black lentils in buttery gravy", badge: "Chef's Pick", veg: true },
        { id: 4, name: "Butter Chicken", category: "Mains", price: 320, desc: "Tender chicken in rich tomato-cream sauce", badge: "Popular", veg: false },
        { id: 5, name: "Gulab Jamun", category: "Desserts", price: 80, desc: "Soft milk-solid dumplings in rose syrup", badge: null, veg: true },
        { id: 6, name: "Mango Lassi", category: "Drinks", price: 90, desc: "Chilled yogurt blended with fresh mango", badge: null, veg: true },
        { id: 7, name: "Veg Biryani", category: "Mains", price: 200, desc: "Fragrant basmati with seasonal vegetables", badge: null, veg: true },
        { id: 8, name: "Masala Chai", category: "Drinks", price: 40, desc: "Spiced Indian milk tea", badge: null, veg: true },
    ];

export default function MenuItems( {searchedItem , onAddToCart , onRemoveToCart}) {

    const [activeCategory, setActiveCategory] = React.useState("All")
    
    const filtered = MENU_ITEMS.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(
            (typeof searchedItem === "string" ? searchedItem : "").toLowerCase() );
        return matchesCategory && matchesSearch;
    });

    return(
        <div className="flex flex-col h-full">
              {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            </div>
            
              {/* Section Label */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-zinc-100 font-semibold text-sm tracking-wide">
                  {activeCategory === "All" ? "All Dishes" : activeCategory}
                  <span className="ml-2 text-zinc-500 font-normal">({filtered.length})</span>
                </h2>
            </div>
            
              {/* Items Grid */}
            {filtered.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-3">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                <p className="text-zinc-500 text-sm">No dishes found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-1">
                    {filtered.map((item) => (
                        <MenuCard key={item.id} item={item} onAdd={onAddToCart} onRemove={onRemoveToCart}/>
                    ))}
                </div>
                )}
        </div>
    )
}

function MenuCard({ item, onAdd ,onRemove}) {
    return (
        <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200 hover:shadow-xl hover:shadow-black/30">
          {/* Image Placeholder */}
            <div className="h-36 bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-30">🍽️</span>
            </div>
        
            {/* Veg / Non-Veg Indicator */}
            <div className={`absolute top-3 left-3 w-4 h-4 border-2 rounded-sm flex items-center justify-center ${item.veg ? "border-green-500" : "border-red-500"}`}>
              <div className={`w-2 h-2 rounded-full ${item.veg ? "bg-green-500" : "bg-red-500"}`} />
            </div>
        
            {/* Badge */}
            {item.badge && (
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950">
                {item.badge}
              </span>
            )}
            </div>
        
          {/* Info */}
            <div className="p-4 flex flex-col gap-3">
            <div>
                <h3 className="text-zinc-100 font-semibold text-sm">{item.name}</h3>
                <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
            </div>
        
            <div className="flex items-center justify-between">
                <span className="text-amber-400 font-black text-base">₹{item.price}</span>
                    <button
                    onClick={() => onAdd(item)}
                    className="flex items-center gap-1.5 bg-zinc-800 hover:bg-amber-500 text-zinc-300 hover:text-zinc-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
                    >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                    </button>
                </div>
            </div>
        </div>
    );
}