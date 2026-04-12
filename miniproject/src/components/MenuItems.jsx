// src/components/MenuItems.jsx
import React, { useEffect, useState } from 'react';

import ItemContainer from './ItemContainer'
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';

const CATEGORIES = ["All", "Starters","Soups","Chinese","Mains","Biryani","Drinks","Rolls & Wraps","Waffles & Cake","Desserts"];



export default function MenuItems() {
    const {menu, menuLoading, menuError, searchedItem , activeCategory, updateCategory} = useMenu();
    const {addToCart, removeFromCart, getQuantity } = useCart();
    
    const filtered = menu.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name
        .toLowerCase()
        .includes((typeof searchedItem === "string" ? searchedItem : "").toLowerCase());
    return matchesCategory && matchesSearch;
    });


return (
    <div className="flex flex-col h-full">

      {/* Category Filter Pills */}
    <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {CATEGORIES.map((cat) => (
        <button
            key={cat}
            onClick={() => updateCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
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
            { !menuLoading &&
            ( <span className="ml-2 text-zinc-500 font-normal">({filtered.length})</span>)}
        </h2>
        </div>

     {/* Loading */}
    {menuLoading && (
        <div className="flex-1 flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )}

       {/* Error */}
    {menuError && !menuLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-20">
        <p className="text-red-400 text-sm">{menuError}</p>
        <button
            onClick={() => updateCategory(activeCategory)}
            className="text-xs text-zinc-400 underline"
            >
            Retry
        </button>
        </div>
    )}

      {/* Empty State */}
    { !menuLoading && !menuError &&filtered.length === 0 ? (
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
            <ItemContainer
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onAdd={addToCart}
            onRemove={removeFromCart}
            />
        ))}
        </div>
        )}
    </div>
    );
}