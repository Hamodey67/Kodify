import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Globe, Minus, Square, X, User as UserIcon } from 'lucide-react';
import { Logo } from './Logo';
import { InputRecoveryButton } from './InputRecoveryButton';

export const TitleBar: React.FC = () => {
  const { user } = useAuthStore();
  const { language, setLanguage, dir } = useLanguageStore();
  const t = translations[language];

  const handleMinimize = () => {
    window.api.minimizeWindow();
  };

  const handleMaximize = () => {
    window.api.maximizeWindow();
  };

  const handleClose = () => {
    window.api.closeWindow();
  };

  const roleLabel = user?.role === 'admin' ? t.admin : t.cashier;
  const roleTone =
    user?.role === 'admin'
      ? 'bg-indigo-500/15 text-indigo-200 border-indigo-400/20 shadow-glow-indigo'
      : 'bg-cyan-500/15 text-cyan-100 border-cyan-400/20 shadow-glow-cyan';

  return (
    <div 
      className="h-10 bg-pos-bg border-b border-white/5 flex items-center justify-between select-none px-4 relative z-50 shadow-sm"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Accent edge */}
      <div className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#6366f1_0%,#06b6d4_100%)] opacity-90" />

      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2 pl-2">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-[linear-gradient(135deg,rgba(99,102,241,0.35),rgba(6,182,212,0.25))] blur-md opacity-70" />
          <div className="relative">
            <Logo size={18} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wide text-[12px] text-slate-100">
            {t.appName}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
            v1.0
          </span>
        </div>
      </div>

      {/* Right Controls: User Profile, Language, Win controls */}
      <div 
        className="flex items-center gap-4"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >


        {/* Language Selector Dropdown */}
        <div className="relative flex items-center gap-1.5 px-3 mx-5 h-7 rounded-full border border-white/6 bg-white/3 glass text-slate-300 hover:text-white transition-colors">
          <Globe size={13} className="text-cyan-300" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-[11px] outline-none cursor-pointer appearance-none border-none py-0 focus:ring-0 focus:outline-none text-slate-100 font-bold"
            style={{ 
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: dir === 'rtl' ? 'left 2px center' : 'right 2px center',
              backgroundSize: '1.25em 1.25em',
              backgroundRepeat: 'no-repeat',
              paddingLeft: dir === 'rtl' ? '1.5rem' : '0.5rem',
              paddingRight: dir === 'rtl' ? '0.5rem' : '1.5rem',
            }}
          >
            <option value="ar" className="bg-slate-900 text-slate-200">العربية</option>
            <option value="en" className="bg-slate-900 text-slate-200">English</option>
            <option value="ku" className="bg-slate-900 text-slate-200">کوردی</option>
          </select>
        </div>

        <InputRecoveryButton variant="titlebar" />

        {/* Windows Control Buttons */}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={handleMinimize} 
            className="w-7 h-7 flex items-center justify-center text-slate-300/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleMaximize} 
            className="w-7 h-7 flex items-center justify-center text-slate-300/80 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <Square size={12} />
          </button>
          <button
            onClick={handleClose} 
            className="w-7 h-7 flex items-center justify-center text-slate-300/80 hover:text-white hover:bg-rose-500/70 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
