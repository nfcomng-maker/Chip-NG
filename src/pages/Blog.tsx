import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  image_url: string;
  category?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 px-4">
      <Helmet>
        <title>Blog | Chip NG</title>
        <meta name="description" content="Read the latest news, updates, and articles from Chip NG." />
        <meta property="og:title" content="Blog | Chip NG" />
        <meta property="og:description" content="Read the latest news, updates, and articles from Chip NG." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight"
          >
            Our <span className="text-zinc-400">Blog</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Latest news, updates, and insights from the Chip NG team.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all"
              >
                <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                  <img 
                    src={post.image_url || `https://picsum.photos/seed/${post.slug}/800/450`} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                    {post.category && (
                      <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2 py-0.5 rounded-full text-[10px]">
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author_name}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white group/link"
                  >
                    Read More 
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
