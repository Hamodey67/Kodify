import React from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, Lock, X, Minus, Square } from 'lucide-react';
import { Logo } from './Logo';

interface SuspensionScreenProps {
  customMessage?: string;
  contactNumber?: string;
}

export const SuspensionScreen: React.FC<SuspensionScreenProps> = ({
  customMessage = 'نحيطكم علماً بأنه قد تم إيقاف تشغيل نظام كوديفاي (Kodify System) مؤقتاً بسبب وجود مستحقات مالية غير مسددة. يرجى التواصل مع إدارة النظام لتسديد المستحقات وإعادة التفعيل.',
  contactNumber = 'للتواصل وتحديث الاشتراك: يرجى المراسلة أو الاتصال بالدعم الفني',
}) => {
  const handleMinimize = () => {
    if (window.api?.minimizeWindow) window.api.minimizeWindow();
  };

  const handleMaximize = () => {
    if (window.api?.maximizeWindow) window.api.maximizeWindow();
  };

  const handleClose = () => {
    if (window.api?.closeWindow) window.api.closeWindow();
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#050811] text-[#f8fafc] font-sans antialiased select-none" dir="rtl">
      {/* Dynamic Background Effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      {/* Top Drag & Control Bar */}
      <div
        className="relative z-50 flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0f1d]/80 px-4 backdrop-blur-md"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/10 border border-red-500/20">
            <Logo size={14} />
          </div>
          <span className="text-[12px] font-bold text-gray-200">نظام كوديفاي | Kodify System</span>
          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-black text-red-400 border border-red-500/30">
            خدمة متوقفة
          </span>
        </div>

        <div
          className="flex items-center gap-1"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={handleMinimize}
            className="flex h-7 w-8 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={handleMaximize}
            className="flex h-7 w-8 items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Square size={12} />
          </button>
          <button
            onClick={handleClose}
            className="flex h-7 w-8 items-center justify-center rounded text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="relative flex w-full max-w-xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-red-500/20 bg-[#0d1424]/90 p-8 md:p-10 shadow-[0_30px_90px_rgba(220,38,38,0.18)] backdrop-blur-xl text-center">
          
          {/* Top Decorative Line */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

          {/* Shield / Lock Icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-500/20 to-red-950/40 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Lock size={40} className="text-red-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-md border-2 border-[#0d1424]">
              <ShieldAlert size={14} />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-400 shadow-inner">
            <AlertTriangle size={14} className="text-red-400" />
            <span>توقيف النظام مؤقتاً | System Access Suspended</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              تم إيقاف تشغيل الخدمة
            </h1>
            <p className="text-xs md:text-sm font-medium text-gray-400">
              تنبيه حول مستحقات تشغيل النظام
            </p>
          </div>

          {/* Suspension Message Box */}
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-950/20 p-5 text-right shadow-inner">
            <p className="text-xs md:text-sm leading-relaxed font-semibold text-red-100">
              {customMessage}
            </p>
          </div>

          {/* Contact Box */}
          <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs font-bold text-gray-300">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <PhoneCall size={18} />
              </div>
              <span className="text-right text-gray-300 font-medium">
                {contactNumber}
              </span>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="text-[11px] font-semibold text-gray-500">
            ملاحظة: سيتم إعادة تشغيل وتفعيل الخدمة فور تسديد المستحقات المالية المترتبة.
          </div>
        </div>
      </div>
    </div>
  );
};
