import { Link } from "react-router"
import logo from "../assets/1F6D2_color.png"
function Footer(){
    
    return(
<footer className="bg-zinc-900 border-t border-zinc-800 w-full mt-auto">
    <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Top Row: Logo + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="text-zinc-950 font-black text-base">E</span>
                </div>
            <div>
            <p className="text-zinc-100 font-bold text-sm tracking-wide">The Food Cafe</p>
            <p className="text-zinc-500 text-xs">by The RAYA'S KITCHEN</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1.5 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-zinc-400 text-xs font-medium">Kitchen is Open</span>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mb-8" />

        {/* About Section */}
        <div className="flex flex-col gap-4 mb-12 max-w-4xl mx-auto text-center">
            <h3 className="text-zinc-100 text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-3">
                <span className="w-10 h-[2px] bg-amber-500 rounded-full" />
                About Raya's Kitchen
                <span className="w-10 h-[2px] bg-amber-500 rounded-full" />
            </h3>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed sm:leading-loose font-medium px-4">
                We believe that food is more than just sustenance; it's an experience. 
                Every dish is crafted with love, using handpicked fresh ingredients and secret recipes passed down through generations. 
                Come home to the authentic taste of <span className="text-amber-400 font-bold">pure culinary bliss</span>.
            </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mb-5" />

        {/* Bottom Row: Copyright + Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} RAYA'S KITCHEN 
            </p>
 
        <div className="flex items-center gap-3">
            {[
                { label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "X", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
            ].map(({ label, d }) => (
            <a key={label} href="#" aria-label={label}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-all duration-200 group">
                <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d={d} />
                </svg>
            </a>
            ))}
        </div>
        </div>

    </div>
    </footer>
    )
}
export default Footer