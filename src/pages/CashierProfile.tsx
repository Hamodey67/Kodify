import React, { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Calendar,
  Dot
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CashierProfile: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  const { user, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  if (!user) return null;

  const formattedDate = new Date(user.createdAt).toLocaleDateString(
    language === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const initials = useMemo(() => {
    const name = (user.name || user.username || 'U').trim();
    const parts = name.split(' ').filter(Boolean);
    const a = parts[0]?.[0] || 'U';
    const b = parts[1]?.[0] || '';
    return (a + b).toUpperCase();
  }, [user.name, user.username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-pos-bg space-y-6"
    >
      {/* Hero */}
      <div className="glass-card overflow-hidden border border-white/8 shadow-glass relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.18),transparent_45%)]" />
        <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-[linear-gradient(135deg,rgba(99,102,241,0.55),rgba(6,182,212,0.35))] blur-xl opacity-60" />
              <div className="relative w-16 h-16 rounded-3xl border border-white/10 bg-white/5 glass flex items-center justify-center text-xl font-black text-slate-100">
                {initials}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-slate-100">
                {language === 'ar' ? 'لوحة حساب الكاشير' : 'Cashier Profile Dashboard'}
              </h1>
              <p className="text-sm text-slate-300/70 mt-1">
                {language === 'ar'
                  ? 'نظرة سريعة على حسابك وإجراءات النظام السريعة'
                  : 'Quick overview of your account and system shortcuts.'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold ${
                  user.role === 'admin'
                    ? 'bg-indigo-500/15 text-indigo-200 border-indigo-400/20 shadow-glow-indigo'
                    : 'bg-cyan-500/15 text-cyan-100 border-cyan-400/20 shadow-glow-cyan'
                }`}>
                  <Dot size={16} className={user.role === 'admin' ? 'text-indigo-200' : 'text-cyan-200'} />
                  {user.role === 'admin'
                    ? (language === 'ar' ? 'مدير النظام' : 'Administrator')
                    : (language === 'ar' ? 'كاشير' : 'Cashier')}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 glass text-xs text-slate-200/80">
                  <Calendar size={14} className="text-slate-300/70" />
                  {language === 'ar' ? 'انضم: ' : 'Joined: '}
                  <span className="font-bold text-slate-100">{formattedDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Quick Navigation Shortcuts */}
      <div className="glass-card p-6 border border-white/8 shadow-glass space-y-4">
        <div className="flex items-center justify-between border-b border-white/6 pb-3">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <Settings size={16} className="text-cyan-200" />
            <span>{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</span>
          </h3>
          <span className="text-[10px] text-slate-300/60 font-mono">KODIFY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActivePage('pos')}
            className="p-5 rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(6,182,212,0.16),rgba(99,102,241,0.10))] hover:shadow-glow-cyan text-slate-100 font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 flex items-center justify-center shadow-glow-cyan">
              <ShoppingBag size={22} className="text-cyan-200" />
            </div>
            <span className="text-xs">{language === 'ar' ? 'فتح نقطة البيع' : 'Open POS Register'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActivePage('settings')}
            className="p-5 rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(6,182,212,0.08))] hover:shadow-glow-indigo text-slate-100 font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl border border-indigo-400/25 bg-indigo-500/10 flex items-center justify-center shadow-glow-indigo">
              <Settings size={22} className="text-indigo-200" />
            </div>
            <span className="text-xs">{language === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={logout}
            className="p-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/14 text-rose-100 font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl border border-rose-400/25 bg-rose-500/10 flex items-center justify-center">
              <LogOut size={22} className="text-rose-200" />
            </div>
            <span className="text-xs">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
