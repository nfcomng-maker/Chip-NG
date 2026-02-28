import { useState, useEffect, ReactNode, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Settings, 
  Palette, 
  BarChart3, 
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  CreditCard,
  Calendar,
  History,
  CheckCircle2,
  Share2,
  Check,
  Upload,
  GripVertical
} from "lucide-react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Profile, Link as LinkType, THEMES } from "../types";
import { IconPicker, IconRenderer } from "../components/IconPicker";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function SortableLink({ 
  link, 
  onUpdate, 
  onDelete, 
  onPickIcon 
}: { 
  link: LinkType, 
  onUpdate: (id: number, updates: Partial<LinkType>) => Promise<void>,
  onDelete: (id: number) => Promise<void>,
  onPickIcon: (id: number) => void,
  key?: any
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col gap-4 relative group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
          >
            <GripVertical size={20} />
          </div>
          
          <button 
            onClick={() => onPickIcon(link.id)}
            className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all shrink-0 border border-zinc-100"
          >
            {link.icon ? (
              <IconRenderer name={link.icon} size={24} />
            ) : (
              <ImageIcon size={24} />
            )}
          </button>
          
          <div className="flex-1 flex flex-col gap-3">
            <input 
              type="text" 
              value={link.title}
              onChange={(e) => onUpdate(link.id, { title: e.target.value })}
              className="text-lg font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
              placeholder="Link Title"
            />
            <input 
              type="text" 
              value={link.url}
              onChange={(e) => onUpdate(link.id, { url: e.target.value })}
              className="text-sm text-zinc-500 bg-transparent border-none p-0 focus:ring-0 w-full"
              placeholder="https://your-link.com"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onDelete(link.id)}
            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={link.active === 1}
              onChange={(e) => onUpdate(link.id, { active: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Active</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Color</span>
            <div className="relative flex items-center">
              <input 
                type="color" 
                value={link.color || "#000000"}
                onChange={(e) => onUpdate(link.id, { color: e.target.value })}
                className="w-6 h-6 rounded-full border-none p-0 cursor-pointer overflow-hidden"
              />
            </div>
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {link.clicks} Clicks
        </div>
      </div>
    </div>
  );
}

interface SubscriptionData {
  plan: string;
  subscription_status: string;
  next_billing_date: string | null;
  payments: Array<{
    id: number;
    amount: number;
    currency: string;
    status: string;
    date: string;
    plan: string;
  }>;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'analytics' | 'subscription'>('links');
  const [isSaving, setIsSaving] = useState(false);
  const [pickingIconFor, setPickingIconFor] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getAuthHeaders = () => {
    const userId = localStorage.getItem("chip_user_id");
    if (!userId) {
      navigate("/login");
      return {};
    }
    return { "x-user-id": userId };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = getAuthHeaders();
    if (Object.keys(headers).length === 0) return;

    const [profileRes, linksRes, subRes] = await Promise.all([
      fetch("/api/profile", { headers }),
      fetch("/api/links", { headers }),
      fetch("/api/subscription", { headers })
    ]);

    if (profileRes.status === 401) {
      navigate("/login");
      return;
    }

    const profileData = await profileRes.json();
    const linksData = await linksRes.json();
    const subData = await subRes.json();
    setProfile(profileData);
    setLinks(linksData);
    setSubscription(subData);
  };

  const handleAddLink = async () => {
    const headers = getAuthHeaders();
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Link", url: "https://", icon: "" })
    });
    if (res.ok) fetchData();
  };

  const handleUpdateLink = async (id: number, updates: Partial<LinkType>) => {
    const headers = getAuthHeaders();
    const link = links.find(l => l.id === id);
    if (!link) return;
    const res = await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...link, ...updates })
    });
    if (res.ok) fetchData();
  };

  const handleDeleteLink = async (id: number) => {
    const headers = getAuthHeaders();
    const res = await fetch(`/api/links/${id}`, { 
      method: "DELETE",
      headers 
    });
    if (res.ok) fetchData();
  };

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const headers = getAuthHeaders();
    setIsSaving(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, ...updates })
    });
    if (res.ok) {
      setProfile({ ...profile, ...updates });
    }
    setIsSaving(false);
  };

  const handleDragEnd = async (event: any) => {
    if (event['over'] && event['active']['id'] !== event['over']['id']) {
      const activeId = Number(event['active']['id']);
      const overId = Number(event['over']['id']);
      
      const oldIndex = links.findIndex(l => l.id === activeId);
      const newIndex = links.findIndex(l => l.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newLinks = arrayMove(links, oldIndex, newIndex) as LinkType[];
        setLinks(newLinks);
        
        // Update positions in backend
        const headers = getAuthHeaders();
        const updates = newLinks.map((link, index) => ({
          id: link.id,
          position: index
        }));
        
        await fetch("/api/links/reorder", {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ links: updates })
        });
      }
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const headers = getAuthHeaders();
    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "x-user-id": headers["x-user-id"] },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { ...prev, avatar_url: data.avatarUrl } : null);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/p/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Editor Side */}
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Editor</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium px-4 py-2 rounded-xl border border-zinc-200 transition-all"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
              {copied ? "Copied!" : "Share"}
            </button>
            <a 
              href={`/p/${profile.username}`} 
              target="_blank" 
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium px-4 py-2 rounded-xl border border-zinc-200"
            >
              <Eye size={18} />
              Preview
            </a>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl w-fit">
          <TabButton active={activeTab === 'links'} onClick={() => setActiveTab('links')}>
            <LinkIcon size={18} />
            Links
          </TabButton>
          <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>
            <Palette size={18} />
            Appearance
          </TabButton>
          <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={18} />
            Analytics
          </TabButton>
          <TabButton active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')}>
            <CreditCard size={18} />
            Subscription
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'links' && (
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddLink}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                <Plus size={20} />
                Add New Link
              </button>
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={links.map(l => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-4">
                    {links.map((link) => (
                      <SortableLink 
                        key={link.id}
                        link={link}
                        onUpdate={handleUpdateLink}
                        onDelete={handleDeleteLink}
                        onPickIcon={setPickingIconFor}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="flex flex-col gap-8">
              <section className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-6">
                <h2 className="text-xl font-bold">Profile</h2>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-zinc-100 rounded-full overflow-hidden border-2 border-zinc-200 relative">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Display Name</label>
                      <input 
                        type="text" 
                        value={profile.display_name}
                        onChange={(e) => handleUpdateProfile({ display_name: e.target.value })}
                        className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-900 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bio</label>
                      <textarea 
                        value={profile.bio}
                        onChange={(e) => handleUpdateProfile({ bio: e.target.value })}
                        className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-900 outline-none h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-6">
                <h2 className="text-xl font-bold">Themes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map((theme) => (
                    <button 
                      key={theme.id}
                      onClick={() => handleUpdateProfile({ theme: theme.id })}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2",
                        profile.theme === theme.id ? "border-zinc-900" : "border-zinc-100 hover:border-zinc-200"
                      )}
                    >
                      <div className={cn("w-full h-12 rounded-lg", theme.bg)} />
                      <span className="text-sm font-bold">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Total Clicks</div>
                  <div className="text-3xl font-bold">{links.reduce((acc, curr) => acc + curr.clicks, 0)}</div>
                </div>
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Active Links</div>
                  <div className="text-3xl font-bold">{links.filter(l => l.active).length}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Link Performance</h3>
                <div className="flex flex-col gap-2">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                      <span className="font-medium">{link.title}</span>
                      <span className="font-bold">{link.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && subscription && (
            <div className="flex flex-col gap-8">
              {/* Current Plan */}
              <section className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Current Plan</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    subscription.plan === 'free' ? "bg-zinc-100 text-zinc-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {subscription.plan}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">Status</div>
                      <div className="text-sm text-zinc-500 capitalize">{subscription.subscription_status}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-600 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">Next Billing Date</div>
                      <div className="text-sm text-zinc-500">
                        {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {subscription.plan === 'free' ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
                  >
                    Upgrade to Pro
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white text-zinc-900 border border-zinc-200 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-all">
                      Manage Plan
                    </button>
                    <button className="flex-1 bg-white text-red-600 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-50 transition-all">
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </section>

              {/* Payment History */}
              <section className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-zinc-400" />
                  <h2 className="text-xl font-bold">Payment History</h2>
                </div>

                {subscription.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-100">
                          <th className="pb-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Plan</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {subscription.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="py-4 text-sm text-zinc-600">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-4 text-sm font-bold text-zinc-900 capitalize">{payment.plan}</td>
                            <td className="py-4 text-sm text-zinc-600">{payment.currency} {payment.amount.toLocaleString()}</td>
                            <td className="py-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                payment.status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                              )}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <div className="text-zinc-400 mb-2">No payments found</div>
                    <div className="text-xs text-zinc-500">Your payment history will appear here once you subscribe to a paid plan.</div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side (Sticky) */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="text-center mb-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Preview</div>
          <div className="w-[320px] h-[640px] bg-zinc-900 rounded-[3rem] p-3 border-[8px] border-zinc-800 shadow-2xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-10" />
            <div className="w-full h-full bg-white rounded-[2rem] overflow-y-auto scrollbar-hide">
              <ProfilePreview profile={profile} links={links} />
            </div>
          </div>
        </div>
      </div>
      {/* Icon Picker Modal */}
      <AnimatePresence>
        {pickingIconFor !== null && (
          <IconPicker 
            onSelect={(icon) => {
              handleUpdateLink(pickingIconFor, { icon });
              setPickingIconFor(null);
            }}
            onClose={() => setPickingIconFor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
        active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
      )}
    >
      {children}
    </button>
  );
}

function ProfilePreview({ profile, links }: { profile: Profile, links: LinkType[] }) {
  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  
  return (
    <div className={cn("min-h-full p-8 flex flex-col items-center gap-8", theme.bg)}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
              <ImageIcon size={32} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className={cn("text-xl font-bold", theme.text)}>@{profile.username}</h2>
          <p className={cn("text-sm opacity-80", theme.text)}>{profile.bio}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {links.filter(l => l.active).map(link => (
          <div 
            key={link.id}
            style={{ 
              color: link.color || (theme.id === 'dark' ? '#fafafa' : '#18181b'),
              borderColor: link.color ? `${link.color}40` : undefined,
              backgroundColor: link.color ? `${link.color}08` : undefined
            }}
            className={cn(
              "w-full py-4 px-6 rounded-2xl text-center font-bold transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-3 border",
              !link.color && theme.button,
              !link.color && theme.buttonText
            )}
          >
            {link.icon && <IconRenderer name={link.icon} size={20} />}
            {link.title}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <div className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text)}>
          Chip NG
        </div>
      </div>
    </div>
  );
}
