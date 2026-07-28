import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Eye, EyeOff, Delete, User, Lock, ShieldCheck, Zap, BarChart3, RotateCw } from 'lucide-react';
import { Logo } from '../components/Logo';
import { InputRecoveryButton } from '../components/InputRecoveryButton';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<'username' | 'password'>('username');

  const { login, isLoading, error, clearError } = useAuthStore();
  const { language, dir } = useLanguageStore();
  const t = translations[language];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

  const isAr = language === 'ar';
  const isKu = language === 'ku';

  const operatorLabel = isAr ? 'بيانات المشغّل' : isKu ? 'زانیاری کارمەند' : 'Operator credentials';
  const keypadLabel = isAr ? 'لوحة الأرقام' : isKu ? 'پانێڵی ژمارە' : 'KEYPAD';
  const readyLabel = isAr ? 'المحطة جاهزة' : isKu ? 'وێستگە ئامادەیە' : 'Station ready';
  const refreshLabel = isAr ? 'تحديث المدخلات' : isKu ? 'نوێکردنەوە' : 'Refresh Inputs';

  const highlights = [
    {
      icon: Zap,
      title: isAr ? 'أداء فوري' : isKu ? 'کارایی خێرا' : 'Instant performance',
      desc: isAr ? 'بيع وطباعة خلال ثوانٍ' : isKu ? 'فرۆشتن و چاپکردن بە چرکە' : 'Sell and print in seconds',
    },
    {
      icon: BarChart3,
      title: isAr ? 'تقارير مباشرة' : isKu ? 'ڕاپۆرتی ڕاستەوخۆ' : 'Live reporting',
      desc: isAr ? 'أرباح ومخزون لحظياً' : isKu ? 'قازانج و کۆگا ڕاستەوخۆ' : 'Profit and stock in real time',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'حماية كاملة' : isKu ? 'پاراستنی تەواو' : 'Full protection',
      desc: isAr ? 'صلاحيات وجلسات مؤمّنة' : isKu ? 'دەسەڵات و دانیشتنی پارێزراو' : 'Roles and secured sessions',
    },
  ];

  const isValid = username.trim().length > 0 && password.trim().length > 0;

  return (
    <div
      dir={dir}
      className="relative flex h-full min-h-screen w-full select-none items-center justify-center overflow-y-auto bg-gradient-to-br from-[#edf2f9] via-[#e5eef7] to-[#e2ebf5] p-4 font-sans text-slate-800 custom-scrollbar"
    >
      {/* Background Soft Glow Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 my-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.12)] lg:flex-row"
      >
        {/* BRAND BLUE PANEL - INNOVATIVE AURORA & GLASS DESIGN */}
        <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0b2253] via-[#0f3475] to-[#1c4ad2] p-8 text-white lg:w-[46%] lg:p-9">
          {/* Fluid Floating Light Orbs (No Grid Lines) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                x: [0, 30, 0],
                y: [0, -25, 0],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/25 blur-[65px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -40, 0],
                y: [0, 35, 0],
                opacity: [0.25, 0.45, 0.25],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-[75px]"
            />
            <motion.div
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/3 h-56 w-56 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[55px]"
            />
          </div>

          {/* Logo & Headline */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 border border-white/20 shadow-lg backdrop-blur-md">
                  <span className="absolute inset-0 rounded-2xl bg-cyan-400/20 animate-ping opacity-30" />
                  <Logo size={28} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-cyan-300">KODIFY</p>
                  <h1 className="truncate text-lg font-extrabold tracking-tight text-white">{t.appName}</h1>
                </div>
              </div>

              {/* Live Engine Badge */}
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-cyan-200 border border-white/15 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                POS v1.0.6
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold leading-snug tracking-tight text-white lg:text-[1.85rem]">
              {isAr
                ? 'أدر متجرك بسرعة وثقة'
                : isKu
                  ? 'فرۆشگاکەت بە خێرایی بەڕێوە ببە'
                  : 'Run your store with speed and confidence'}
            </h2>
            <p className="mt-2 text-xs font-normal leading-relaxed text-blue-100/80">{t.loginSubtitle}</p>
          </div>

          {/* Futuristic Interactive Glass Feature Cards */}
          <div className="relative z-10 mt-8 space-y-2.5">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              const badges = [
                isAr ? 'أداء ~0.1ث' : '⚡ 0.1s',
                isAr ? 'مباشر' : 'Live Sync',
                isAr ? 'مشفر 256-bit' : 'AES-256',
              ];

              return (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 5, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group relative flex items-center justify-between rounded-2xl border border-white/15 bg-gradient-to-r from-white/[0.12] to-white/[0.04] p-3.5 backdrop-blur-md transition-all hover:border-cyan-300/40 hover:bg-white/[0.16] shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 text-cyan-200 border border-white/10 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight text-white group-hover:text-cyan-100 transition-colors">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-blue-100/75">{item.desc}</p>
                    </div>
                  </div>

                  {/* Tech Micro Tag */}
                  <span className="shrink-0 rounded-lg bg-cyan-400/10 px-2 py-0.5 text-[9px] font-extrabold text-cyan-300 border border-cyan-400/20">
                    {badges[idx]}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </aside>

        {/* AUTH FORM & KEYPAD PANEL */}
        <section className="flex flex-1 flex-col justify-between bg-white p-7 lg:p-9">
          <div>
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">{t.loginBtn}</h3>
                <p className="mt-0.5 text-xs font-medium text-slate-400">{operatorLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <InputRecoveryButton variant="login" focusSelector="input[type='text']" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {readyLabel}
                </span>
              </div>
            </div>

            {/* Error Message */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 border border-rose-200">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      <span>{error === 'timeout' ? t.loginTimeout : t.loginError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Input */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">{t.username}</label>
                <div className="relative">
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${
                      activeInput === 'username' ? 'text-blue-600' : 'text-slate-400'
                    } ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'}`}
                  >
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => {
                      clearError();
                      setActiveInput('username');
                    }}
                    placeholder={t.username}
                    className={`w-full rounded-2xl border bg-[#f8fafc] py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 ${
                      dir === 'rtl' ? 'pr-11 pl-4' : 'pl-11 pr-4'
                    } ${
                      activeInput === 'username'
                        ? 'border-blue-500 bg-white ring-4 ring-blue-500/15 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isLoading}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">{t.password}</label>
                <div className="relative">
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${
                      activeInput === 'password' ? 'text-blue-600' : 'text-slate-400'
                    } ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'}`}
                  >
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      clearError();
                      setActiveInput('password');
                    }}
                    placeholder={t.password}
                    className={`w-full rounded-2xl border bg-[#f8fafc] py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 ${
                      dir === 'rtl' ? 'pr-11 pl-11' : 'pl-11 pr-11'
                    } ${
                      activeInput === 'password'
                        ? 'border-blue-500 bg-white ring-4 ring-blue-500/15 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 ${
                      dir === 'rtl' ? 'left-3.5' : 'right-3.5'
                    }`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className={`mt-2 w-full rounded-2xl py-3.5 text-sm font-bold tracking-wide transition-all duration-150 ${
                  isValid
                    ? 'bg-[#2563eb] text-white shadow-[0_8px_22px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-[0.99]'
                    : 'bg-[#cbd5e1] text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  t.loginBtn
                )}
              </button>
            </form>
          </div>

          {/* Keypad Section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{keypadLabel}</p>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                {activeInput === 'password' ? 'PWD' : 'USR'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumpadClick(num)}
                  className="h-12 rounded-2xl border border-slate-200/90 bg-white font-mono text-lg font-bold text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:bg-slate-50 active:scale-95 active:bg-slate-100"
                >
                  {num}
                </button>
              ))}

              {/* Backspace Button */}
              <button
                type="button"
                onClick={handleBackspace}
                className="flex h-12 items-center justify-center rounded-2xl border border-rose-200/80 bg-[#fff1f2] text-rose-500 transition-all hover:bg-rose-100 active:scale-95"
              >
                <Delete size={18} />
              </button>

              {/* Zero Button */}
              <button
                type="button"
                onClick={() => handleNumpadClick('0')}
                className="h-12 rounded-2xl border border-slate-200/90 bg-white font-mono text-lg font-bold text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all hover:bg-slate-50 active:scale-95 active:bg-slate-100"
              >
                0
              </button>

              {/* Confirm / Submit Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading || !isValid}
                className={`h-12 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                  isValid
                    ? 'bg-[#18212f] text-white shadow-md hover:bg-blue-600'
                    : 'bg-[#e2e8f0] text-slate-500 cursor-not-allowed'
                }`}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Footer */}
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 z-0 text-center text-[10px] font-semibold tracking-[0.2em] text-slate-400">
        © {new Date().getFullYear()} KODIFY · POS SYSTEM
      </p>
    </div>
  );
};

