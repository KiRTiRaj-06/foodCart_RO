// src/components/SignUp.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function SignUp() {
    const { signup, isLoading, authError, clearError, isLoggedIn } = useUser();
    const navigate = useNavigate();

    // Already logged in — go to menu
    if (isLoggedIn) {
        navigate("/menu", { replace: true });
        return null;
    }

    const [name,     setName]     = useState("");
    const [email,    setEmail]    = useState("");
    const [pass,     setPass]     = useState("");
    const [confirm,  setConfirm]  = useState("");
    const [showPass, setShowPass] = useState(false);
    const [localError, setLocalError] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (pass !== confirm) {
        setLocalError("Passwords do not match");
        return;
    }
    if (pass.length < 6) {
        setLocalError("Password must be at least 6 characters");
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        setLocalError("Invalid email format (e.g. name@example.com)");
        return;
    }

    try {
    await signup({ name, email, password: pass });
      navigate("/menu");  // redirect to menu after signup
    } catch {
      // authError is set in UserContext
    }
};

    const errorMsg = localError || authError;

return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      {/* Glow blobs */}
    <div className="absolute w-72 h-72 bg-pink-600/15 rounded-full blur-3xl top-16 right-1/4 pointer-events-none" />
    <div className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl bottom-16 left-1/4 pointer-events-none" />

    <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/60">

          {/* Header */}
        <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Create account</h1>
            <p className="text-zinc-500 text-xs mt-1">Join Eshcalix and start ordering</p>
        </div>

          {/* Error */}
        {errorMsg && (
        <div className="mb-5 flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
                <p className="text-pink-400 text-xs">{errorMsg}</p>
            </div>
        )}

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Username */}
        <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Username
            </label>
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200"
                />
            </div>
        </div>

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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200"
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
                    placeholder="Min. 6 characters"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all duration-200"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm" className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                Confirm Password
                </label>
                <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input
                    id="confirm"
                    type={showPass ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className={`w-full bg-zinc-900 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all duration-200 ${
                    confirm && pass !== confirm
                        ? "border-pink-500 focus:ring-1 focus:ring-pink-500/30"
                        : confirm && pass === confirm
                        ? "border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                        : "border-zinc-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30"
                    }`}
                />
                {/* Match indicator */}
                {confirm && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {pass === confirm ? (
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    </div>
                )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 rounded-xl font-bold text-sm bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all duration-200 shadow-lg shadow-pink-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                    Creating account...
                </span>
            ) : "Create Account"}
            </button>

    </form>

          {/* Divider */}
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          
          {/* Switch to login */}
            <p className="text-center text-zinc-500 text-xs">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Sign in
            </Link>
            </p>

        </div>
        </div>
    </div>
    </div>
    );
}

export default SignUp;