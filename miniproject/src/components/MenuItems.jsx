// src/components/MenuItems.jsx
import React, { useEffect, useState } from 'react';

import ItemContainer from './ItemContainer'
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { getMenu } from "../api/api";

const CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Drinks"];

const MENU_ITEMS = [
{ id: 1, name: "Paneer Tikka",    category: "Starters", price: 220, discount: 0,  description: "Grilled cottage cheese with spiced marinade", 
	image: "https://images.pexels.com/photos/33430558/pexels-photo-33430558.jpeg"  ,    badge: "Popular",     veg: true,  available: true  },

    { id: 2, name: "Chicken Wings",   category: "Starters", price: 280, discount: 15, description: "Crispy wings tossed in tangy sauce", 
	image:"https://images.pexels.com/photos/29908653/pexels-photo-29908653.jpeg"   ,            badge: null,          veg: false, available: true  },

    { id: 3, name: "Dal Makhani",     category: "Mains",    price: 180, discount: 0,  description: "Slow-cooked black lentils in buttery gravy", 
	image: "https://images.pexels.com/photos/28674561/pexels-photo-28674561.jpeg"    ,   badge: "Chef's Pick", veg: true,  available: true  },

    { id: 4, name: "Butter Chicken",  category: "Mains",    price: 320, discount: 10, description: "Tender chicken in rich tomato-cream sauce", 
        image: 	"https://images.pexels.com/photos/9738981/pexels-photo-9738981.jpeg"   ,     badge: "Popular",     veg: false, available: true  },

    { id: 5, name: "Gulab Jamun",     category: "Desserts", price: 80,  discount: 0,  description: "Soft milk-solid dumplings in rose syrup", 
        image: 	"https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg"   ,     badge: null,          veg: true,  available: true  },

    { id: 6, name: "Mango Lassi",     category: "Drinks",   price: 90,  discount: 0,  description: "Chilled yogurt blended with fresh mango",  
	    image: "https://images.pexels.com/photos/18142611/pexels-photo-18142611.jpeg"  ,      badge: null,          veg: true,  available: false },

    { id: 7, name: "Veg Biryani",     category: "Mains",    price: 200, discount: 0,  description: "Fragrant basmati with seasonal vegetables", 
	image: "https://images.pexels.com/photos/35287414/pexels-photo-35287414.jpeg"     ,   badge: null,          veg: true,  available: true  },

    { id: 8, name: "Masala Chai",     category: "Drinks",   price: 40,  discount: 20, description: "Spiced Indian milk tea",      
	image: "https://images.pexels.com/photos/18030044/pexels-photo-18030044.jpeg"  ,          badge: null,          veg: true,  available: true  }
];

export default function MenuItems() {
    const {searchedItem , activeCategory, updateCategory} = useMenu();
    const {addToCart, removeFromCart, getQuantity } = useCart();
    
    const[menu,setMenu] = useState([])

    useEffect(()=>{
        getMenu().then((data)=> setMenu(data))
    },[])


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
            <span className="ml-2 text-zinc-500 font-normal">({filtered.length})</span>
        </h2>
        </div>

      {/* Empty State */}
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