import { Check } from "lucide-react";
import { motion } from "motion/react";

export default function Pricing() {
  return (
    <div className="flex flex-col gap-16 py-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight">Choose your plan</h1>
        <p className="text-xl text-zinc-600">Simple, transparent pricing for creators and businesses in Nigeria.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard 
          name="Free"
          price="₦0"
          description="Perfect for individuals just starting out."
          features={[
            "Unlimited links",
            "Basic analytics",
            "Standard themes",
            "Chip NG branding"
          ]}
          buttonText="Get Started"
          active={false}
        />
        <PricingCard 
          name="Pro"
          price="₦2,500"
          period="/ month"
          description="For creators who want to stand out."
          features={[
            "Everything in Free",
            "Advanced analytics",
            "Custom themes",
            "Remove Chip NG branding",
            "Priority support"
          ]}
          buttonText="Upgrade to Pro"
          active={true}
        />
        <PricingCard 
          name="Business"
          price="₦7,500"
          period="/ month"
          description="For teams and growing businesses."
          features={[
            "Everything in Pro",
            "Multiple profiles",
            "Team collaboration",
            "Custom domains",
            "Dedicated account manager"
          ]}
          buttonText="Contact Sales"
          active={false}
        />
      </div>

      <section className="max-w-3xl mx-auto bg-white p-12 rounded-[3rem] border border-zinc-200 flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-6">
          <FAQItem 
            question="Can I cancel my subscription anytime?"
            answer="Yes, you can cancel your subscription at any time from your dashboard settings. You will continue to have access to Pro features until the end of your billing cycle."
          />
          <FAQItem 
            question="Do you support local payment methods?"
            answer="Absolutely! We support all major Nigerian cards, bank transfers, and USSD through our secure payment partners."
          />
          <FAQItem 
            question="Can I use my own domain?"
            answer="Yes, custom domain support is available on our Business plan. You can connect your own domain (e.g., links.yourbrand.com) to your Chip NG profile."
          />
        </div>
      </section>
    </div>
  );
}

function PricingCard({ name, price, period, description, features, buttonText, active }: { 
  name: string, 
  price: string, 
  period?: string, 
  description: string, 
  features: string[], 
  buttonText: string,
  active?: boolean
}) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={cn(
        "p-8 rounded-[2.5rem] border flex flex-col gap-8 transition-all",
        active ? "bg-zinc-900 text-white border-zinc-900 shadow-2xl scale-105" : "bg-white text-zinc-900 border-zinc-200 hover:shadow-xl"
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold">{price}</span>
          {period && <span className={cn("text-sm font-medium", active ? "text-zinc-400" : "text-zinc-500")}>{period}</span>}
        </div>
        <p className={cn("text-sm leading-relaxed", active ? "text-zinc-400" : "text-zinc-500")}>{description}</p>
      </div>

      <ul className="flex flex-col gap-4 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium">
            <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0", active ? "bg-zinc-800 text-emerald-400" : "bg-zinc-100 text-emerald-600")}>
              <Check size={12} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <button className={cn(
        "w-full py-4 rounded-2xl font-bold transition-all",
        active ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-zinc-900 text-white hover:bg-zinc-800"
      )}>
        {buttonText}
      </button>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-bold text-zinc-900">{question}</h4>
      <p className="text-zinc-600 leading-relaxed">{answer}</p>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
