import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile, Link as LinkType, THEMES, FONTS } from "../types";
import { IconRenderer } from "../components/IconPicker";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExternalLink, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { usePaystackPayment } from "react-paystack";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfileView() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile & { links: LinkType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingFor, setPayingFor] = useState<LinkType | null>(null);

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

  const handleLinkClick = async (link: LinkType) => {
    await fetch(`/api/links/${link.id}/click`, { method: "POST" });
    if (link.is_product === 1) {
      setPayingFor(link);
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 p-8 text-center transition-colors">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Oops!</h1>
      <p className="text-zinc-600 dark:text-zinc-400">The profile you're looking for doesn't exist.</p>
      <a href="/" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all">
        Create Your Own Profile
      </a>
    </div>
  );

  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const font = FONTS.find(f => f.id === profile.font_family) || FONTS[0];

  return (
    <div 
      className={cn("min-h-screen flex flex-col items-center py-16 px-6 relative", theme.bg, font.family)}
      style={profile.bg_image_url ? {
        backgroundImage: `url(${profile.bg_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {profile.bg_image_url && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />}

      <div className="max-w-xl w-full flex flex-col items-center gap-12 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ImageIcon size={32} className="sm:size-40" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={cn("text-xl sm:text-2xl font-extrabold tracking-tight", theme.text, profile.bg_image_url && "text-white drop-shadow-lg")}>
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className={cn("text-base sm:text-lg font-medium opacity-80 max-w-md", theme.text, profile.bg_image_url && "text-white drop-shadow-md")}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          {profile.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              style={{ 
                color: link.color || (profile.bg_image_url ? '#ffffff' : (theme.id === 'dark' ? '#fafafa' : '#18181b')),
                borderColor: link.color ? `${link.color}40` : (profile.bg_image_url ? 'rgba(255,255,255,0.3)' : undefined),
                backgroundColor: link.color ? `${link.color}08` : (profile.bg_image_url ? 'rgba(255,255,255,0.1)' : undefined),
                backdropFilter: profile.bg_image_url ? 'blur(8px)' : undefined
              }}
              className={cn(
                "w-full py-5 px-8 rounded-2xl text-lg font-bold transition-all active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-between group gap-4 border",
                !link.color && !profile.bg_image_url && theme.button,
                !link.color && !profile.bg_image_url && theme.buttonText
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {link.icon ? <IconRenderer name={link.icon} size={24} /> : (link.is_product === 1 ? <ShoppingBag size={24} /> : null)}
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span>{link.title}</span>
                {link.is_product === 1 && (
                  <span className="text-xs opacity-60">₦{(link.price || 0).toLocaleString()}</span>
                )}
              </div>
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {link.is_product === 1 ? (
                  <ShoppingBag size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
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
              theme.text,
              profile.bg_image_url && "text-white border-white"
            )}
          >
            Built with Chip NG
          </a>
        </footer>
      </div>

      {payingFor && (
        <PaymentModal 
          link={payingFor} 
          onClose={() => setPayingFor(null)} 
        />
      )}
    </div>
  );
}

function PaymentModal({ link, onClose }: { link: LinkType, onClose: () => void }) {
  const [email, setEmail] = useState("");
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: (link.price || 0) * 100, // in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = async (reference: any) => {
    try {
      await fetch("/api/payments/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.reference,
          linkId: link.id,
          amount: link.price,
          email: email
        })
      });
      alert("Payment successful! Thank you for your purchase.");
      onClose();
    } catch (err) {
      console.error("Product payment failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 max-w-sm w-full flex flex-col gap-6 shadow-2xl border border-transparent dark:border-zinc-800 transition-colors">
        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Purchase {link.title}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter your email to proceed with the payment of ₦{(link.price || 0).toLocaleString()}</p>
        </div>
        
        <input 
          type="email" 
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white text-zinc-900 dark:text-white transition-all"
        />

        <div className="flex flex-col gap-3">
          <button 
            disabled={!email}
            onClick={() => {
              initializePayment({
                onSuccess: handleSuccess,
                onClose: () => console.log("Payment closed"),
              });
            }}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay Now
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
