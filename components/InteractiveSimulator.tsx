"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  Terminal,
  X,
  ArrowRight,
  ShieldCheck,
  Play,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import dynamic from "next/dynamic";

const DashboardEmulator = dynamic(() => import("@/components/DashboardEmulator"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] items-center justify-center bg-[#0a0f1c] text-xs font-semibold text-white/40">
      Loading POS...
    </div>
  ),
});


export default function InteractiveSimulator() {
  const { lang } = useApp();
  const [activeEmulator, setActiveEmulator] = useState<number | null>(null);

  useEffect(() => {
    if (activeEmulator !== null) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.start();
    };
  }, [activeEmulator]);

  const cards = [
    {
      icon: Laptop,
      title: lang === "ar" ? "متجر إلكتروني متكامل" : lang === "ku" ? "فرۆشگای ئەلیکترۆنی" : "E-Commerce Store",
      desc:
        lang === "ar"
          ? "متجر إلكتروني متكامل لإدارة المنتجات، الطلبات، والبيع المباشر عبر الإنترنت بأحدث الأطر مثل Next.js 15."
          : lang === "ku"
          ? "فرۆشگایەکی ئەلیکترۆنی تەواو بۆ بەڕێوەبردنی بەرهەمەکان، سەبەتەی کڕین و داواکارییەکان بە Next.js 15."
          : "A complete e-commerce store to manage products, shopping cart, and orders built with Next.js 15.",
      badge: "Next.js 15",
      color: "from-blue-600 to-sky-400",
      glow: "rgba(37, 99, 235, 0.15)",
      image: "/1.png"
    },
    {
      icon: ShoppingCart,
      title: lang === "ar" ? "أنظمة المبيعات و POS" : lang === "ku" ? "سیستەمی مبيعات و POS" : "Smart POS Systems",
      desc:
        lang === "ar"
          ? "نظام نقاط بيع سحابي متكامل لإدارة الطلبات، الحسابات، والفواتير بكفاءة."
          : lang === "ku"
          ? "سیستەمێکی فرۆشتنی پێشکەوتوو بۆ بەڕێوەبردنی داواکاری و حسابات."
          : "Cloud-based POS systems to manage orders, transactions, and print receipts.",
      badge: "Smart POS",
      color: "from-emerald-600 to-teal-400",
      glow: "rgba(5, 150, 105, 0.15)",
      image: "/inventory.webp"
    },
    {
      icon: Terminal,
      title: lang === "ar" ? "موقع الكتروني" : lang === "ku" ? "ماڵپەڕی ئەلیکترۆنی" : "Website",
      desc:
        lang === "ar"
          ? "موقع مؤسسي احترافي بتصميم عصري، أداء سريع، وتجربة مستخدم سلسة."
          : lang === "ku"
          ? "ماڵپەڕێکی پیشەیی بە دیزاینێکی سەردەمی، کارایی خێرا و ئەزموونێکی بەکارهێنەری نەرم."
          : "A professional corporate website with modern design, fast performance, and smooth user experience.",
      badge: "DevOps & Cloud",
      color: "from-indigo-600 to-purple-400",
      glow: "rgba(79, 70, 229, 0.15)",
      image: "/bareza.png"
    },
    {
      icon: ShoppingBag,
      title: lang === "ar" ? "متجر رياضي متكامل" : lang === "ku" ? "فرۆشگای وەرزشی ئەدم" : "ADMSPOORT Sports Store",
      desc:
        lang === "ar"
          ? "منصة تجارة إلكترونية متكاملة لبيع الملابس والمستلزمات الرياضية بأعلى كفاءة."
          : lang === "ku"
          ? "سەکۆیەکی بازرگانی ئەلیکترۆنی بۆ فرۆشتنی جلوبەرگ و پێداویستییە وەرزشییەکان."
          : "An integrated e-commerce platform for selling sportswear and premium gym equipment.",
      badge: "E-Commerce",
      color: "from-rose-600 to-orange-400",
      glow: "rgba(225, 29, 72, 0.15)",
      image: "/admsop1.png"
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" id="interactive-labs">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand bg-brand-soft mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-bright)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-bright)]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan">
              {lang === "ar" ? "معمل محاكاة الأنظمة" : lang === "ku" ? "تاقیگەی ئەزموونی" : "Interactive Systems Sandbox"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight"
          >
            {lang === "ar" ? (
              <>
                استكشف حلولنا <span className="text-brand-cyan">التفاعلية</span>
              </>
            ) : lang === "ku" ? (
              <>
                سیستەمەکانمان <span className="text-brand-cyan">تاقیبکەرەوە</span>
              </>
            ) : (
              <>
                Explore Our <span className="text-brand-cyan">Interactive Solutions</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="theme-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
          >
            {lang === "ar"
              ? "اضغط على أي قسم أدناه لتشغيل المحاكي التفاعلي الحي وتجربة جودة وسرعة أنظمتنا بنفسك."
              : lang === "ku"
              ? "کلیک لەسەر هەر بەشێکی خوارەوە بکە بۆ کارپێکردنی سیمیولەیتەری ڕاستەوخۆ."
              : "Click any section below to launch the live simulator and experience the quality and speed of our systems."}
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setActiveEmulator(i)}
              className="group relative cursor-pointer rounded-3xl border border-[var(--border-strong)] bg-slate-900/30 backdrop-blur-xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-cyan-soft hover:shadow-[0_20px_50px_rgba(43,127,255,0.06)]"
              style={{
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
              }}
            >
              {/* Inner card glow on hover */}
              <div
                className="absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: c.glow }}
              />

              <div>
                {/* Image Header */}
                {c.image && (
                  <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/5 relative bg-slate-950/50">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  </div>
                )}

                {/* Icon & Badge Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full rounded-[11px] bg-[#030712] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                      <c.icon size={18} strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-brand-soft border border-brand px-2.5 py-0.5 rounded-full text-brand-cyan tracking-wider">
                    {c.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-black text-white mb-2 group-hover:text-brand-cyan transition-colors text-start">
                  {c.title}
                </h3>
                <p className="text-[11px] theme-muted leading-relaxed mb-6 text-start">
                  {c.desc}
                </p>
              </div>

              {/* Footer action trigger */}
              <div className="flex items-center gap-2 text-xs font-black text-brand-cyan group-hover:text-white transition-colors pt-3 border-t border-white/5">
                <Play size={12} className="fill-current" />
                <span>{lang === "ar" ? "شغّل المحاكي" : lang === "ku" ? "دەستپێکردنی دیمۆ" : "Launch Simulator"}</span>
                <ArrowRight
                  size={14}
                  className="ms-auto transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emulator Modal */}
      <AnimatePresence>
        {activeEmulator !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
            dir={lang === "ar" || lang === "ku" ? "rtl" : "ltr"}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEmulator(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 16 }}
              className="relative flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border-0 bg-slate-900 shadow-2xl sm:h-[85vh] sm:w-[95vw] sm:max-h-[850px] sm:rounded-2xl sm:border sm:border-white/10 md:rounded-3xl lg:w-[90vw]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 me-4" dir="ltr">
                    <button
                      onClick={() => setActiveEmulator(null)}
                      className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono font-medium text-white/40 select-none uppercase tracking-widest">
                    {activeEmulator === 0
                      ? (lang === "ar" ? "متجر إلكتروني - Next.js" : lang === "ku" ? "فرۆشگای ئەلیکترۆنی - Next.js" : "e-commerce store - next.js")
                      : activeEmulator === 1
                      ? (lang === "ar" ? "لوحة التحكم - POS" : lang === "ku" ? "کۆنترۆڵ - POS" : "dashboard - pos")
                      : activeEmulator === 2
                      ? (lang === "ar" ? "متصفح الويب - Bareza" : lang === "ku" ? "وێبگەڕ - Bareza" : "browser - barezagroup")
                      : (lang === "ar" ? "متجر أدم سبورت - ADMSPOORT" : lang === "ku" ? "فرۆشگای ئەدم سپۆرت - ADMSPOORT" : "sports store - admspoort")}
                  </span>
                </div>
                <button
                  onClick={() => setActiveEmulator(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden relative bg-[#0a0f1c]" dir="ltr">
                {activeEmulator === 0 && <WebEmulator />}
                {activeEmulator === 1 && <DashboardEmulator onClose={() => setActiveEmulator(null)} />}
                {activeEmulator === 2 && <WebEmulator url="https://barezagroup.com/" title="Bareza Group" />}
                {activeEmulator === 3 && <WebEmulator url="https://admspoort.com/" title="ADMSPOORT" />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function WebEmulator({ url = "https://babylongates.art/", title = "Babylon Gates" }: { url?: string, title?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 1440, height: 900, scale: 1 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth === 0 || offsetHeight === 0) return;
      
      const virtualWidth = 1440;
      const scale = offsetWidth / virtualWidth;
      const virtualHeight = offsetHeight / scale;
      
      setDimensions({
        width: virtualWidth,
        height: virtualHeight,
        scale: scale
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    
    const timer = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden font-sans min-h-0">
      <div className="h-10 border-b border-slate-200 flex items-center px-4 justify-between shrink-0 bg-slate-50">
        <div className="flex gap-1.5" dir="ltr">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 max-w-md mx-4 bg-white border border-slate-200 rounded px-3 py-0.5 text-[10px] text-slate-400 text-center truncate select-none">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </div>
        <div className="w-4" />
      </div>
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#0a0f1c]">
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformOrigin: "top left",
            transform: `scale(${dimensions.scale})`
          }}
        >
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            scrolling="yes"
          />
        </div>
      </div>
    </div>
  );
}


function CloudEmulator() {
  const { lang } = useApp();
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-emerald-400 font-mono text-xs sm:text-sm p-4 overflow-hidden flex flex-col">
      <div className="mb-4">
        <span className="text-sky-400">root@kodify-cloud</span>:<span className="text-blue-400">~/server</span>$ ./status
        --watch
      </div>
      <div data-lenis-prevent className="flex-1 overflow-y-auto pos-scrollbar">
        <div className="flex flex-col gap-1 opacity-80">
          <div className="flex justify-between border-b border-emerald-900/50 pb-1 mb-2 text-[10px] sm:text-xs text-emerald-600">
            <span className="w-24 sm:w-32">{lang === "ar" ? "الخدمة" : lang === "ku" ? "خزمەتگوزاری" : "SERVICE"}</span>
            <span className="w-12 sm:w-16">{lang === "ar" ? "الحالة" : lang === "ku" ? "دۆخ" : "STATUS"}</span>
            <span className="w-12 sm:w-16">{lang === "ar" ? "المعالج" : lang === "ku" ? "پرۆسێسەر" : "CPU"}</span>
            <span>{lang === "ar" ? "الذاكرة" : lang === "ku" ? "مێمۆری" : "MEM"}</span>
          </div>
          {["api-gateway", "auth-service", "db-primary", "cache-redis", "worker-queue"].map((s) => (
            <div key={s} className="flex justify-between">
              <span className="w-24 sm:w-32 truncate pr-2">{s}</span>
              <span className="w-12 sm:w-16 text-emerald-500">[OK]</span>
              <span className="w-12 sm:w-16">
                {Math.floor(Math.random() * 20)}.{Math.floor(Math.random() * 9)}%
              </span>
              <span>{Math.floor(Math.random() * 500)}MB</span>
            </div>
          ))}
          <br />
          <div>{lang === "ar" ? "حمل النظام" : lang === "ku" ? "بارگرانی سیستەم" : "System Load"}: 1.04 1.12 1.08</div>
          <div>{lang === "ar" ? "مدة التشغيل" : lang === "ku" ? "کاتی کارکردن" : "Uptime"}: {lang === "ar" ? "45 يوم، 12 ساعة، 23 دقيقة" : lang === "ku" ? "45 ڕۆژ، 12 کاتژمێر، 23 خولەک" : "45 days, 12 hours, 23 mins"}</div>
          <br />
          <div className="animate-pulse">{lang === "ar" ? "جاري مراقبة السجلات النشطة..." : lang === "ku" ? "چاودێریکردنی لۆگە چالاکەکان..." : "Monitoring active logs..."}</div>
        </div>
      </div>
    </div>
  );
}

function SecurityEmulator() {
  const { lang } = useApp();
  return (
    <div className="w-full h-full bg-slate-950 text-sky-400 font-mono text-xs sm:text-sm p-6 overflow-hidden flex flex-col relative items-center justify-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 0, #020617 100%), repeating-radial-gradient(circle at center, transparent, transparent 40px, rgba(56, 189, 248, 0.2) 41px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-sky-500/50 flex items-center justify-center relative mb-6 sm:mb-8">
          <div
            className="absolute inset-0 rounded-full border border-sky-400/20 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <ShieldCheck className="text-sky-400 w-10 h-10 sm:w-12 sm:h-12" />
          <div
            className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-[2px] bg-sky-400 origin-left animate-spin"
            style={{ animationDuration: "4s", animationTimingFunction: "linear" }}
          />
        </div>

        <div className="text-center">
          <div className="text-lg sm:text-xl font-black text-white mb-2 tracking-widest text-center">
            {lang === "ar" ? "الشبكة آمنة" : lang === "ku" ? "تۆڕەکە پارێزراوە" : "NETWORK SECURE"}
          </div>
          <div className="text-sky-500/60 mb-1 text-center">
            {lang === "ar" ? "0 تهديدات مكتشفة" : lang === "ku" ? "0 هەڕەشە دۆزرایەوە" : "0 Threats Detected"}
          </div>
          <div className="text-sky-500/60 text-center">
            {lang === "ar" ? "جدار الحماية: نشط | التشفير: AES-256" : lang === "ku" ? "دیواری ئاگرین: چالاک | کۆدکردن: AES-256" : "Firewall: ACTIVE | Encryption: AES-256"}
          </div>
        </div>
      </div>
    </div>
  );
}
