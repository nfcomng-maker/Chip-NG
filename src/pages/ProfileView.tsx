import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile, Link as LinkType, THEMES } from "../types";
import { IconRenderer } from "../components/IconPicker";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExternalLink, Image as ImageIcon } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfileView() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile & { links: LinkType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${username}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleLinkClick = async (id: number, url: string) => {
    await fetch(`/api/links/${id}/click`, { method: "POST" });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">Oops!</h1>
      <p className="text-zinc-600">The profile you're looking for doesn't exist.</p>
      <a href="/" className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all">
        Create Your Own Profile
      </a>
    </div>
  );

  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];

  return (
    <div className={cn("min-h-screen flex flex-col items-center py-16 px-6", theme.bg)}>
      <div className="max-w-xl w-full flex flex-col items-center gap-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                <ImageIcon size={40} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={cn("text-2xl font-extrabold tracking-tight", theme.text)}>
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className={cn("text-lg font-medium opacity-80 max-w-md", theme.text)}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          {profile.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              style={{ 
                color: link.color || (theme.id === 'dark' ? '#fafafa' : '#18181b'),
                borderColor: link.color ? `${link.color}40` : undefined,
                backgroundColor: link.color ? `${link.color}08` : undefined
              }}
              className={cn(
                "w-full py-5 px-8 rounded-2xl text-lg font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-between group gap-4 border",
                !link.color && theme.button,
                !link.color && theme.buttonText
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {link.icon && <IconRenderer name={link.icon} size={24} />}
              </div>
              <span className="flex-1 text-center">{link.title}</span>
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-4">
          <a 
            href="/" 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border border-current opacity-40 hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest",
              theme.text
            )}
          >
            Built with Chip NG
          </a>
        </footer>
      </div>
    </div>
  );
}
