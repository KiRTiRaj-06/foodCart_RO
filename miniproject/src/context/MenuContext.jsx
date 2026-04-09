import React from "react";
import { createContext, useContext, useState,useEffect} from "react";
import { fetchMenu } from "../api/api";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [searchedItem, setSearchedItem] = useState("");
  const [menuLoading,    setMenuLoading]    = useState(true);
  const [menuError,      setMenuError]      = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [menu,      setMenu]      = useState([]);
  // fetch ONCE on mount
useEffect(() => {
  setMenuLoading(true);
  fetchMenu()   // no category argument — always fetches all
    .then((data) => setMenu(data.data))
    .catch((err) => setMenuError(err.message || "Failed to load menu"))
    .finally(() => setMenuLoading(false));
}, []); // empty array = runs once only

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
        menu,
        searchedItem,
        activeCategory,
        updateSearch,
        updateCategory,
        clearSearch,
        menuLoading,
        menuError,
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