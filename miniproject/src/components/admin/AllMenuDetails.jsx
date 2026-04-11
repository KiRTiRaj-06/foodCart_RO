// src/components/admin/AllMenuDetails.jsx
import React, { useState, useEffect } from "react";
import { fetchMenu } from "../../api/api";

export default function AllMenuDetails() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenuItems(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;
  if (!menuItems || menuItems.length === 0) return <EmptyState text="No menu items found" />;

  return (
    <div>
      <SectionHeader title="Menu Items" count={menuItems.length} />
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              {["ID","Name", "Category", "Badge","Price", "Discount", "Veg", "Available","Image"].map((h) => (
                <th key={h} className="px-4 py-3 text-zinc-500 text-xs font-semibold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 text-zinc-400 text-sm">{item.id}</td>
                <td className="px-4 py-3 text-zinc-100 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs">{item.category}</span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-sm">{item.badge || 0}%</td>
                <td className="px-4 py-3 text-amber-400 text-sm font-semibold">₹{item.price}</td>
                <td className="px-4 py-3 text-zinc-400 text-sm">{item.discount || 0}%</td>
                <td className="px-4 py-3">
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${item.veg ? "bg-green-500" : "bg-red-500"}`} />
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.available ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                    {item.available ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-sm">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-3xl" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-zinc-100 font-semibold text-sm tracking-wide">
        {title}<span className="ml-2 text-zinc-500 font-normal">({count})</span>
      </h2>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-zinc-500 text-sm">{text}</p>
    </div>
  );
}
