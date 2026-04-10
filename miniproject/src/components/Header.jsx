import { NavLink, Link } from "react-router";
import logo from "../assets/logo.png"
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


function Header() {
    const { searchedItem, updateSearch } = useMenu();
    const { user, isLoggedIn ,tableNumber} = useUser();
    const navigate = useNavigate();

    return(
        <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 h-16 flex items-center px-6 gap-4">
            {/* LOGO */}
            <div className="flex items-center gap-3 min-w-fit">
                    <Link to="/" className="flex items-center gap-3 no-underline">
                    {logo?
                        <img src={logo} alt="E" className="w-10 h-10 rounded-3xl" /> :
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-zinc-950 font-black text-lg tracking-tight">E</span>
                        </div>
                        }
                <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
                        Raya's Kitchen
                </span>
                    </Link>
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
                    {/* Avatar Icon — navigates to profile */}
                    <button
                        onClick={() => navigate("/profile")}
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