// src/components/admin/AllUserDetails.jsx
import React, { useState, useEffect } from "react";
import { apiAdminUsers, apiAdminUserDelete } from "../../api/api";

export default function AllUserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiAdminUsers()
      .then((data) => setUsers(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this user? Their order history will remain anonymously stored.")) return;
    
    try {
      await apiAdminUserDelete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;
  if (!users || users.length === 0) return <EmptyState text="No users registered yet" />;

  return (
    <div>
      <SectionHeader title="Registered Users" count={users.length} />
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              {["ID", "Username", "Email", "Joined", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-zinc-500 text-xs font-semibold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="px-4 py-3 text-zinc-400 text-sm">{u.id}</td>
                <td className="px-4 py-3 text-zinc-100 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <span className="text-amber-400 font-bold text-xs uppercase">{u.username?.charAt(0)}</span>
                    </div>
                    {u.username}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Delete User"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
