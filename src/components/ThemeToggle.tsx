import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 
                 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10
                 hover:bg-white/20 dark:hover:bg-black/20 shadow-lg group"
      aria-label="Toggle night mode"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Sun 
          className={`absolute transition-all duration-500 transform ${
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          } text-amber-500`} 
          size={20} 
        />
        <Moon 
          className={`absolute transition-all duration-500 transform ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          } text-indigo-400`} 
          size={20} 
        />
      </div>
      
      {/* Tooltip */}
      <span className="absolute top-12 scale-0 group-hover:scale-100 transition-all duration-200 
                       bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap
                       pointer-events-none font-medium">
        {isDark ? "Light Mode" : "Night Mode"}
      </span>
    </button>
  );
}
