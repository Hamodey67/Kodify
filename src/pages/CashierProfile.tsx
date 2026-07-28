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
      className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#eef2f8] space-y-6"
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative w-16 h-16 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center text-xl font-black text-[#2563eb]">
                {initials}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#18212f]">
                {language === 'ar' ? 'لوحة حساب الكاشير' : 'Cashier Profile Dashboard'}
              </h1>
              <p className="text-sm text-[#64748b] mt-1">
                {language === 'ar'
                  ? 'نظرة سريعة على حسابك وإجراءات النظام السريعة'
                  : 'Quick overview of your account and system shortcuts.'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 text-xs font-extrabold bg-[#eff6ff] text-[#2563eb] ring-[#bfdbfe]">
                  <Dot size={16} className="text-[#2563eb]" />
                  {user.role === 'admin'
                    ? (language === 'ar' ? 'مدير النظام' : 'Administrator')
                    : (language === 'ar' ? 'كاشير' : 'Cashier')}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e3e9f1] bg-[#f4f7fb] text-xs text-[#64748b]">
                  <Calendar size={14} className="text-[#94a3b8]" />
                  {language === 'ar' ? 'انضم: ' : 'Joined: '}
                  <span className="font-bold text-[#18212f]">{formattedDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Quick Navigation Shortcuts */}
      <div className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#e8edf4] pb-3">
          <h3 className="text-sm font-black text-[#18212f] flex items-center gap-2">
            <Settings size={16} className="text-blue-600" />
            <span>{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</span>
          </h3>
          <span className="text-[10px] text-[#94a3b8] font-mono">KODIFY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActivePage('pos')}
            className="p-5 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] hover:border-[#bfdbfe] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)] text-[#18212f] font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={22} />
            </div>
            <span className="text-xs">{language === 'ar' ? 'فتح نقطة البيع' : 'Open POS Register'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActivePage('settings')}
            className="p-5 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] hover:border-[#bfdbfe] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)] text-[#18212f] font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Settings size={22} />
            </div>
            <span className="text-xs">{language === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={logout}
            className="p-5 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] hover:border-rose-200 hover:bg-[#fff1f2] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)] text-[#dc2626] font-extrabold flex flex-col items-center justify-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#fff1f2] text-[#dc2626] flex items-center justify-center">
              <LogOut size={22} />
            </div>
            <span className="text-xs">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
