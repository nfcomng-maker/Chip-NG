import { Link, useNavigate } from "react-router-dom";
import { Link2, LayoutDashboard, CreditCard, Home, LogOut, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("chip_username");
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chip_user_id");
    localStorage.removeItem("chip_username");
    setUsername(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900">
            <Link2 size={20} />
          </div>
          Chip NG
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
            <Home size={18} />
            Home
          </Link>
          <Link to="/pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
            <CreditCard size={18} />
            Pricing
          </Link>
          
          {username ? (
            <>
              <Link to="/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <Link to={`/p/${username}`} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                  <User size={16} />
                  My Page
                </Link>
                <ThemeToggle />
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-bold transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-zinc-900 dark:text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-bold transition-colors">
                <Home size={20} />
                Home
              </Link>
              <Link to="/pricing" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-bold transition-colors">
                <CreditCard size={20} />
                Pricing
              </Link>
              
              {username ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white font-bold transition-colors">
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                  <Link to={`/p/${username}`} onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold transition-colors">
                    <User size={20} />
                    My Page
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Link to="/login" onClick={closeMenu} className="w-full text-center py-3 rounded-xl text-zinc-900 dark:text-white font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="w-full text-center py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
