import React from "react";
import { motion } from "motion/react";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is Chip NG?",
        answer: "Chip NG is the ultimate link-in-bio tool designed specifically for creators, entrepreneurs, and professionals in Nigeria. It allows you to create a single, beautiful landing page that houses all your important links, social media profiles, and contact information."
      },
      {
        question: "How do I get started?",
        answer: "Getting started is easy! Simply sign up for a free account, choose your unique username (e.g., chip.ng/yourname), and start adding your links. You can customize your profile with different themes and layouts to match your brand."
      },
      {
        question: "Is Chip NG free to use?",
        answer: "Yes! We offer a generous Free plan that includes unlimited links, basic analytics, and standard themes. For users who want more advanced features like custom domains, advanced analytics, and the ability to remove Chip NG branding, we offer Pro and Business plans."
      }
    ]
  },
  {
    category: "Features & Customization",
    questions: [
      {
        question: "Can I use my own custom domain?",
        answer: "Yes, custom domain support is available on our Business plan. You can connect your own domain (e.g., links.yourbrand.com) to your Chip NG profile for a more professional look."
      },
      {
        question: "How many links can I add?",
        answer: "You can add unlimited links on all our plans, including the Free plan. We believe you should be able to share everything that matters to you without restrictions."
      },
      {
        question: "Can I track how many people click my links?",
        answer: "Absolutely! All plans include basic analytics. Our Pro and Business plans offer more detailed insights, including visitor demographics, traffic sources, and click-through rates over time."
      }
    ]
  },
  {
    category: "Payments & Billing",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We support all major Nigerian payment methods through Paystack, including local debit cards (Verve, Mastercard, Visa), bank transfers, and USSD."
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time from your dashboard settings. You will continue to have access to your paid features until the end of your current billing cycle."
      },
      {
        question: "Do you offer refunds?",
        answer: "We generally do not offer refunds for active subscriptions, but if you have a specific issue or made a mistake during checkout, please contact our support team, and we'll do our best to help."
      }
    ]
  },
  {
    category: "Support",
    questions: [
      {
        question: "How can I contact support?",
        answer: "You can reach our support team via email at vickthor.dennis@gmail.com, through our WhatsApp support line, or by using the contact form on our Contact Us page. We're here to help!"
      },
      {
        question: "Do you have a community for creators?",
        answer: "We are currently building a community for Chip NG creators to share tips, collaborate, and grow together. Stay tuned for updates on our social media channels!"
      }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white mx-auto mb-6"
          >
            <HelpCircle size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Everything you need to know about Chip NG. Can't find the answer you're looking for? Reach out to our support team.
          </motion.p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-4 border-l-4 border-zinc-900 dark:border-white">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, fIdx) => (
                  <FAQAccordionItem key={fIdx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 md:p-12 bg-zinc-900 dark:bg-white rounded-[2.5rem] text-white dark:text-zinc-900 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="opacity-80 mb-8 max-w-lg mx-auto">
            We're always here to help you grow your brand. Contact our support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold rounded-2xl hover:opacity-90 transition-all"
            >
              Contact Support
            </a>
            <a 
              href="https://wa.me/2348100764154" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FAQAccordionItem({ question, answer }: { question: string, answer: string, key?: React.Key }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 transition-all hover:border-zinc-200 dark:hover:border-zinc-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4"
      >
        <span className="font-bold text-zinc-900 dark:text-white">{question}</span>
        <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus size={20} className="text-zinc-400" /> : <Plus size={20} className="text-zinc-400" />}
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-800/50">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
