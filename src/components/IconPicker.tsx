import * as Icons from "lucide-react";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ICON_LIST = [
  "Instagram", "Twitter", "Youtube", "Github", "Linkedin", "Facebook", "Globe", 
  "Mail", "Phone", "MessageCircle", "Music", "Play", "Camera", "ShoppingBag", 
  "Briefcase", "GraduationCap", "Heart", "Star", "Zap", "Coffee", "MapPin", 
  "Calendar", "Clock", "Download", "ExternalLink", "FileText", "Hash", "Image", 
  "Layers", "Layout", "LifeBuoy", "Link", "List", "Lock", "Maximize", "Mic", 
  "Moon", "Package", "Paperclip", "PieChart", "Pocket", "Power", "Printer", 
  "Radio", "RefreshCw", "Rss", "Save", "Search", "Send", "Settings", "Share2", 
  "Shield", "Shuffle", "Slack", "Smartphone", "Speaker", "Sun", "Tag", "Target", 
  "Terminal", "ThumbsUp", "ToggleLeft", "Trash2", "TrendingUp", "Truck", "Tv", 
  "Umbrella", "User", "Video", "Watch", "Wifi", "Wind", "X", "Zap"
];

export function IconRenderer({ name, size = 20, className }: { name: string, size?: number, className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function IconPicker({ onSelect, onClose }: { onSelect: (name: string) => void, onClose: () => void }) {
  const [search, setSearch] = useState("");

  const filteredIcons = ICON_LIST.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xl font-bold">Select an Icon</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-zinc-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-4">
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onSelect(icon);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all group relative"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                {icon}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
              </div>
              <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">
                <IconRenderer name={icon} size={24} />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 truncate w-full text-center">
                {icon}
              </span>
            </button>
          ))}
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-400">
              No icons found for "{search}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
