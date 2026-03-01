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
  GripVertical,
  Code,
  Copy,
  Shield,
  Users,
  UserPlus,
  Activity
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
import { Profile, Link as LinkType, THEMES, FONTS } from "../types";
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
      className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4 relative group transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors shrink-0"
          >
            <GripVertical size={20} />
          </div>
          
          <button 
            onClick={() => onPickIcon(link.id)}
            className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all shrink-0 border border-zinc-100 dark:border-zinc-700"
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
              className="text-lg font-bold bg-transparent border-none p-0 focus:ring-0 w-full text-zinc-900 dark:text-white"
              placeholder="Link Title"
            />
            <input 
              type="text" 
              value={link.url}
              onChange={(e) => onUpdate(link.id, { url: e.target.value })}
              className="text-sm text-zinc-500 dark:text-zinc-400 bg-transparent border-none p-0 focus:ring-0 w-full"
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
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={link.active === 1}
              onChange={(e) => onUpdate(link.id, { active: e.target.checked ? 1 : 0 })}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-zinc-900 dark:focus:ring-white bg-transparent"
            />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Color</span>
            <div className="relative flex items-center">
              <input 
                type="color" 
                value={link.color || "#000000"}
                onChange={(e) => onUpdate(link.id, { color: e.target.value })}
                className="w-6 h-6 rounded-full border-none p-0 cursor-pointer overflow-hidden bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 border-l border-zinc-100 dark:border-zinc-800 pl-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={link.is_product === 1}
                onChange={(e) => onUpdate(link.id, { is_product: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-zinc-900 dark:focus:ring-white bg-transparent"
              />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Product</span>
            </label>
            {link.is_product === 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">₦</span>
                <input 
                  type="number" 
                  value={link.price || 0}
                  onChange={(e) => onUpdate(link.id, { price: parseInt(e.target.value) })}
                  className="w-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white text-zinc-900 dark:text-white"
                  placeholder="Price"
                />
              </div>
            )}
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
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
  const [apiKeys, setApiKeys] = useState<Array<{ id: number, name: string, created_at: string, partial_key: string }>>([]);
  const [adminStats, setAdminStats] = useState<{ totalUsers: number, proUsers: number, totalClicks: number, totalRevenue: number } | null>(null);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: number, username: string, email: string, plan: string, role: string, is_verified: number, is_featured: number, display_name: string }>>([]);
  const [adminLinks, setAdminLinks] = useState<Array<{ id: number, title: string, url: string, username: string, email: string, clicks: number, active: number }>>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'analytics' | 'subscription' | 'developer' | 'admin'>('links');
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", plan: "free", role: "user" });
  const [isSaving, setIsSaving] = useState(false);
  const [pickingIconFor, setPickingIconFor] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
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

    const [profileRes, linksRes, subRes, keysRes] = await Promise.all([
      fetch("/api/profile", { headers }),
      fetch("/api/links", { headers }),
      fetch("/api/subscription", { headers }),
      fetch("/api/keys", { headers })
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

    if (keysRes.ok) {
      const keysData = await keysRes.json();
      setApiKeys(keysData);
    }

    if (profileData.role === 'admin') {
      const [statsRes, adminUsersRes, adminLinksRes] = await Promise.all([
        fetch("/api/admin/stats", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/content", { headers })
      ]);
      if (statsRes.ok) setAdminStats(await statsRes.json());
      if (adminUsersRes.ok) setAdminUsers(await adminUsersRes.json());
      if (adminLinksRes.ok) setAdminLinks(await adminLinksRes.json());
    }
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

  const handleBackgroundUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const headers = getAuthHeaders();
    const formData = new FormData();
    formData.append("background", file);

    setIsUploadingBg(true);
    try {
      const res = await fetch("/api/profile/background", {
        method: "POST",
        headers: { "x-user-id": headers["x-user-id"] },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { ...prev, bg_image_url: data.bgImageUrl } : null);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/p/${profile?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = async () => {
    if (!newKeyName) return;
    const headers = getAuthHeaders();
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName })
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedKey(data.key);
      setNewKeyName("");
      fetchData();
    }
  };

  const handleDeleteKey = async (id: number) => {
    const headers = getAuthHeaders();
    const res = await fetch(`/api/keys/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) fetchData();
  };

  const handleCreateUser = async () => {
    const headers = getAuthHeaders();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      setIsCreatingUser(false);
      setNewUser({ username: "", email: "", password: "", plan: "free", role: "user" });
      fetchData();
    }
  };

  const handleUpdateUserRole = async (id: number, role: string) => {
    const headers = getAuthHeaders();
    const user = adminUsers.find(u => u.id === id);
    if (!user) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ plan: user.plan, role, is_verified: user.is_verified })
    });
    if (res.ok) fetchData();
  };

  const handleUpdateUserPlan = async (id: number, plan: string) => {
    const headers = getAuthHeaders();
    const user = adminUsers.find(u => u.id === id);
    if (!user) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ plan, role: user.role, is_verified: user.is_verified, is_featured: user.is_featured })
    });
    if (res.ok) fetchData();
  };

  const handleToggleFeatured = async (id: number) => {
    const headers = getAuthHeaders();
    const user = adminUsers.find(u => u.id === id);
    if (!user) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        plan: user.plan, 
        role: user.role, 
        is_verified: user.is_verified, 
        is_featured: user.is_featured === 1 ? 0 : 1 
      })
    });
    if (res.ok) fetchData();
  };

  const handleDeleteAdminLink = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    const headers = getAuthHeaders();
    const res = await fetch(`/api/admin/links/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) fetchData();
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    const headers = getAuthHeaders();
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) fetchData();
  };

  if (!profile) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 px-4 sm:px-0">
      {/* Editor Side */}
      <div className="flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Editor</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
              {copied ? "Copied!" : "Share"}
            </button>
            <a 
              href={`/p/${profile.username}`} 
              target="_blank" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              <Eye size={18} />
              Preview
            </a>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl w-full overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
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
            {profile.role === 'admin' && (
              <TabButton active={activeTab === 'developer'} onClick={() => setActiveTab('developer')}>
                <Code size={18} />
                Developer
              </TabButton>
            )}
            {profile.role === 'admin' && (
              <TabButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')}>
                <Shield size={18} />
                Admin
              </TabButton>
            )}
          </div>
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
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profile</h2>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 relative">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
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
                      className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 p-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50 text-zinc-900 dark:text-white"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Display Name</label>
                      <input 
                        type="text" 
                        value={profile.display_name}
                        onChange={(e) => handleUpdateProfile({ display_name: e.target.value })}
                        className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Bio</label>
                      <textarea 
                        value={profile.bio}
                        onChange={(e) => handleUpdateProfile({ bio: e.target.value })}
                        className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none h-24 resize-none text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Themes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map((theme) => (
                    <button 
                      key={theme.id}
                      onClick={() => handleUpdateProfile({ theme: theme.id })}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2",
                        profile.theme === theme.id ? "border-zinc-900 dark:border-white" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                      )}
                    >
                      <div className={cn("w-full h-12 rounded-lg", theme.bg)} />
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Background</h2>
                <div className="flex flex-col gap-4">
                  <div className="relative w-full h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 group">
                    {profile.bg_image_url ? (
                      <img src={profile.bg_image_url} alt="Background" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    {isUploadingBg && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => bgFileInputRef.current?.click()}
                        className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all text-zinc-900 dark:text-white"
                      >
                        Change Background
                      </button>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={bgFileInputRef}
                    onChange={handleBackgroundUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {profile.bg_image_url && (
                    <button 
                      onClick={() => handleUpdateProfile({ bg_image_url: "" })}
                      className="text-xs font-bold text-red-500 uppercase tracking-wider hover:underline self-start"
                    >
                      Remove Background Image
                    </button>
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Fonts</h2>
                <div className="grid grid-cols-2 gap-4">
                  {FONTS.map((font) => (
                    <button 
                      key={font.id}
                      onClick={() => handleUpdateProfile({ font_family: font.id })}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-1",
                        profile.font_family === font.id ? "border-zinc-900 dark:border-white" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                      )}
                    >
                      <span className={cn("text-lg text-zinc-900 dark:text-white", font.family)}>Abc</span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{font.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-8 transition-colors">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Total Clicks</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">{links.reduce((acc, curr) => acc + curr.clicks, 0)}</div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                  <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Active Links</div>
                  <div className="text-3xl font-bold text-zinc-900 dark:text-white">{links.filter(l => l.active).length}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Link Performance</h3>
                <div className="flex flex-col gap-2">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700">
                      <span className="font-medium text-zinc-900 dark:text-white">{link.title}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{link.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && subscription && (
            <div className="flex flex-col gap-8">
              {/* Current Plan */}
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Current Plan</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    subscription.plan === 'free' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400" : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  )}>
                    {subscription.plan}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-white">Status</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">{subscription.subscription_status}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-white">Next Billing Date</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {subscription.plan === 'free' ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-lg"
                  >
                    Upgrade to Pro
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 py-3 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all">
                      Manage Plan
                    </button>
                    <button className="flex-1 bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 py-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </section>

              {/* Payment History */}
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-zinc-400 dark:text-zinc-500" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Payment History</h2>
                </div>

                {subscription.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Date</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Plan</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Amount</th>
                          <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                        {subscription.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="py-4 text-sm text-zinc-600 dark:text-zinc-400">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-4 text-sm font-bold text-zinc-900 dark:text-white capitalize">{payment.plan}</td>
                            <td className="py-4 text-sm text-zinc-600 dark:text-zinc-400">{payment.currency} {payment.amount.toLocaleString()}</td>
                            <td className="py-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                payment.status === 'success' ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
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
                  <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                    <div className="text-zinc-400 dark:text-zinc-500 mb-2">No payments found</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Your payment history will appear here once you subscribe to a paid plan.</div>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'developer' && profile.role === 'admin' && (
            <div className="flex flex-col gap-8">
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">API Keys</h2>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Key Name (e.g. Mobile App)"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none text-zinc-900 dark:text-white"
                    />
                    <button 
                      onClick={handleGenerateKey}
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
                    >
                      Generate Key
                    </button>
                  </div>
                </div>

                {generatedKey && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">New API Key Generated</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">Make sure to copy this key now. You won't be able to see it again!</div>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                      <code className="flex-1 text-sm font-mono break-all text-zinc-900 dark:text-white">{generatedKey}</code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedKey);
                          setGeneratedKey(null);
                        }}
                        className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {apiKeys.length > 0 ? (
                    apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                        <div className="flex flex-col gap-1">
                          <div className="font-bold text-zinc-900 dark:text-white">{key.name}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{key.partial_key} • Created on {new Date(key.created_at).toLocaleDateString()}</div>
                        </div>
                        <button 
                          onClick={() => handleDeleteKey(key.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                      <div className="text-zinc-400 dark:text-zinc-500 mb-2">No API keys found</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Generate a key to access your data from external applications.</div>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-zinc-900 dark:bg-zinc-950 text-white p-8 rounded-3xl flex flex-col gap-6 border border-zinc-800">
                <h2 className="text-xl font-bold">API Documentation</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Authentication</div>
                    <p className="text-sm text-zinc-400">Include your API key in the <code className="text-zinc-200">x-api-key</code> header of your requests.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Endpoints</div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 bg-zinc-800 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-700 dark:border-zinc-800">
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">GET</span>
                        <code className="text-xs text-zinc-300 flex-1">/api/profile</code>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-800 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-700 dark:border-zinc-800">
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">GET</span>
                        <code className="text-xs text-zinc-300 flex-1">/api/links</code>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'admin' && profile.role === 'admin' && (
            <div className="flex flex-col gap-8">
              {/* Admin Stats */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-2">
                    <Users size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">{adminStats?.totalUsers || 0}</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-2">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Pro Users</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">{adminStats?.proUsers || 0}</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-2">
                    <Activity size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">{adminStats?.totalClicks || 0}</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-2">
                    <CreditCard size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">₦{(adminStats?.totalRevenue || 0).toLocaleString()}</div>
                </div>
              </section>

              {/* User Management */}
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">User Management</h2>
                  <button 
                    onClick={() => setIsCreatingUser(!isCreatingUser)}
                    className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
                  >
                    <UserPlus size={18} />
                    Add User
                  </button>
                </div>

                {isCreatingUser && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col gap-4 transition-colors">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Create New User</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none text-zinc-900 dark:text-white"
                      />
                      <input 
                        type="email" 
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none text-zinc-900 dark:text-white"
                      />
                      <input 
                        type="password" 
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none text-zinc-900 dark:text-white"
                      />
                      <div className="flex gap-2">
                        <select 
                          value={newUser.plan}
                          onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none text-zinc-900 dark:text-white"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="business">Business</option>
                        </select>
                        <select 
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none text-zinc-900 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsCreatingUser(false)}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleCreateUser}
                        className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
                      >
                        Create User
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">User</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Plan</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Role</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Featured</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="group">
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white">{user.display_name || user.username}</span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <select 
                              value={user.plan}
                              onChange={(e) => handleUpdateUserPlan(user.id, e.target.value)}
                              className="bg-transparent border-none text-sm font-bold capitalize outline-none cursor-pointer text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                              <option value="free" className="bg-white dark:bg-zinc-900">Free</option>
                              <option value="pro" className="bg-white dark:bg-zinc-900">Pro</option>
                              <option value="business" className="bg-white dark:bg-zinc-900">Business</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <select 
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="bg-transparent border-none text-sm font-bold capitalize outline-none cursor-pointer text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                              <option value="user" className="bg-white dark:bg-zinc-900">User</option>
                              <option value="admin" className="bg-white dark:bg-zinc-900">Admin</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <button 
                              onClick={() => handleToggleFeatured(user.id)}
                              className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                user.is_featured === 1 
                                  ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                              )}
                            >
                              {user.is_featured === 1 ? "Featured" : "Promote"}
                            </button>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => window.open(`/p/${user.username}`, '_blank')}
                                className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                title="View Profile"
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Content Moderation */}
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 transition-colors">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Content Moderation</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Link</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Owner</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Clicks</th>
                        <th className="pb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {adminLinks.map((link) => (
                        <tr key={link.id} className="group">
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white">{link.title}</span>
                              <a href={link.url} target="_blank" className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white truncate max-w-[200px]">{link.url}</a>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-900 dark:text-white">@{link.username}</span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{link.email}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{link.clicks}</span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleDeleteAdminLink(link.id)}
                              className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors"
                              title="Delete Link"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side (Sticky) */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="text-center mb-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Live Preview</div>
          <div className="w-[320px] h-[640px] bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-3 border-[8px] border-zinc-800 dark:border-zinc-900 shadow-2xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 dark:bg-zinc-900 rounded-b-2xl z-10" />
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
        active 
          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" 
          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function ProfilePreview({ profile, links }: { profile: Profile, links: LinkType[] }) {
  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const font = FONTS.find(f => f.id === profile.font_family) || FONTS[0];
  
  return (
    <div 
      className={cn("min-h-full p-8 flex flex-col items-center gap-8 relative", theme.bg, font.family)}
      style={profile.bg_image_url ? {
        backgroundImage: `url(${profile.bg_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {profile.bg_image_url && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />}
      
      <div className="flex flex-col items-center gap-4 text-center relative z-10">
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
          <h2 className={cn("text-xl font-bold", theme.text, profile.bg_image_url && "text-white drop-shadow-md")}>@{profile.username}</h2>
          <p className={cn("text-sm opacity-80", theme.text, profile.bg_image_url && "text-white drop-shadow-md")}>{profile.bio}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3 relative z-10">
        {links.filter(l => l.active).map(link => (
          <div 
            key={link.id}
            style={{ 
              color: link.color || (profile.bg_image_url ? '#ffffff' : (theme.id === 'dark' ? '#fafafa' : '#18181b')),
              borderColor: link.color ? `${link.color}40` : (profile.bg_image_url ? 'rgba(255,255,255,0.3)' : undefined),
              backgroundColor: link.color ? `${link.color}08` : (profile.bg_image_url ? 'rgba(255,255,255,0.1)' : undefined),
              backdropFilter: profile.bg_image_url ? 'blur(8px)' : undefined
            }}
            className={cn(
              "w-full py-4 px-6 rounded-2xl text-center font-bold transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-3 border",
              !link.color && !profile.bg_image_url && theme.button,
              !link.color && !profile.bg_image_url && theme.buttonText
            )}
          >
            {link.icon && <IconRenderer name={link.icon} size={20} />}
            {link.title}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 relative z-10">
        <div className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-50", theme.text, profile.bg_image_url && "text-white")}>
          Chip NG
        </div>
      </div>
    </div>
  );
}
