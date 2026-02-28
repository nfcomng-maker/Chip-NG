import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Link2, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("chip_user_id", data.userId.toString());
        localStorage.setItem("chip_username", data.username);
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-xl w-full max-w-md flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2 text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-2">
            <Link2 size={24} />
          </div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-zinc-500">Log in to manage your world.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg mt-4 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-zinc-900 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
