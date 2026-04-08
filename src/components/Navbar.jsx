import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Raya's Kitchen🍃</div>

      <input
        className="search-bar"
        type="text"
        placeholder="Search for delicious food..."
      />

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Menu</Link>
        <Link to="/login">Login</Link>
        <Link to="/cart" className="cart-btn">🛒</Link>
      </div>
    </nav>
  );
}

export default Navbar;