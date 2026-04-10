// src/api/api.js
// Central place for all HTTP calls to the backend.
// Import whichever functions you need in your context files.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const headers = (extra = {}) => ({
    "Content-Type": "application/json",
    ...extra,
});

const request = async (method, path, body) => {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: headers(),
        credentials: "include",       // send session cookie for cart
        ...(body ? { body: JSON.stringify(body) } : {}),
});
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Request failed");
    return data;
};

// ════════════════════════════════════════════════════════════
//  MENU
// ════════════════════════════════════════════════════════════
export const fetchMenu = () => request("GET", "/menu");
export const apiMenuAdd = (body) => request("POST", "/menu", body);

// ════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════
export const apiRegister = (body) => request("POST", "/auth/register", body);
export const apiLogin    = (body) => request("POST", "/auth/login",    body);
export const apiMe       = ()     => request("GET",  "/auth/me");
export const apiLogout   = ()     => request("POST", "/auth/logout");

// ════════════════════════════════════════════════════════════
//  CART  (session-backed)
// ════════════════════════════════════════════════════════════
export const fetchCart       = ()     => request("GET",    "/cart");
export const apiCartAdd      = (item) => request("POST",   "/cart/add",    item);
export const apiCartRemove   = (id)   => request("POST",   "/cart/remove", { id });
export const apiCartDeleteItem = (id) => request("DELETE", `/cart/item/${id}`);
export const apiCartClear    = ()     => request("DELETE", "/cart");

// ════════════════════════════════════════════════════════════
//  ORDERS
// ════════════════════════════════════════════════════════════
export const apiPlaceOrder   = (tableNumber) => request("POST", "/order/place",   { tableNumber });
export const apiOrderHistory = ()            => request("GET",  "/order/history");
export const apiOrderById    = (id)          => request("GET",  `/order/${id}`);

// ════════════════════════════════════════════════════════════
//  ADMIN
// ════════════════════════════════════════════════════════════
export const apiAdminUsers   = ()  => request("GET", "/admin/users");
export const apiAdminOrders  = ()  => request("GET", "/admin/orders");