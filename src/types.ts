export interface User {
  id: number;
  username: string;
  email: string;
  plan: 'free' | 'pro' | 'business';
}

export interface Profile {
  user_id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
  font_family: string;
  bg_image_url: string;
  plan: string;
}

export interface Link {
  id: number;
  user_id: number;
  title: string;
  url: string;
  icon: string;
  position: number;
  clicks: number;
  active: number;
  color?: string;
}

export interface Theme {
  id: string;
  name: string;
  bg: string;
  text: string;
  card: string;
  button: string;
  buttonText: string;
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Classic White',
    bg: 'bg-white',
    text: 'text-zinc-900',
    card: 'bg-zinc-50',
    button: 'bg-zinc-900',
    buttonText: 'text-white'
  },
  {
    id: 'dark',
    name: 'Midnight',
    bg: 'bg-zinc-950',
    text: 'text-zinc-50',
    card: 'bg-zinc-900',
    button: 'bg-zinc-50',
    buttonText: 'text-zinc-950'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    bg: 'bg-orange-50',
    text: 'text-orange-950',
    card: 'bg-orange-100',
    button: 'bg-orange-600',
    buttonText: 'text-white'
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    bg: 'bg-emerald-950',
    text: 'text-emerald-50',
    card: 'bg-emerald-900',
    button: 'bg-emerald-500',
    buttonText: 'text-white'
  }
];

export interface Font {
  id: string;
  name: string;
  family: string;
}

export const FONTS: Font[] = [
  { id: 'sans', name: 'Modern Sans', family: 'font-sans' },
  { id: 'serif', name: 'Elegant Serif', family: 'font-serif' },
  { id: 'mono', name: 'Technical Mono', family: 'font-mono' },
  { id: 'display', name: 'Bold Display', family: 'font-display' },
];
