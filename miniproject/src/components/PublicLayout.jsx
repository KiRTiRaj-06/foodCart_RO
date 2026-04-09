// src/components/PublicLayout.jsx
// Layout for public pages (Home, Login, Signup)
// No Header, no Sidebar, no Footer.
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
