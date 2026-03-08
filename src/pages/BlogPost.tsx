import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  image_url: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  category?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    fetch(`/api/blogs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Post Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-105 transition-transform">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
      <Helmet>
        <title>{post.meta_title || `${post.title} | Chip NG`}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
            {post.category && (
              <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1 rounded-full text-[10px]">
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
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold">
                {post.author_name[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{post.author_name}</span>
                <span className="text-xs text-zinc-500">Author</span>
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="aspect-video rounded-3xl overflow-hidden mb-12 border border-zinc-200 dark:border-zinc-800"
        >
          <img 
            src={post.image_url || `https://picsum.photos/seed/${post.slug}/1200/675`} 
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-zinc dark:prose-invert max-w-none"
        >
          <div className="markdown-body">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800"
        >
          <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Enjoyed this post?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto">
              Share it with your network or head back to our blog for more insights and updates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={handleShare}
                className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-105 transition-transform"
              >
                Share Post
              </button>
              <Link to="/blog" className="px-8 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-2xl font-bold hover:scale-105 transition-transform">
                Browse More
              </Link>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
