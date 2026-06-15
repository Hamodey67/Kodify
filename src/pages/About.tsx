import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone, Globe, Cpu, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const { language, dir } = useLanguageStore();

  const isAr = language === 'ar';
  const isKu = language === 'ku';

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-pos-bg text-slate-100 flex flex-col justify-between" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto w-full space-y-8"
      >
        {/* Header Hero Section */}
        <div className="text-center relative py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full" />
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative z-10 inline-flex flex-col items-center justify-center gap-3"
          >
            {/* Glowing Logo */}
            <img 
              src="/5.png" 
              alt="Kodify Logo" 
              className="h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== window.location.origin + '/5.png') {
                  target.src = './5.png';
                }
              }}
            />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isAr ? 'أنظمة البرمجيات الذكية' : isKu ? 'سیستەمە نەرمەکاڵا ژیرەکان' : 'SMART SOFTWARE SYSTEMS'}
            </div>
          </motion.div>
        </div>

        {/* Core Copyright Card */}
        <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-glass bg-gradient-to-b from-white/3 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Big Icon */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-400 to-indigo-500 p-0.5 shadow-xl shadow-teal-500/10 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-teal-400">
                <ShieldCheck size={48} className="animate-pulse" />
              </div>
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-3 text-center md:text-start">
              <h2 className="text-2xl font-black text-white">
                {isAr ? 'نظام كوديفاي لنقاط البيع وإدارة الأعمال' : isKu ? 'سیستەمی کۆدیفای بۆ خاڵی فرۆشتن و بەڕێوەبردن' : 'Kodify POS & Business Management System'}
              </h2>
              <p className="text-sm text-slate-300/80 leading-relaxed font-medium">
                {isAr ? 'تم تصميم وتطوير هذا النظام بأحدث التقنيات البرمجية لتلبية احتياجات المتاجر والشركات في إدارة المخزون، المبيعات، المحاسبة ومتابعة التقارير الفورية بدقة وسهولة فائقة.' : 
                 isKu ? 'ئەم سیستەمە بە نوێترین تەکنەلۆژیای نەرمەکاڵا دیزاین و گەشەپێدراوە بۆ دابینکردنی پێداویستییەکانی کۆگا و فرۆشگاکان لە بەڕێوەبردنی فرۆشتن و ژمێریاری.' :
                 'This system is fully crafted and optimized using cutting-edge technologies to empower retail stores and businesses with absolute control over sales, inventory, and reporting.'}
              </p>
            </div>
          </div>
        </div>

        {/* Copyrights and ownership */}
        <div className="glass-card rounded-2xl border border-white/8 p-6 space-y-4">
          <h3 className="text-sm font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 rounded bg-teal-400" />
            {isAr ? 'حقوق الملكية الفكرية' : isKu ? 'مافی خاوەندارێتی' : 'Intellectual Property'}
          </h3>
          <div className="space-y-3 text-xs text-slate-300/80 leading-relaxed font-semibold">
            <p>
              {isAr ? 'جميع الحقوق البرمجية والتصميمية وواجهات المستخدم محفوظة بالكامل لمطور النظام KODIFY.' :
               isKu ? 'هەموو مافە نەرمەکاڵا و دیزاینەکان بە تەواوی پارێزراوە بۆ گەشەپێدەر KODIFY.' :
               'All software rights, user interface designs, and architecture are exclusively reserved to the developer KODIFY.'}
            </p>
            <p>
              {isAr ? 'يُحظر تماماً استنساخ، تعديل، أو إعادة توزيع أي جزء من هذا النظام دون إذن كتابي مسبق من المالك.' :
               isKu ? 'کۆپیکردن یان دەستکاریکردنی ئەم سیستەمە بەبێ مۆڵەتی نووسراو بە تەواوی قەدەغەیە.' :
               'Any reproduction, modification, or redistribution of this software is strictly prohibited without prior written consent.'}
            </p>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div className="glass-card rounded-2xl border border-white/8 p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-purple-400" />
            {isAr ? 'الدعم الفني والتواصل' : isKu ? 'پشتیوانی تەکنیکی و پەیوەندی' : 'Technical Support & Contacts'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phone 1 */}
            <a 
              href="tel:07710342727" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/6 hover:border-teal-500/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">{isAr ? 'الدعم الفني (آسيا)' : 'Support (Asiacell)'}</span>
                <span className="text-xs font-extrabold text-slate-200 block mt-0.5 tracking-wider font-mono">07710342727</span>
              </div>
            </a>

            {/* Phone 2 */}
            <a 
              href="tel:07510342727" 
              className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/6 hover:border-teal-500/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">{isAr ? 'الدعم الفني (كورك)' : 'Support (Korek)'}</span>
                <span className="text-xs font-extrabold text-slate-200 block mt-0.5 tracking-wider font-mono">07510342727</span>
              </div>
            </a>

            {/* Website */}
            <a 
              href="https://kodify.it.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/6 hover:border-teal-500/30 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Globe size={14} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">{isAr ? 'الموقع الإلكتروني' : 'Official Website'}</span>
                <span className="text-xs font-extrabold text-slate-200 block mt-0.5 truncate font-mono">kodify.it.com</span>
              </div>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Footer copyright tagline */}
      <div className="text-center py-6 border-t border-white/5 mt-8 flex flex-col items-center justify-center gap-3 select-none shrink-0 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200/60 rounded-full shadow-sm text-[11px] font-bold tracking-wide">
          <span className="text-[#8fa2b6]">{isAr ? 'تم التصميم والتطوير بواسطة' : 'Designed & Developed by'}</span>
          <span className="font-black text-slate-800 tracking-wider">KODIFY</span>
        </div>
        <span className="text-[11px] text-slate-500 font-extrabold tracking-wide">
          © 2026 {isAr ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
        </span>
      </div>
    </div>
  );
};
