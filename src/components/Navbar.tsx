import { Link, useNavigate } from "react-router-dom";
import { Link2, LayoutDashboard, CreditCard, Home, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("chip_username");
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chip_user_id");
    localStorage.removeItem("chip_username");
    setUsername(null);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
            <Link2 size={20} />
          </div>
          Chip NG
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 text-sm font-medium">
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link to="/pricing" className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 text-sm font-medium">
            <CreditCard size={18} />
            <span className="hidden sm:inline">Pricing</span>
          </Link>
          
          {username ? (
            <>
              <Link to="/dashboard" className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 text-sm font-medium">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link to={`/p/${username}`} className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2">
                  <User size={16} />
                  My Page
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-zinc-600 hover:text-zinc-900 text-sm font-bold">
                Log In
              </Link>
              <Link to="/signup" className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
