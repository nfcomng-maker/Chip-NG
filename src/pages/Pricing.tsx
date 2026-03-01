import { Check } from "lucide-react";
import { motion } from "motion/react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("chip_user_id");
  const userEmail = localStorage.getItem("chip_user_email") || "customer@example.com";

  const handlePaymentSuccess = async (reference: any, plan: string) => {
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.reference, plan, userId })
      });
      if (res.ok) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Payment verification failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-16 py-12 px-4">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Choose your plan</h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">Simple, transparent pricing for creators and businesses in Nigeria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          onSelect={() => navigate("/dashboard")}
        />
        <PricingCard 
          name="Pro"
          price="₦5,000"
          amount={500000} // in kobo
          plan="pro"
          email={userEmail}
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
          onSuccess={handlePaymentSuccess}
        />
        <PricingCard 
          name="Business"
          price="₦10,000"
          amount={1000000} // in kobo
          plan="business"
          email={userEmail}
          period="/ month"
          description="For teams and growing businesses."
          features={[
            "Everything in Pro",
            "Multiple profiles",
            "Team collaboration",
            "Custom domains",
            "Dedicated account manager"
          ]}
          buttonText="Upgrade to Business"
          active={false}
          onSuccess={handlePaymentSuccess}
        />
      </div>

      <section className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-zinc-200 dark:border-zinc-800 flex flex-col gap-8 transition-colors">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
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

function PricingCard({ name, price, amount, plan, email, period, description, features, buttonText, active, onSelect, onSuccess }: { 
  name: string, 
  price: string, 
  amount?: number,
  plan?: string,
  email?: string,
  period?: string, 
  description: string, 
  features: string[], 
  buttonText: string,
  active?: boolean,
  onSelect?: () => void,
  onSuccess?: (reference: any, plan: string) => void
}) {
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || "customer@example.com",
    amount: amount || 0,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    } else if (onSuccess && plan) {
      initializePayment({
        onSuccess: (reference: any) => onSuccess(reference, plan),
        onClose: () => console.log("Payment closed"),
      });
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={cn(
        "p-8 rounded-[2.5rem] border flex flex-col gap-8 transition-all",
        active 
          ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-2xl md:scale-105" 
          : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:shadow-xl"
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold">{price}</span>
          {period && <span className={cn("text-sm font-medium", active ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400")}>{period}</span>}
        </div>
        <p className={cn("text-sm leading-relaxed", active ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400")}>{description}</p>
      </div>

      <ul className="flex flex-col gap-4 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium">
            <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0", active ? "bg-zinc-800 dark:bg-zinc-100 text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400")}>
              <Check size={12} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <button 
        onClick={handleClick}
        className={cn(
          "w-full py-4 rounded-2xl font-bold transition-all",
          active 
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" 
            : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
        )}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-bold text-zinc-900 dark:text-white">{question}</h4>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{answer}</p>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
