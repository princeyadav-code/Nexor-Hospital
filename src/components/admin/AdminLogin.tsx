import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowRight, HeartPulse, AlertCircle, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { adminLogin } = useHospital();
  const [username, setUsername] = useState('princecoding246@gmail.com');
  const [password, setPassword] = useState('6206021');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanUsername = username.replace(/\s+/g, '').trim();
    const res = await adminLogin(password.trim(), cleanUsername);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed. Please check admin credentials.');
    }
  };

  const handleFillDemo = () => {
    setUsername('princecoding246@gmail.com');
    setPassword('6206021');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center px-4 py-6 sm:py-8 relative overflow-hidden text-slate-100">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/50 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Header with Back to Website Action */}
      <div className="w-full max-w-4xl relative z-20 flex items-center justify-between py-2 mb-4">
        <button
          id="admin-login-back-btn"
          type="button"
          onClick={onBackToPublic}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Hospital Website</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>TLS 256-Bit Encrypted Portal</span>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Hospital Branding Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-xl shadow-cyan-950 mb-2">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Nexora Hospital System
          </h1>
          <p className="text-xs text-slate-400">
            Secure Administrative Management & Clinical Command Portal
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Sign-In</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              v2.4 SECURE
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="princecoding246@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Authorized Credentials Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Authorized Admin Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>Email: <span className="text-cyan-300 font-bold">princecoding246@gmail.com</span></div>
              <div>Pass: <span className="text-teal-300 font-bold">6206021</span></div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              id="admin-login-card-back-btn"
              type="button"
              onClick={onBackToPublic}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Public Hospital Website</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-[11px] text-slate-600 text-center py-2">
        Nexora Hospital Management System • Unauthorized access is strictly logged and audited.
      </div>
    </div>
  );
};
