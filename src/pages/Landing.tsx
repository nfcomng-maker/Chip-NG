import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Link2, Zap, BarChart3, Palette, CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

export default function Landing() {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight"
        >
          One link for <span className="text-zinc-500">everything</span> you create.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-600 leading-relaxed"
        >
          The only link you'll ever need. Share your content, sell products, and grow your audience with a beautiful, mobile-optimized profile.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/dashboard" className="bg-zinc-900 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
            Get Started for Free
          </Link>
          <Link to="/pricing" className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-50 transition-all w-full sm:w-auto">
            View Pricing
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Palette className="text-zinc-900" />}
          title="Beautiful Themes"
          description="Choose from a variety of professionally designed themes or create your own to match your brand."
        />
        <FeatureCard 
          icon={<BarChart3 className="text-zinc-900" />}
          title="Advanced Analytics"
          description="Track your clicks, views, and audience growth with detailed insights and reporting."
        />
        <FeatureCard 
          icon={<Zap className="text-zinc-900" />}
          title="Lightning Fast"
          description="Optimized for speed and mobile devices, ensuring your audience has the best experience."
        />
      </section>

      {/* Pricing Teaser */}
      <section className="bg-zinc-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-4xl font-bold">Simple, transparent pricing for everyone.</h2>
          <p className="text-zinc-400 text-lg">Start for free and upgrade as you grow. No hidden fees, cancel anytime.</p>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Unlimited links on all plans
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Custom ₦ pricing for Nigeria
            </li>
            <li className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Priority support for Pro users
            </li>
          </ul>
          <Link to="/pricing" className="bg-white text-zinc-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-100 transition-all w-fit">
            See All Plans
          </Link>
        </div>
        <div className="flex-1 bg-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-2xl rotate-3">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-700 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 bg-zinc-700 rounded" />
              <div className="w-24 h-3 bg-zinc-700/50 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full h-12 bg-zinc-700 rounded-xl" />
            <div className="w-full h-12 bg-zinc-700 rounded-xl" />
            <div className="w-full h-12 bg-zinc-700 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-200 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
      <p className="text-zinc-600 leading-relaxed">{description}</p>
    </div>
  );
}
