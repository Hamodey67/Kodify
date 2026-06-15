import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { 
  LayoutDashboard, 
  Store, 
  Boxes, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuthStore();
  const { language, dir } = useLanguageStore();
  const t = translations[language];
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  useEffect(() => {
    // Default collapse on smaller widths (still safe in Electron)
    const onResize = () => {
      const shouldCollapse = window.innerWidth < 1100;
      setCollapsed(shouldCollapse);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Filter navigation items based on role
  // Cashiers only access POS and Settings (Shift management)
  const menuItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ['admin'],
      colorFrom: 'from-blue-500',
      colorTo: 'to-indigo-500',
      shadowColor: 'shadow-blue-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    },

    {
      id: 'pos',
      label: t.pos,
      icon: Store,
      roles: ['admin', 'cashier'],
      colorFrom: 'from-emerald-400',
      colorTo: 'to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]',
    },
    {
      id: 'inventory',
      label: t.inventory,
      icon: Boxes,
      roles: ['admin', 'cashier'],
      colorFrom: 'from-orange-400',
      colorTo: 'to-amber-500',
      shadowColor: 'shadow-orange-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(251,146,60,0.5)]',
    },
    {
      id: 'calendar',
      label: language === 'ar' ? 'تقويم المبيعات' : 'Sales Calendar',
      icon: CalendarDays,
      roles: ['cashier'],
      colorFrom: 'from-pink-500',
      colorTo: 'to-rose-500',
      shadowColor: 'shadow-pink-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(236,72,153,0.5)]',
    },
    {
      id: 'chat',
      label: t.chat || 'المحادثة والرسائل',
      icon: MessageSquare,
      roles: ['admin', 'cashier'],
      colorFrom: 'from-violet-400',
      colorTo: 'to-purple-500',
      shadowColor: 'shadow-violet-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(167,139,250,0.5)]',
    },
    {
      id: 'about',
      label: language === 'ar' ? 'حول النظام' : language === 'ku' ? 'دەربارەی سیستەم' : 'About System',
      icon: Info,
      roles: ['admin', 'cashier'],
      colorFrom: 'from-cyan-400',
      colorTo: 'to-indigo-500',
      shadowColor: 'shadow-cyan-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    },
    {
      id: 'settings',
      label: t.settings,
      icon: Settings,
      roles: ['admin', 'cashier'],
      colorFrom: 'from-slate-400',
      colorTo: 'to-slate-500',
      shadowColor: 'shadow-slate-500/25',
      glowColor: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]',
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  const firstName = useMemo(() => (user.name || user.username || '').split(' ')[0] || 'User', [user.name, user.username]);
  const avatarLetter = firstName.charAt(0).toUpperCase();

  return (
    <motion.aside
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-b from-[#111827]/95 to-[#0a0e1a]/95 backdrop-blur-2xl border-r border-white/5 flex flex-col justify-between h-full select-none relative z-50 shadow-2xl"
    >
      {/* Top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      {/* Subtle side highlight */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-white/10 to-transparent opacity-30" />

      {/* Upper Navigation Links */}
      <div className="flex flex-col pt-6 pb-4 px-4 gap-6">
        {/* Brand / Profile + Collapse */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mt-2`}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10 border border-white/20 overflow-hidden">
                  <img
                    src="./print.png"
                    alt="Store Logo"
                    className="w-full h-full object-contain p-1.5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + '/print.png') {
                        target.src = '/print.png';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.welcome}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-white tracking-wide">{firstName}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 ${collapsed ? '' : 'ml-2'}`}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden flex items-center gap-3.5 px-3 py-3 rounded-2xl text-[15px] transition-all duration-300 group ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-400 font-medium hover:text-slate-200'
                }`}
              >
                {/* Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.colorFrom}/15 ${item.colorTo}/15 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`}
                  />
                )}
                
                {/* Left active line indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-line"
                    className={`absolute inset-y-1/4 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1 rounded-full bg-gradient-to-b ${item.colorFrom} ${item.colorTo} ${item.glowColor}`}
                  />
                )}

                {/* Icon Container */}
                <span className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-tr ${item.colorFrom} ${item.colorTo} text-white shadow-lg ${item.shadowColor} border border-white/10` 
                    : 'bg-slate-800/50 border border-white/5 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200 group-hover:border-white/10'
                }`}>
                  <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform duration-300'} />
                </span>

                {!collapsed && (
                  <span className={`relative z-10 flex-1 ${dir === 'rtl' ? 'text-right ml-2' : 'text-left mr-2'} tracking-wide whitespace-nowrap`}>{item.label}</span>
                )}
                
                {!collapsed && (
                  <span className={`relative z-10 ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} transition-transform duration-300 ${isActive ? (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1') : `opacity-0 ${dir === 'rtl' ? 'translate-x-2' : '-translate-x-2'} group-hover:opacity-100 group-hover:translate-x-0`}`}>
                    {dir === 'rtl' ? <ChevronLeft size={16} className={isActive ? "text-cyan-300" : "text-slate-500"} /> : <ChevronRight size={16} className={isActive ? "text-cyan-300" : "text-slate-500"} />}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action Area */}
      <div className="p-4 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl border border-white/5 bg-slate-800/30 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-300 transition-all duration-300 group ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className="relative z-10 w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-500/25 transition-all duration-300">
             <LogOut size={20} className={`transition-transform ${dir === 'rtl' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'}`} />
          </span>
          {!collapsed && <span className="text-[15px] font-bold tracking-wide whitespace-nowrap">{t.logout}</span>}

        </motion.button>
      </div>
    </motion.aside>
  );
};
