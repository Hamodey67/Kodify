import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import { Globe, Minus, Square, X } from 'lucide-react';
import { Logo } from './Logo';
import { InputRecoveryButton } from './InputRecoveryButton';

export const TitleBar: React.FC = () => {
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

  return (
    <div
      className="relative z-50 flex h-10 select-none items-center justify-between bg-[#0b1a33] px-4"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_45%,transparent_100%)]" />

      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
          <Logo size={15} />
        </div>
        <span className="text-[12px] font-extrabold tracking-wide text-white">{t.appName}</span>
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-200">
          v1.0.6
        </span>
      </div>

      <div
        className="flex items-center gap-3"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <div className="relative mx-3 flex h-7 items-center gap-1.5 rounded-lg bg-white/[0.08] px-2.5 text-blue-100 transition-colors hover:bg-white/[0.14]">
          <Globe size={13} className="text-cyan-300" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="cursor-pointer appearance-none border-none bg-transparent py-0 text-[11px] font-bold text-white outline-none focus:outline-none focus:ring-0"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23bfdbfe' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: dir === 'rtl' ? 'left 2px center' : 'right 2px center',
              backgroundSize: '1.25em 1.25em',
              backgroundRepeat: 'no-repeat',
              paddingLeft: dir === 'rtl' ? '1.5rem' : '0.5rem',
              paddingRight: dir === 'rtl' ? '0.5rem' : '1.5rem',
            }}
          >
            <option value="ar" className="bg-[#0b1a33] text-white">
              العربية
            </option>
            <option value="en" className="bg-[#0b1a33] text-white">
              English
            </option>
            <option value="ku" className="bg-[#0b1a33] text-white">
              کوردی
            </option>
          </select>
        </div>

        <InputRecoveryButton variant="titlebar" />

        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={handleMinimize}
            className="flex h-7 w-7 items-center justify-center rounded-md text-blue-200/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleMaximize}
            className="flex h-7 w-7 items-center justify-center rounded-md text-blue-200/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Square size={12} />
          </button>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-blue-200/80 transition-colors hover:bg-rose-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
