import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  PanelLeftClose,
  PanelLeftOpen
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
    },
    {
      id: 'pos',
      label: t.pos,
      icon: ShoppingBag,
      roles: ['admin', 'cashier'],
    },
    {
      id: 'inventory',
      label: t.inventory,
      icon: Package,
      roles: ['admin', 'cashier'],
    },
    {
      id: 'calendar',
      label: language === 'ar' ? 'تقويم المبيعات' : 'Sales Calendar',
      icon: Calendar,
      roles: ['cashier'],
    },
    {
      id: 'settings',
      label: t.settings,
      icon: Settings,
      roles: ['admin', 'cashier'],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  const firstName = useMemo(() => (user.name || user.username || '').split(' ')[0] || 'User', [user.name, user.username]);
  const roleLabel = user.role === 'admin' ? 'ADMIN' : 'CASHIER';
  const rolePill = user.role === 'admin'
    ? 'bg-indigo-500/15 text-indigo-200 border-indigo-400/20 shadow-glow-indigo'
    : 'bg-cyan-500/15 text-cyan-100 border-cyan-400/20 shadow-glow-cyan';

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 220 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-pos-surface border-r border-white/5 flex flex-col justify-between h-full select-none relative"
    >
      {/* Top gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,rgba(99,102,241,0.0),rgba(99,102,241,0.35),rgba(6,182,212,0.25),rgba(6,182,212,0.0))]" />

      {/* Upper Navigation Links */}
      <div className="flex flex-col pt-7 pb-4 px-3 gap-4">
        {/* Brand + Collapse */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.welcome}</span>
              <span className="text-[12px] font-extrabold text-slate-100">{firstName}</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-9 h-9 rounded-xl border border-white/6 bg-white/3 glass flex items-center justify-center text-slate-200 hover:text-white transition-colors active:scale-[0.98]"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-hidden flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                  isActive
                    ? 'text-slate-100'
                    : 'text-slate-300/80 hover:text-white'
                }`}
              >
                {/* Hover slide highlight */}
                <span className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1 bg-[linear-gradient(180deg,#6366f1,#06b6d4)] opacity-0 group-hover:opacity-80 transition-opacity`} />

                {/* Active pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.28),rgba(6,182,212,0.18))] border border-white/8 shadow-[0_0_22px_rgba(99,102,241,0.14)]"
                  />
                )}

                <span className="relative z-10 w-10 h-10 rounded-2xl border border-white/6 bg-white/3 glass flex items-center justify-center">
                  <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-cyan-200' : 'text-slate-200/80 group-hover:text-cyan-200'}`} />
                </span>

                {!collapsed && (
                  <span className="relative z-10 flex-1 text-right">{item.label}</span>
                )}
                
                {!collapsed && isActive && (
                  <span className={`relative z-10 ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}>
                    {dir === 'rtl' ? <ChevronLeft size={14} className="text-slate-200/80" /> : <ChevronRight size={14} className="text-slate-200/80" />}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action Area */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Role badge */}
        <div className={`w-full ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/6 bg-white/3 glass ${collapsed ? '' : 'w-full justify-between'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,0.28),rgba(6,182,212,0.18))] border border-white/10 flex items-center justify-center text-[12px] font-extrabold text-slate-100">
                {(user.name || user.username || 'U').slice(0, 1).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-extrabold text-slate-100">{firstName}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border w-fit ${rolePill}`}>
                    {roleLabel}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <span className="text-[10px] text-slate-500 font-mono">KODIFY</span>
            )}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl border border-white/6 bg-white/2 hover:bg-rose-500/10 text-slate-300 hover:text-rose-200 transition-all ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <LogOut size={18} className="text-rose-300/80" />
          {!collapsed && <span className="text-sm font-extrabold">{t.logout}</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
};
