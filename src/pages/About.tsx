import React from 'react';
import { useLanguageStore } from '../store/languageStore';
import { ShieldCheck, Phone, Globe, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  const { language, dir } = useLanguageStore();

  const isAr = language === 'ar';
  const isKu = language === 'ku';

  return (
    <div
      className="flex flex-1 flex-col justify-between overflow-y-auto bg-[#eef2f8] p-6 text-[#18212f] custom-scrollbar"
      dir={dir}
    >
      <div className="mx-auto w-full max-w-4xl space-y-6 animate-fade-in">
        <div className="overflow-hidden rounded-2xl bg-[linear-gradient(155deg,#0b2455_0%,#12408f_55%,#1d4ed8_100%)] py-8 text-center text-white shadow-[0_12px_32px_rgba(29,78,216,0.25)]">
          <img
            src="/5.png"
            alt="Kodify Logo"
            className="mx-auto h-14 w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + '/5.png') {
                target.src = './5.png';
              }
            }}
          />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-200">Kodify</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            {isAr
              ? 'نظام كوديفاي لنقاط البيع'
              : isKu
                ? 'سیستەمی کۆدیفای بۆ خاڵی فرۆشتن'
                : 'Kodify POS System'}
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-blue-100/80">
            {isAr ? 'أنظمة تشغيل المتاجر' : isKu ? 'سیستەمی کارپێکردنی فرۆشگا' : 'RETAIL OPERATIONS SOFTWARE'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={36} />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-start">
              <h2 className="text-xl font-black text-[#18212f]">
                {isAr
                  ? 'نظام كوديفاي لنقاط البيع وإدارة الأعمال'
                  : isKu
                    ? 'سیستەمی کۆدیفای بۆ خاڵی فرۆشتن و بەڕێوەبردن'
                    : 'Kodify POS & Business Management System'}
              </h2>
              <p className="text-sm font-medium leading-relaxed text-[#64748b]">
                {isAr
                  ? 'نظام تشغيلي لإدارة المخزون والمبيعات والتقارير اليومية بدقة وسرعة على محطة البيع.'
                  : isKu
                    ? 'سیستەمێکی کارکردن بۆ بەڕێوەبردنی فرۆشتن و کۆگا و ڕاپۆرتەکان بە خێرایی و وردی.'
                    : 'An operational system for inventory, sales, and daily reporting with speed and accuracy at the terminal.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600">
            <span className="h-3 w-1 rounded-sm bg-[#2563eb]" />
            {isAr ? 'حقوق الملكية الفكرية' : isKu ? 'مافی خاوەندارێتی' : 'Intellectual Property'}
          </h3>
          <div className="space-y-2 text-xs font-semibold leading-relaxed text-[#64748b]">
            <p>
              {isAr
                ? 'جميع الحقوق البرمجية والتصميمية وواجهات المستخدم محفوظة بالكامل لمطور النظام KODIFY.'
                : isKu
                  ? 'هەموو مافە نەرمەکاڵا و دیزاینەکان بە تەواوی پارێزراوە بۆ گەشەپێدەر KODIFY.'
                  : 'All software rights, user interface designs, and architecture are exclusively reserved to the developer KODIFY.'}
            </p>
            <p>
              {isAr
                ? 'يُحظر تماماً استنساخ، تعديل، أو إعادة توزيع أي جزء من هذا النظام دون إذن كتابي مسبق من المالك.'
                : isKu
                  ? 'کۆپیکردن یان دەستکاریکردنی ئەم سیستەمە بەبێ مۆڵەتی نووسراو بە تەواوی قەدەغەیە.'
                  : 'Any reproduction, modification, or redistribution of this software is strictly prohibited without prior written consent.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[#e3e9f1] bg-[#fbfcfe] p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#334155]">
            <Cpu size={15} className="text-blue-600" />
            {isAr ? 'الدعم الفني والتواصل' : isKu ? 'پشتیوانی تەکنیکی و پەیوەندی' : 'Technical Support & Contacts'}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href="tel:07710342727"
              className="group flex items-center gap-3 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4 transition-all hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-[#94a3b8]">
                  {isAr ? 'الدعم الفني (آسيا)' : 'Support (Asiacell)'}
                </span>
                <span className="mt-0.5 block font-mono text-xs font-extrabold tracking-wider text-[#18212f]">
                  07710342727
                </span>
              </div>
            </a>

            <a
              href="tel:07510342727"
              className="group flex items-center gap-3 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4 transition-all hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-[#94a3b8]">
                  {isAr ? 'الدعم الفني (كورك)' : 'Support (Korek)'}
                </span>
                <span className="mt-0.5 block font-mono text-xs font-extrabold tracking-wider text-[#18212f]">
                  07510342727
                </span>
              </div>
            </a>

            <a
              href="https://kodify.it.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-[#e3e9f1] bg-[#f4f7fb] p-4 transition-all hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Globe size={14} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-[#94a3b8]">
                  {isAr ? 'الموقع الإلكتروني' : 'Official Website'}
                </span>
                <span className="mt-0.5 block truncate font-mono text-xs font-extrabold text-[#18212f]">
                  kodify.it.com
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 flex shrink-0 select-none flex-col items-center justify-center gap-2 border-t border-[#e3e9f1] py-5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#94a3b8]">
          {isAr ? 'تم التصميم والتطوير بواسطة' : 'Designed & Developed by'}{' '}
          <span className="font-black text-blue-600">KODIFY</span>
        </p>
        <span className="text-[11px] font-bold tracking-wide text-[#94a3b8]">
          © 2026 {isAr ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
        </span>
      </div>
    </div>
  );
};
