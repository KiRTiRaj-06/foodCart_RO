// src/components/PublicLayout.jsx
// Layout for public pages (Home, Login, Signup)
// No Header, no Sidebar. Footer sits below the fold.
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col">
      {/* Page content takes full viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer below the fold — only visible on scroll */}
      <Footer />
    </div>
  );
}
