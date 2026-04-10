// src/context/CartContext.jsx
import { createContext, useContext, useState,useEffect } from "react";
import {fetchCart, apiCartAdd, apiCartRemove,
  apiCartDeleteItem, apiCartClear, apiPlaceOrder,} from '../api/api'


export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orderError,  setOrderError]  = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  // Restore cart from session on mount
  useEffect(() => {
    fetchCart()
      .then((data) => setCartItems(data.data))
      .catch(() => {}); // session may not exist yet — that's fine
  }, []);
  // Sync helper — every mutation returns the updated cart from server
  const sync = (data) => setCartItems(data.data);

  // Add one unit — increments if already exists
  const addToCart = async (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    try {
      const data = await apiCartAdd({ id: item.id, name: item.name, price: item.price, discount: item.discount || 0, image: item.image || "", quantity: 1 });
      sync(data);
    }catch{}
  };

  // Remove one unit — deletes from cart if quantity hits 0
  const removeFromCart = async (item) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0)
    );
      try {
      const data = await apiCartRemove(item.id);
      sync(data);
    } catch {}
  };

  // Increase quantity by id (used in Cart page)
  const increaseQuantity = async (id) => {
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
    try {
      const item = cartItems.find((i) => i.id === id);
      if (item) { const data = await apiCartAdd({ id, name: item.name, price: item.price, discount: item.discount || 0, image: item.image || "", quantity: 1 }); sync(data); }
    } catch {}
  };

  // Decrease quantity by id — removes if hits 0
  const decreaseQuantity = async (id) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i)
        .filter((i) => i.quantity > 0)
    );
    try { const data = await apiCartRemove(id); sync(data); } catch {}
  };

  // Remove entire item row by id
  const removeItem = async(id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    try { const data = await apiCartDeleteItem(id); sync(data); } catch {}
  };

  // Clear entire cart
  const clearCart = async() =>{ 
    setCartItems([])
  try { await apiCartClear(); } catch {}
  };

    // Place order — sends cart to backend, clears on success
  const placeOrder = async (tableNumber) => {
    setOrderLoading(true);
    setOrderError("");
    try {
      const data = await apiPlaceOrder(tableNumber);
      setCartItems([]); // server already cleared the session cart
      return data.order;
    } catch (err) {
      setOrderError(err.message || "Failed to place order");
      throw err;
    } finally {
      setOrderLoading(false);
    }
  };

  // Get quantity of a specific item (used in MenuItems)
  const getQuantity = (id) => {
    const found = cartItems.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  // Derived values
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const orderTotal = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        tax,
        orderTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        getQuantity,
        placeOrder,
        orderError,
        orderLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}



// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}