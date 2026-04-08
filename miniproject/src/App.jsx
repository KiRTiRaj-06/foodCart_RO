// src/App.jsx
import React, { useState } from "react";
import './App.css'
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =""
  
  const activePage = location.pathname === "/cart" ? "cart" : 
                              location.pathname === "/order" ? "order" : "menu";

    const handleNavigate = (page) => {
    if (page === "cart")       navigate("/cart");
    else if (page === "order") navigate("/order");
    else navigate("/menu");
    
  };
  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col">

      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="flex flex-col flex-1 pl-20 lg:pl-56">
          <main className="flex-1 p-6 bg-zinc-900">
          <Outlet />
        </main>
        <Footer />
        </div>
      </div>

    </div>
  );
}