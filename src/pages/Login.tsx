import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { ShieldCheck, Eye, EyeOff, Delete, User, Lock, Sparkles } from 'lucide-react';
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

  const springTransition = { type: 'spring' as const, stiffness: 160, damping: 20 };

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: springTransition,
    },
  };

  const tagline =
    language === 'ar'
      ? 'تجربة نقاط بيع فاخرة — سريعة، آمنة، وأنيقة'
      : language === 'ku'
        ? 'ئەزموونی فرۆشتنی پڕیمیۆم — خێرا، پارێزراو و جوان'
        : 'Premium POS experience — fast, secure, refined';

  const welcomeText =
    language === 'ar'
      ? 'مرحباً بك'
      : language === 'ku'
        ? 'بەخێربێیت'
        : 'Welcome back';

  return (
    <div
      dir={dir}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-pos-bg font-sans select-none"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(99,102,241,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(6,182,212,0.10),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-indigo-500/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-cyan-500/8"
        />

        <motion.div
          animate={{ x: [-40, 30, -40], y: [0, 25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[15%] h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [30, -40, 30], y: [20, -15, 20], scale: [1, 0.92, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-[12%] h-80 w-80 rounded-full bg-cyan-500/8 blur-[110px]"
        />
      </div>

      {/* Main layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-4 w-full max-w-5xl"
      >
        {/* Gradient border wrapper */}
        <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-indigo-500/40 via-white/10 to-cyan-500/30 shadow-[0_40px_100px_rgba(0,0,0,0.75)]">
          <div className="overflow-hidden rounded-[calc(2rem-1px)] bg-[rgba(15,20,30,0.88)] backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

            <div className="flex flex-col lg:flex-row">
              {/* Brand panel */}
              <div className="relative flex w-full flex-col justify-between border-b border-white/8 p-8 lg:w-[42%] lg:border-b-0 lg:border-e lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.10),transparent_55%)]" />

                <motion.div variants={itemVariants} className="relative">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/15 to-white/5 shadow-[0_0_30px_rgba(99,102,241,0.20)]">
                        <Logo size={36} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300/80">
                        {language === 'ar' ? 'نسخة احترافية' : language === 'ku' ? 'وەشانی پڕۆ' : 'Professional Edition'}
                      </p>
                      <h2 className="text-2xl font-black tracking-tight text-white">{t.appName}</h2>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-cyan-300/90">
                    <Sparkles size={14} />
                    <span className="text-xs font-semibold tracking-wide">{welcomeText}</span>
                  </div>

                  <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-4xl">
                    {t.loginTitle}
                  </h1>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{tagline}</p>
                  <p className="mt-2 text-xs text-white/50">{t.loginSubtitle}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="relative mt-10 hidden lg:block">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-white/60">
                      <span>{language === 'ar' ? 'حالة النظام' : language === 'ku' ? 'دۆخی سیستەم' : 'System Status'}</span>
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        {language === 'ar' ? 'جاهز' : language === 'ku' ? 'ئامادە' : 'Ready'}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        language === 'ar' ? 'آمن' : language === 'ku' ? 'پارێزراو' : 'Secure',
                        language === 'ar' ? 'سريع' : language === 'ku' ? 'خێرا' : 'Fast',
                        language === 'ar' ? 'موثوق' : language === 'ku' ? 'متمانەپێکراو' : 'Reliable',
                      ].map((label) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-center text-[10px] font-bold text-white/75"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Login panel */}
              <div className="flex w-full flex-col justify-between p-8 lg:w-[58%] lg:p-10">
                <motion.div variants={itemVariants}>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{t.loginBtn}</h3>
                    <div className="flex items-center gap-2">
                      <InputRecoveryButton variant="login" focusSelector="input[type='text']" />
                      <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                        <ShieldCheck size={12} />
                        <span>SSL</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-200">
                            <ShieldCheck size={14} className="shrink-0 text-rose-300" />
                            <span>{error === 'timeout' ? t.loginTimeout : t.loginError}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Username */}
                    <div className="group relative">
                      <label className="mb-1.5 block text-[11px] font-semibold text-white/60">{t.username}</label>
                      <div className="relative">
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-indigo-400 ${
                            dir === 'rtl' ? 'right-4' : 'left-4'
                          }`}
                        >
                          <User size={16} />
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
                          className={`w-full rounded-2xl border bg-[rgba(255,255,255,0.04)] py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/35 ${
                            dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'
                          } ${
                            activeInput === 'username'
                              ? 'border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.15),0_8px_24px_rgba(0,0,0,0.3)]'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="group relative">
                      <label className="mb-1.5 block text-[11px] font-semibold text-white/60">{t.password}</label>
                      <div className="relative">
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-indigo-400 ${
                            dir === 'rtl' ? 'right-4' : 'left-4'
                          }`}
                        >
                          <Lock size={16} />
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
                          className={`w-full rounded-2xl border bg-[rgba(255,255,255,0.04)] py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/35 ${
                            dir === 'rtl' ? 'pr-12 pl-12' : 'pl-12 pr-12'
                          } ${
                            activeInput === 'password'
                              ? 'border-indigo-500/40 shadow-[0_0_0_3px_rgba(99,102,241,0.15),0_8px_24px_rgba(0,0,0,0.3)]'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white ${
                            dir === 'rtl' ? 'left-4' : 'right-4'
                          }`}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !username || !password}
                      className="btn-shimmer btn-primary relative mt-2 w-full overflow-hidden rounded-2xl border border-indigo-400/30 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(99,102,241,0.25)] transition-all hover:shadow-[0_16px_48px_rgba(99,102,241,0.35)] disabled:pointer-events-none disabled:opacity-40"
                    >
                      {isLoading ? (
                        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <span>{t.loginBtn}</span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>

                {/* Numpad */}
                <motion.div variants={itemVariants} className="mt-8 border-t border-white/8 pt-6">
                  <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {language === 'ar' ? 'لوحة الأرقام' : language === 'ku' ? 'پانێڵی ژمارە' : 'Keypad'}
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <motion.button
                        key={num}
                        type="button"
                        onClick={() => handleNumpadClick(num)}
                        whileHover={{ scale: 1.04, borderColor: 'rgba(99,102,241,0.35)' }}
                        whileTap={{ scale: 0.94 }}
                        className="h-12 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors"
                      >
                        {num}
                      </motion.button>
                    ))}

                    <motion.button
                      type="button"
                      onClick={handleBackspace}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      className="flex h-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 text-rose-200 transition-colors hover:border-rose-400/35"
                    >
                      <Delete size={18} />
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => handleNumpadClick('0')}
                      whileHover={{ scale: 1.04, borderColor: 'rgba(99,102,241,0.35)' }}
                      whileTap={{ scale: 0.94 }}
                      className="h-12 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      0
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      className="h-12 rounded-xl border border-indigo-500/25 bg-indigo-500/15 text-xs font-bold uppercase tracking-wider text-indigo-200 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/25"
                    >
                      {t.confirm}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-[10px] font-medium tracking-widest text-white/30 uppercase"
        >
          © {new Date().getFullYear()} {t.appName}
        </motion.p>
      </motion.div>
    </div>
  );
};
