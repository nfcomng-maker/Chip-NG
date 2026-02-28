import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify/${token}`, {
          method: "POST",
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error);
        }
      } catch (err) {
        setStatus('error');
        setMessage("Failed to connect to server");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[3rem] border border-zinc-200 shadow-2xl w-full max-w-md text-center flex flex-col gap-6"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-zinc-900 animate-spin" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-zinc-500">{message}</p>
            <Link 
              to="/login" 
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all mt-4"
            >
              Log In to Your Account
              <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <XCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-zinc-500">{message}</p>
            <Link 
              to="/signup" 
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all mt-4"
            >
              Try Signing Up Again
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
