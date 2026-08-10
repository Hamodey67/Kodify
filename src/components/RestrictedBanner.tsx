import React from 'react';
import { AlertTriangle, Lock, PhoneCall } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface RestrictedBannerProps {
  contactNumber?: string;
}

export const RestrictedBanner: React.FC<RestrictedBannerProps> = ({
  contactNumber = 'يرجى التواصل مع الدعم الفني لتسديد المستحقات والتفعيل التام',
}) => {
  const { dir } = useLanguageStore();

  return (
    <div 
      className="relative z-30 flex shrink-0 items-center justify-between border-b border-red-500/30 bg-gradient-to-r from-red-950 via-red-900 to-amber-950 px-4 py-2 text-white shadow-md"
      dir={dir}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse">
          <AlertTriangle size={16} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 rounded bg-red-500/25 px-2 py-0.5 text-[11px] font-black text-red-300 border border-red-500/40 shrink-0">
            <Lock size={11} />
            النظام مقيد | Restricted Mode
          </span>
          <p className="truncate text-xs font-bold text-red-100">
            تم تقييد النظام لعدم تسديد المستحقات المالية. تم إخفاء الأرباح والتقارير، ويُسمح فقط بنقطة البيع (POS).
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-lg bg-black/30 border border-white/10 px-3 py-1 text-[11px] font-bold text-amber-300">
        <PhoneCall size={13} className="text-amber-400 shrink-0" />
        <span className="hidden sm:inline">{contactNumber}</span>
      </div>
    </div>
  );
};
