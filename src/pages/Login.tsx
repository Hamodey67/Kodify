import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { ShieldCheck, Eye, EyeOff, Delete, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
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

  // Framer Motion Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  const backgroundBlobVariants1 = {
    animate: {
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.05, 0.95, 1],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as any,
      }
    }
  };

  const backgroundBlobVariants2 = {
    animate: {
      x: [0, -35, 25, 0],
      y: [0, 45, -20, 0],
      scale: [1, 0.92, 1.08, 1],
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as any,
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-pos-bg font-sans overflow-hidden">
      
      {/* Visual side panel */}
      <div className="relative w-full md:w-1/2 overflow-hidden border-white/6 md:border-r border-b md:border-b-0 flex flex-col justify-between p-8 md:p-10">
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <motion.div
            variants={backgroundBlobVariants1}
            animate="animate"
            className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-3xl bg-indigo-500/18"
          />
          <motion.div
            variants={backgroundBlobVariants2}
            animate="animate"
            className="absolute -bottom-40 -right-40 w-[620px] h-[620px] rounded-full blur-3xl bg-cyan-500/12"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.1),transparent_42%)]" />
        </div>

        {/* Content wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 h-full flex flex-col justify-between"
        >
          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.4),rgba(6,182,212,0.25))] blur-xl opacity-60 animate-pulse" />
              <div className="relative p-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <Logo size={38} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wide text-slate-100">{t.appName}</span>
              <span className="text-[10px] text-teal-400 font-extrabold tracking-wider uppercase">
                {language === 'ar' ? 'تجربة مبيعات فاخرة' : 'Premium POS System'}
              </span>
            </div>
          </motion.div>

          {/* Slogan */}
          <div className="my-auto py-12">
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-[linear-gradient(135deg,#818cf8_0%,#22d3ee_100%)] leading-tight tracking-tight"
            >
              {language === 'ar' ? 'نظام مبيعات ذكي موثوق وسريع' : 'Fast, Secure and Intelligent POS System'}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-slate-300/80 text-sm mt-4 leading-relaxed max-w-md font-medium"
            >
              {language === 'ar' 
                ? 'نظام كوديفاي يقدم تجربة نقاط بيع متكاملة للمبيعات والمخزون والعملاء وإدارة الورديات — بواجهة زجاجية فاخرة وسريعة.'
                : 'Kodify System delivers a premium POS: sales, inventory, customers, shifts, and hardware integrations — fast and beautiful.'}
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-8 flex items-center gap-2 text-[11px] font-semibold text-slate-300/80">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 bg-white/5 backdrop-blur-md shadow-sm">
                <Sparkles size={13} className="text-cyan-300 animate-pulse" />
                {language === 'ar' ? 'واجهة زجاجية فاخرة' : 'Premium glass UI'}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 bg-white/5 backdrop-blur-md shadow-sm">
                <ShieldCheck size={13} className="text-emerald-400" />
                {language === 'ar' ? 'أمان وصلاحيات كاملة' : 'Secure access'}
              </span>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="text-xs text-slate-400/60 font-semibold mt-4">
            <span>&copy; {new Date().getFullYear()} {t.appName}. All Rights Reserved.</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Login inputs & Numpad side panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md flex flex-col gap-5"
        >
          
          {/* Header Card */}
          <motion.div variants={itemVariants} className="glass-card p-6 md:p-7 shadow-glass relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-cyan-400/40 opacity-50" />
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-100">{t.loginTitle}</h2>
                <p className="text-slate-400/80 text-xs mt-1 font-semibold">{t.loginSubtitle}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-glow-indigo/10">
                <ShieldCheck size={18} className="text-indigo-300" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
              {/* Error banner */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs py-3 px-4 rounded-xl flex items-center gap-2"
                >
                  <ShieldCheck size={14} className="shrink-0" />
                  <span className="font-semibold">{error === 'timeout' ? t.loginTimeout : t.loginError}</span>
                </motion.div>
              )}

              {/* Username Input */}
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => { clearError(); setActiveInput('username'); }}
                  placeholder={t.username}
                  className={`w-full bg-white/5 border px-4 py-3.5 rounded-xl text-sm text-slate-100 transition-all duration-300 outline-none placeholder:text-slate-400/60 ${
                    activeInput === 'username' 
                      ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] bg-slate-800/20' 
                      : 'border-white/8 hover:border-white/15'
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
                  className={`w-full bg-white/5 border px-4 py-3.5 rounded-xl text-sm text-slate-100 transition-all duration-300 outline-none placeholder:text-slate-400/60 ${
                    activeInput === 'password' 
                      ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.12)] bg-slate-800/20' 
                      : 'border-white/8 hover:border-white/15'
                  }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition-colors ${dir === 'rtl' ? 'left-4' : 'right-4'}`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Login button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white border border-white/10 btn-primary btn-shimmer disabled:opacity-40 disabled:pointer-events-none transition-all shadow-lg hover:shadow-indigo-500/10"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-glow-cyan" />
                      {t.loginBtn}
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Visual Numpad */}
          <motion.div variants={itemVariants} className="glass-card p-4 md:p-5 shadow-glass">
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <motion.button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}
                  whileTap={{ scale: 0.96 }}
                  className="h-14 rounded-xl border border-white/8 bg-white/4 text-slate-100 text-lg font-black transition-colors"
                >
                  {num}
                </motion.button>
              ))}
              
              {/* Backspace */}
              <motion.button
                type="button"
                onClick={handleBackspace}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.25)' }}
                whileTap={{ scale: 0.96 }}
                className="h-14 rounded-xl border border-rose-500/10 bg-rose-500/8 text-rose-300 flex items-center justify-center transition-colors"
              >
                <Delete size={20} />
              </motion.button>

              {/* Zero */}
              <motion.button
                type="button"
                onClick={() => handleNumpadClick('0')}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.96 }}
                className="h-14 rounded-xl border border-white/8 bg-white/4 text-slate-100 text-lg font-black transition-colors"
              >
                0
              </motion.button>

              {/* Submit / Confirm */}
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ 
                  scale: 1.03, 
                  background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.25))',
                  borderColor: 'rgba(6,182,212,0.4)',
                  boxShadow: '0 0 15px rgba(6,182,212,0.15)'
                }}
                whileTap={{ scale: 0.96 }}
                className="h-14 rounded-xl border border-cyan-500/15 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(6,182,212,0.12))] text-cyan-200 text-xs font-bold transition-all uppercase tracking-wider"
              >
                {t.confirm}
              </motion.button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};
