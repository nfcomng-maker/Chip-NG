import React, { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Have questions or need help? We're here for you. Reach out to us via any of the channels below.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"
            >
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <a href="mailto:vickthor.dennis@gmail.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Email</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">vickthor.dennis@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+2348100764154" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Phone</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">+234 810 076 4154</p>
                  </div>
                </a>

                <a href="https://wa.me/2348100764154" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">WhatsApp</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Chat with us</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Location</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-zinc-900"
            >
              <h3 className="font-bold mb-2">Support Hours</h3>
              <p className="text-sm opacity-80">Monday - Friday: 9am - 6pm</p>
              <p className="text-sm opacity-80">Saturday: 10am - 4pm</p>
              <p className="text-sm opacity-80">Sunday: Closed</p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 h-full"
            >
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Message Sent!</h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sm font-bold text-zinc-900 dark:text-white hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">Your Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-900 dark:text-white">Subject</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-900 dark:text-white">Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none resize-none"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-white/5"
                    >
                      <Send size={18} />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
