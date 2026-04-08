import React from "react";
// src/context/MenuContext.jsx
import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [searchedItem, setSearchedItem] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const updateSearch = (value) => {
    setSearchedItem(typeof value === "string" ? value : "");
  };

  const updateCategory = (category) => {
    setActiveCategory(category);
  };

  const clearSearch = () => setSearchedItem("");

  return (
    <MenuContext.Provider
      value={{
        searchedItem,
        activeCategory,
        updateSearch,
        updateCategory,
        clearSearch,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
}