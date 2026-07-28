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
  CalendarDays,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Info,
  Globe,
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
    const onResize = () => {
      setCollapsed(window.innerWidth < 1100);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, roles: ['admin'] },
    { id: 'pos', label: t.pos, icon: Store, roles: ['admin', 'cashier'] },
    {
      id: 'online-orders',
      label: language === 'ar' ? 'طلبات أونلاين' : 'Online Orders',
      icon: Globe,
      roles: ['admin', 'cashier'],
    },
    { id: 'inventory', label: t.inventory, icon: Boxes, roles: ['admin', 'cashier'] },
    {
      id: 'calendar',
      label: language === 'ar' ? 'تقويم المبيعات' : 'Sales Calendar',
      icon: CalendarDays,
      roles: ['admin', 'cashier'],
    },
    {
      id: 'chat',
      label: t.chat || 'المحادثة والرسائل',
      icon: MessageSquare,
      roles: ['admin', 'cashier'],
    },
    {
      id: 'about',
      label: language === 'ar' ? 'حول النظام' : language === 'ku' ? 'دەربارەی سیستەم' : 'About System',
      icon: Info,
      roles: ['admin', 'cashier'],
    },
    { id: 'settings', label: t.settings, icon: Settings, roles: ['admin', 'cashier'] },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user.role));
  const firstName = useMemo(
    () => (user.name || user.username || '').split(' ')[0] || 'User',
    [user.name, user.username]
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 82 : 262 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-40 flex h-full select-none flex-col justify-between bg-[#0b1a33]"
    >
      <div className="flex flex-col gap-5 px-3 pb-4 pt-5">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fbfcfe] ring-1 ring-white/20">
                <img
                  src="./print.png"
                  alt="Store Logo"
                  className="h-full w-full object-contain p-1.5"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/print.png') {
                      target.src = '/print.png';
                    }
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/70">
                  {t.welcome}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="truncate text-sm font-bold text-white">{firstName}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      user.role === 'admin'
                        ? 'bg-blue-500/25 text-blue-200'
                        : 'bg-cyan-500/20 text-cyan-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-blue-200 transition-colors hover:bg-white/[0.16] hover:text-white"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2563eb] font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]'
                    : 'font-semibold text-blue-100/60 hover:bg-white/[0.07] hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-blue-200/80 group-hover:text-white'
                  }`}
                >
                  <Icon size={17} />
                </span>

                {!collapsed && (
                  <span className={`flex-1 truncate ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3">
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl bg-white/[0.06] px-2.5 py-2.5 text-blue-100/70 transition-colors hover:bg-rose-500/20 hover:text-rose-200 ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
            <LogOut size={17} />
          </span>
          {!collapsed && <span className="text-sm font-bold">{t.logout}</span>}
        </button>
      </div>
    </motion.aside>
  );
};
