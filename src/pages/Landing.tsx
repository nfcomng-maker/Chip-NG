import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Link2, Zap, BarChart3, Palette, CheckCircle2, User, ArrowRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Landing() {
  const [featured, setFeatured] = useState<Array<{ username: string, display_name: string, avatar_url: string, bio: string }>>([]);

  useEffect(() => {
    fetch("/api/featured")
      .then(res => res.json())
      .then(data => setFeatured(data))
      .catch(err => console.error("Failed to fetch featured creators", err));
  }, []);

  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-8 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
        >
          One link for <span className="text-zinc-500 dark:text-zinc-400">everything</span> you create.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
        >
          The only link you'll ever need. Share your content, sell products, and grow your audience with a beautiful, mobile-optimized profile.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/dashboard" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
            Get Started for Free
          </Link>
          <Link to="/pricing" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all w-full sm:w-auto">
            View Pricing
          </Link>
        </motion.div>
      </section>

      {/* Featured Creators */}
      {featured.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 px-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Featured Creators</h2>
            <Link to="/explore" className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((creator, index) => (
              <motion.div
                key={creator.username}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/p/${creator.username}`}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all hover:-translate-y-1 group block h-full"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 group-hover:border-zinc-900 dark:group-hover:border-white transition-colors">
                      {creator.avatar_url ? (
                        <img src={creator.avatar_url} alt={creator.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white">@{creator.username}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{creator.bio}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <FeatureCard 
          index={0}
          icon={<Palette className="text-zinc-900 dark:text-white" />}
          title="Beautiful Themes"
          description="Choose from a variety of professionally designed themes or create your own to match your brand."
        />
        <FeatureCard 
          index={1}
          icon={<BarChart3 className="text-zinc-900 dark:text-white" />}
          title="Advanced Analytics"
          description="Track your clicks, views, and audience growth with detailed insights and reporting."
        />
        <FeatureCard 
          index={2}
          icon={<Zap className="text-zinc-900 dark:text-white" />}
          title="Lightning Fast"
          description="Optimized for speed and mobile devices, ensuring your audience has the best experience."
        />
      </section>

      {/* Pricing Teaser */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-zinc-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center gap-12 mx-4 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="flex-1 flex flex-col gap-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing for everyone.</h2>
          <p className="text-zinc-400 text-base sm:text-lg">Start for free and upgrade as you grow. No hidden fees, cancel anytime.</p>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Unlimited links on all plans
            </li>
            <li className="flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Custom ₦ pricing for Nigeria
            </li>
            <li className="flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Priority support for Pro users
            </li>
          </ul>
          <Link to="/pricing" className="bg-white text-zinc-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-100 transition-all w-full sm:w-fit text-center">
            See All Plans
          </Link>
        </div>
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [3, 1, 3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex-1 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full relative z-10 max-w-sm mx-auto"
        >
          {/* Mock Profile Header */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src="https://picsum.photos/seed/creator/200" alt="Mock" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />
            </div>
          </div>

          {/* Mock Links */}
          <div className="flex flex-col gap-3">
            {[
              { color: 'bg-zinc-900 dark:bg-white', text: 'bg-white/20 dark:bg-zinc-200' },
              { color: 'bg-indigo-500', text: 'bg-white/20' },
              { color: 'bg-emerald-500', text: 'bg-white/20' }
            ].map((link, i) => (
              <motion.div 
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className={cn("w-full h-14 rounded-2xl flex items-center px-4 gap-3 shadow-sm", link.color)}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/40 rounded-sm" />
                </div>
                <div className={cn("h-3 w-24 rounded-full", link.text)} />
                <ArrowRight size={14} className="ml-auto text-white/40" />
              </motion.div>
            ))}
          </div>

          {/* Mock Stats/Badges */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <BarChart3 size={12} />
              12.4k Clicks
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Zap size={12} />
              Pro Plan
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}

function FeatureCard({ icon, title, description, index }: { icon: ReactNode, title: string, description: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
