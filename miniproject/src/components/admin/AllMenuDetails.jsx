// src/components/admin/AllMenuDetails.jsx
import React, { useState, useEffect } from "react";
import { fetchMenu, apiMenuUpdate, apiMenuDelete } from "../../api/api";

export default function AllMenuDetails() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);

  const loadMenu = () => {
    setLoading(true);
    fetchMenu()
      .then((data) => setMenuItems(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await apiMenuDelete(id);
      setMenuItems((prev) => prev.filter(i => i.id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

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
              {["ID","Name", "Category", "Badge","Price", "Discount", "Veg", "Available","Image", "Actions"].map((h) => (
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
                  <img src={item.image || "/fallback.png"} alt="" className="w-10 h-10 rounded-3xl object-cover" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditItem(item)} className="px-3 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-bold rounded-lg transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-lg transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editItem && (
        <EditModal 
            item={editItem} 
            onClose={() => setEditItem(null)} 
            onRefresh={loadMenu}
        />
      )}
    </div>
  );
}

function EditModal({ item, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    category: item.category || "",
    price: item.price || "",
    discount: item.discount || "",
    descrip: item.descrip || "",
    badge: item.badge || "",
    veg: item.veg ?? true,
    available: item.available ?? true,
    imageUrl: item.image || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price) || 0,
      discount: parseInt(formData.discount) || 0,
      descrip: formData.descrip || "",
      badge: formData.badge || "",
      veg: formData.veg,
      available: formData.available,
      image: formData.imageUrl
    };

    try {
      await apiMenuUpdate(item.id, payload);
      onRefresh();
      onClose();
    } catch (err) { alert("Update failed: " + err.message); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-[#0f0f0f] border border-amber-500/30 w-full max-w-2xl rounded-2xl shadow-xl shadow-amber-500/5 p-6 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
        <h3 className="text-xl font-bold text-amber-400 mb-6 w-full pb-2 border-b border-zinc-800">Edit Details: {item.name}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400">Image URL</label>
                <input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 w-full" placeholder="https://example.com/image.jpg"/>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <input value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="Name" className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2" required/>
                <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 appearance-none">
                  <option value="" disabled>Select Category</option>
                  {["Starters", "Soups", "Chinese", "Mains", "Biryani", "Drinks", "Rolls & Wraps", "Waffles & Cake", "Desserts"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input value={formData.price} type="number" onChange={(e)=>setFormData({...formData, price: e.target.value})} placeholder="Price" className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2" required/>
                <input value={formData.discount} type="number" onChange={(e)=>setFormData({...formData, discount: e.target.value})} placeholder="Discount" className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2"/>
                <input value={formData.badge} onChange={(e)=>setFormData({...formData, badge: e.target.value})} placeholder="Badge" className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2"/>
            </div>
            
            <textarea value={formData.descrip} onChange={(e)=>setFormData({...formData, descrip: e.target.value})} placeholder="Description" rows={2} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm"/>

            <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-zinc-300 text-sm"><input type="checkbox" checked={formData.veg} onChange={(e)=>setFormData({...formData, veg: e.target.checked})} className="accent-amber-500" /> Vegetarian</label>
                <label className="flex items-center gap-2 text-zinc-300 text-sm"><input type="checkbox" checked={formData.available} onChange={(e)=>setFormData({...formData, available: e.target.checked})} className="accent-amber-500" /> Available</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-zinc-800 text-sm font-semibold transition">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold text-sm transition">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  )
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
