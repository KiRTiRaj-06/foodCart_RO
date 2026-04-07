import { useState } from "react";

const items = [
  { name: "Burger", price: 120, category: "Fast Food" },
  { name: "Pizza", price: 250, category: "Fast Food" },
  { name: "Pasta", price: 180, category: "Fast Food" },
  { name: "Orange Juice", price: 80, category: "Drinks" },
  { name: "Apple Juice", price: 80, category: "Drinks" },
  { name: "Pineapple Juice", price: 80, category: "Drinks" },
  { name: "Banana Milkshake", price: 80, category: "Drinks" },
  { name: "Juice", price: 80, category: "Drinks" },
];

function Shop() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || item.category === filter)
    );
  });

  return (
    <div className="page">
      <h1>Shop 🍕</h1>

      <input
        type="text"
        placeholder="Search food..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>Fast Food</option>
        <option>Drinks</option>
      </select>

      {filteredItems.map((item, i) => (
        <div key={i} className="card">
          <h3>{item.name}</h3>
          <p>₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Shop;