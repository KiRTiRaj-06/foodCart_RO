// src/App.jsx
import React, { useState } from "react";
import './App.css'
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Menu from "./components/MenuItems";
import Cart from "./components/Cart";
import Footer from "./components/Footer";

export default function App() {
  const [activePage, setActivePage] = useState("menu");
  const [searchedItem, setSearchedItem] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const tableNumber = Math.floor((Math.random()*20) +1 );

  // Add one unit of item, or increment if already exists
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove one unit of item, delete from cart if quantity reaches 0
  const handleRemoveFromCart = (item) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const handleIncrease = (id) =>
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );

  const handleDecrease = (id) =>
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i)
        .filter((i) => i.quantity > 0)
    );

  const handleRemove = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Total before GST — sidebar shows this, GST added only in Cart summary
  const orderTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col">

      <Header
        tableNumber={tableNumber}
        searchedItem={searchedItem}
        onSearchChange={setSearchedItem}
      />

      <div className="flex flex-1 pt-16">

        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          cartCount={cartCount}
          orderTotal={orderTotal}
        />

        <div className="flex flex-col flex-1 pl-20 lg:pl-56">

          <main className="flex-1 p-6 bg-zinc-900">
            {activePage === "menu" && (
              <Menu
                searchedItem={searchedItem}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                cartItems={cartItems}
              />
            )}
            {activePage === "cart" && (
              <Cart
                cartItems={cartItems}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            )}
          </main>

          <Footer />

        </div>
      </div>

    </div>
  );
}