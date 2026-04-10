// src/components/HeaderOnlyLayout.jsx
// Layout with Header but NO Sidebar — used for Profile page
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function HeaderOnlyLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col">
      <Header />
      <main className="flex-1 pt-16 p-6 bg-zinc-900">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
