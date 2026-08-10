import React from 'react';
import { Lock, AlertOctagon, ArrowRight, ArrowLeft, ShoppingBag, ShieldAlert } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

interface RestrictedPageNoticeProps {
  onGoToPos: () => void;
}

export const RestrictedPageNotice: React.FC<RestrictedPageNoticeProps> = ({ onGoToPos }) => {
  const { dir } = useLanguageStore();

  return (
    <div className="flex h-full w-full items-center justify-center p-6 bg-[#0b1329]/95 text-white" dir={dir}>
      <div className="relative flex w-full max-w-md flex-col items-center gap-5 overflow-hidden rounded-3xl border border-red-500/30 bg-[#0f172a] p-8 shadow-[0_20px_60px_rgba(220,38,38,0.2)] text-center">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
        
        {/* Lock Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.25)]">
          <Lock size={32} className="text-red-400 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white border-2 border-[#0f172a]">
            <ShieldAlert size={12} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-white">
            الصفحة مقيدة | Restricted Page
          </h2>
          <p className="text-xs font-medium text-red-300">
            تم حجب هذه الصفحة في وضع التقييد المؤقت
          </p>
        </div>

        {/* Message Box */}
        <div className="w-full rounded-2xl border border-red-500/20 bg-red-950/30 p-4 text-right text-xs leading-relaxed text-slate-300 font-semibold shadow-inner">
          عذراً، لا يمكن عرض الأرباح أو التقارير أو الإعدادات في الوقت الحالي بسبب وجود مستحقات مالية غير مسددة للنظام. تم تفعيل خيار البيع المباشر (POS) فقط.
        </div>

        {/* Action Button */}
        <button
          onClick={onGoToPos}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]"
        >
          <ShoppingBag size={18} />
          <span>الذهاب إلى شاشة البيع المباشر (POS)</span>
          {dir === 'rtl' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>

        <p className="text-[11px] font-medium text-slate-400">
          لإلغاء التقييد واستعادة كافة الصلاحيات والتقارير، يرجى التواصل مع إدارة كوديفاي.
        </p>
      </div>
    </div>
  );
};
