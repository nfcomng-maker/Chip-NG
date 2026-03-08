import { Link } from "react-router-dom";
import { Link2, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900">
                <Link2 size={20} />
              </div>
              Chip NG
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xs mb-6">
              The ultimate link-in-bio tool for creators and professionals in Nigeria. 
              Share everything you are in one simple link.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:vickthor.dennis@gmail.com" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <Mail size={18} />
                  vickthor.dennis@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+2348100764154" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <Phone size={18} />
                  +234 810 076 4154
                </a>
              </li>
              <li>
                <a href="https://wa.me/2348100764154" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <MessageCircle size={18} />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Chip NG. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
