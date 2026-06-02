import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { ShieldCheck, Eye, EyeOff, Delete, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [username, setUsername] = useState(''); // starts empty
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<'username' | 'password'>('username');
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    const success = await login(username, password);
    if (!success) {
      // Auto clear password for retry
      setPassword('');
    }
  };

  const handleNumpadClick = (value: string) => {
    clearError();
    if (activeInput === 'password') {
      setPassword((prev) => prev + value);
    } else {
      setUsername((prev) => prev + value);
    }
  };

  const handleBackspace = () => {
    if (activeInput === 'password') {
      setPassword((prev) => prev.slice(0, -1));
    } else {
      setUsername((prev) => prev.slice(0, -1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col md:flex-row h-full w-full bg-pos-bg font-sans"
    >
      
      {/* Visual side panel */}
      <div className="relative w-full md:w-1/2 overflow-hidden border-white/6 md:border-r border-b md:border-b-0">
        {/* Animated grid/particles background (CSS-only, light-weight) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-3xl bg-indigo-500/20" />
          <div className="absolute -bottom-40 -right-40 w-[620px] h-[620px] rounded-full blur-3xl bg-cyan-500/15" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.12),transparent_42%)]" />
        </div>

        <div className="relative h-full flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.45),rgba(6,182,212,0.30))] blur-xl opacity-70 animate-pulse" />
              <div className="relative p-2 rounded-2xl border border-white/10 bg-white/5 glass">
                <Logo size={40} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wide text-slate-100">{t.appName}</span>
              <span className="text-xs text-slate-300/80 font-semibold tracking-wide">
                {language === 'ar' ? 'تجربة نقاط بيع فاخرة' : 'Premium POS Experience'}
              </span>
            </div>
          </div>

          <div className="my-auto py-12">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-[linear-gradient(135deg,#6366f1_0%,#06b6d4_70%)] leading-tight">
            {language === 'ar' ? 'نظام مبيعات ذكي موثوق وسريع' : 'Fast, Secure and Intelligent POS System'}
            </h1>
            <p className="text-slate-300/80 text-sm mt-4 leading-relaxed max-w-md">
              {language === 'ar' 
                ? 'Kodify System يقدم تجربة نقاط بيع متكاملة للمبيعات والمخزون والعملاء وإدارة الورديات — بواجهة فاخرة وسريعة.'
                : 'Kodify System delivers a premium POS: sales, inventory, customers, shifts, and hardware integrations — fast and beautiful.'}
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs text-slate-300/80">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 glass">
                <Sparkles size={14} className="text-cyan-200" />
                {language === 'ar' ? 'واجهة زجاجية فاخرة' : 'Premium glass UI'}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 glass">
                <ShieldCheck size={14} className="text-emerald-200" />
                {language === 'ar' ? 'أمان وصلاحيات' : 'Secure access'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300/60">
            <span>&copy; {new Date().getFullYear()} {t.appName}. All Rights Reserved.</span>
          </div>
        </div>
      </div>

      {/* Login input & Numpad side panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-7 shadow-glass">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-100">{t.loginTitle}</h2>
                <p className="text-slate-300/70 text-sm mt-1">{t.loginSubtitle}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 glass flex items-center justify-center shadow-glow-indigo">
                <ShieldCheck size={18} className="text-indigo-200" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
              {/* Error banner */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs py-3 px-4 rounded-2xl flex items-center gap-2">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span className="font-semibold">{t.loginError}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => { clearError(); setActiveInput('username'); }}
                  placeholder={t.username}
                  className={`w-full bg-white/5 border px-4 py-3.5 rounded-2xl text-sm text-slate-100 transition-all outline-none placeholder:text-slate-400/60 ${
                    activeInput === 'username' ? 'border-indigo-400/40 ring-1 ring-indigo-500/20 shadow-glow-indigo' : 'border-white/8'
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => { clearError(); setActiveInput('password'); }}
                  placeholder={t.password}
                  className={`w-full bg-white/5 border px-4 py-3.5 rounded-2xl text-sm text-slate-100 transition-all outline-none placeholder:text-slate-400/60 ${
                    activeInput === 'password' ? 'border-cyan-400/35 ring-1 ring-cyan-500/15 shadow-glow-cyan' : 'border-white/8'
                  }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-300/70 hover:text-slate-100 ${dir === 'rtl' ? 'left-4' : 'right-4'}`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Login button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full py-3 rounded-2xl font-extrabold text-sm text-white border border-white/10 btn-primary btn-shimmer disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-glow-cyan" />
                  {isLoading ? t.loading : t.loginBtn}
                </span>
              </motion.button>
            </form>
          </div>

          {/* Visual Numpad for touchscreen POS terminals */}
          <div className="glass-card p-4 md:p-5 shadow-glass">
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <motion.button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 rounded-2xl border border-white/10 bg-white/5 glass text-slate-100 text-xl font-black hover:bg-white/10 transition-all"
                >
                  {num}
                </motion.button>
              ))}
              
              {/* Backspace */}
              <motion.button
                type="button"
                onClick={handleBackspace}
                whileTap={{ scale: 0.97 }}
                className="h-14 rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-200 flex items-center justify-center hover:bg-rose-500/15 transition-all"
              >
                <Delete size={20} />
              </motion.button>

              {/* Zero */}
              <motion.button
                type="button"
                onClick={() => handleNumpadClick('0')}
                whileTap={{ scale: 0.97 }}
                className="h-14 rounded-2xl border border-white/10 bg-white/5 glass text-slate-100 text-xl font-black hover:bg-white/10 transition-all"
              >
                0
              </motion.button>

              {/* Submit triggers form */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileTap={{ scale: 0.97 }}
                className="h-14 rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(99,102,241,0.18),rgba(6,182,212,0.18))] text-cyan-100 text-xs font-extrabold hover:shadow-glow-cyan transition-all uppercase"
              >
                {t.confirm}
              </motion.button>
            </div>
          </div>

        </div>
      </div>
      
    </motion.div>
  );
};
