// src/components/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Login() {
    const { login, isLoading, authError, clearError } = useUser();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pass,  setPass]  = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await login({ email, password: pass });
          navigate("/");   // redirect to menu on success
        } catch {
         // error is already set in UserContext via authError
        }
    };

return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      {/* Glow blobs */}
        <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl top-20 left-1/4 pointer-events-none" />
        <div className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl bottom-20 right-1/4 pointer-events-none" />

        <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/60">

          {/* Header */}
            <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Welcome back</h1>
            <p className="text-zinc-500 text-xs mt-1">Sign in to your Eshcalix account</p>
            </div>

          {/* Error */}
            {authError && (
            <div className="mb-5 flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-pink-400 text-xs">{authError}</p>
            </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Email
            </label>
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="pass" className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Password
                </label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                <input
                    id="pass"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
                <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    )}
                </button>
            </div>
        </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full py-3 rounded-xl font-bold text-sm bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white transition-all duration-200 shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                </span>
            ) : "Sign In"}
            </button>

        </form>

          {/* Divider */}
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
        </div>

          {/* Switch to signup */}
        <p className="text-center text-zinc-500 text-xs">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Create one
            </Link>
        </p>

        </div>
        </div>
    </div>
    );
}

export default Login;
