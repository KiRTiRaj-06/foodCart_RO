// src/components/AppLayout.jsx
// Layout for authenticated pages (Menu, Cart, Order, Profile)
// Renders Header + Sidebar + main content area + Footer
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage =
    location.pathname === "/cart"
      ? "cart"
      : location.pathname === "/order"
      ? "order"
      : "menu";

  const handleNavigate = (page) => {
    if (page === "cart") navigate("/cart");
    else if (page === "order") navigate("/order");
    else navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-[#050505] to-black text-white font-['Outfit'] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        <div className="flex flex-col flex-1 pl-20 lg:pl-56 relative z-10 transition-all duration-300">
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
