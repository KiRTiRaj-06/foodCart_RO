import { NavLink ,Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png"
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


function Header() {
    const { searchedItem, updateSearch } = useMenu();
    const { user, isLoggedIn, logout } = useUser();
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        }
        if (showPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPopup]);

    const handleLogout = () => {
        setShowPopup(false);
        logout();
        navigate("/");
    };

    const tableNumber = Math.floor((Math.random()*20) +1 );
    return(
        <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 h-16 flex items-center px-6 gap-4">
            {/* LOGO */}
            <div className="flex items-center gap-3 min-w-fit">
                    <Link path="/">
                    {logo?
                        <img src={logo} alt="E" className="w-10 h-10 rounded-3xl" /> :
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-zinc-950 font-black text-lg tracking-tight">E</span>
                        </div>
                        }
                    </Link>
                <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
                        Eshcalix
                </span>
            </div>
            {/* Divider */}
            <div className="w-px h-8 bg-zinc-800 mx-1 hidden sm:block" />
                
             {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                        />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            value={searchedItem}
                            onChange={(e) => updateSearch(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-auto min-w-fit">    
                    {/* Avatar Icon — clickable */}
        <div className="relative" ref={popupRef}>
            <button
                onClick={() => setShowPopup((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors duration-200 focus:outline-none focus:border-amber-500"
            >
                {user?.username ? (
                    <span className="text-amber-400 font-bold text-sm uppercase leading-none">
                        {user.username.charAt(0)}
                    </span>
                ) : (
                    <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                        />
                    </svg>
                )}
            </button>

            {/* User Popup */}
            {showPopup && (
                <div className="absolute right-0 top-12 w-72 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Close button */}
                    <button
                        onClick={() => setShowPopup(false)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* User avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <span className="text-amber-400 font-black text-lg uppercase">
                                {user?.username?.charAt(0) || "?"}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-zinc-100 font-semibold text-sm truncate">
                                {user?.username || "Unknown"}
                            </p>
                            <p className="text-zinc-500 text-xs truncate">
                                {user?.email || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-800 my-3" />

                    {/* User details */}
                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-zinc-400 text-xs">{user?.username || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-zinc-400 text-xs truncate">{user?.email || "—"}</span>
                        </div>
                        {user?.created_at && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-zinc-400 text-xs">
                                    Joined {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-800 my-3" />

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                    </button>
                </div>
            )}
        </div>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5 left-20">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-xs text-zinc-300 font-medium">
                            Table{" "}
                                <span className="text-amber-400 font-bold">{String(tableNumber ?? "-")}</span>
                            </span>
                    </div>
                </div>   
        </header>
    )
}

export default Header