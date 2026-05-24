"use client";

import Link from "next/link";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Layout, Globe, X, ShieldAlert } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

export default function Hero() {
  const { lang } = useApp();
  const tx = t[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEmulator, setActiveEmulator] = useState<number | null>(null);

  useEffect(() => {
    if (activeEmulator !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeEmulator]);

  const chips =
    lang === "ar"
      ? ["تطبيقات ويب", "لوحات تحكم", "سحابة و IT", "أمن سيبراني"]
      : lang === "ku"
      ? ["وێب ئەپ", "داشبۆرد", "کلەود و IT", "پاراستنی سایبەری"]
      : ["Web Apps", "Dashboards", "IT & Cloud", "Cybersecurity"];

  const badge =
    lang === "ar"
      ? "تكنولوجيا الغد • اليوم"
      : lang === "ku"
      ? "تەکنەلۆژیای بەیانی • ئەمڕۆ"
      : "Next-Gen Tech • Today";

  const stats =
    lang === "ar"
      ? [
          { v: "100%", l: "أمان" },
          { v: "24/7", l: "دعم" },
          { v: "50+", l: "مشروع" },
        ]
      : lang === "ku"
      ? [
          { v: "100%", l: "ئاسایش" },
          { v: "24/7", l: "پشتگیری" },
          { v: "50+", l: "پڕۆژە" },
        ]
      : [
          { v: "100%", l: "Security" },
          { v: "24/7", l: "Support" },
          { v: "50+", l: "Projects" },
        ];

  const renderTitle = () => {
    if (lang === "ar") {
      return (
        <>
          <span className="block theme-heading mb-1 lg:mb-3">نبني حلولًا <span className="text-brand-logo">آمنة</span></span>
          <span className="block text-brand-logo">تُسرّع نمو أعمالك</span>
        </>
      );
    }
    if (lang === "ku") {
      return (
        <>
          <span className="block theme-heading mb-1 lg:mb-3">چارەسەری <span className="text-brand-logo">پارێزراو</span></span>
          <span className="block text-brand-logo">بۆ خێرایی گەشەی کاروبارت</span>
        </>
      );
    }
    return (
      <>
        <span className="block theme-heading mb-1 lg:mb-3">Secure solutions <span className="text-brand-logo">that accelerate</span></span>
        <span className="block text-brand-logo">your business</span>
      </>
    );
  };

  return (
    <section ref={containerRef} className="relative pt-24 sm:pt-32 md:pt-48 pb-8 md:pb-10 overflow-hidden">
      {/* Mobile glow — CSS only */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-sky-400/15 blur-[80px]" />
        <div className="absolute top-1/3 -right-20 w-40 h-40 bg-cyan-500/15 blur-[60px] rounded-full" />
      </div>

      {/* Desktop background orbs */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0],
             opacity: [0.1, 0.15, 0.1] 
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-600/10 blur-[130px] rounded-full" 
         />
         <motion.div 
           animate={{ 
             scale: [1.2, 1, 1.2],
             rotate: [90, 0, 90],
             opacity: [0.1, 0.15, 0.1] 
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-sky-500/8 blur-[160px] rounded-full" 
         />
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group lg:p-1"
        >
          <div className="relative group">
            {/* Main Glass Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-[var(--border-strong)] bg-[var(--surface)] backdrop-blur-xl md:backdrop-blur-3xl hero-card-mobile p-5 sm:p-8 md:p-12 lg:p-16 transition-colors duration-300">
              
              {/* Top accent line — mobile */}
              <div className="md:hidden absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/[0.06] via-transparent to-transparent pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 w-full">
                {/* Left Content */}
                <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-start w-full min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-sky-400/30 bg-sky-400/10 mb-5 sm:mb-8"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sky-300 text-light-black">{badge}</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className="text-2xl leading-[1.3] sm:text-4xl md:text-6xl lg:text-7xl xl:text-[76px] font-black tracking-tight mb-4 sm:mb-8 md:leading-[1.3]"
                  >
                    {renderTitle()}
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="theme-muted text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-6 sm:mb-10 md:mb-12"
                  >
                    {tx.heroDesc}
                  </motion.p>

                  {/* Stats — mobile power */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 md:hidden w-full max-w-sm"
                  >
                    {stats.map((s) => (
                      <div
                        key={s.l}
                        className="rounded-xl border border-sky-400/20 bg-sky-400/5 px-2 py-3 text-center"
                      >
                        <div className="text-lg sm:text-xl font-black text-sky-300">{s.v}</div>
                        <div className="text-[9px] sm:text-[10px] font-bold text-white/40 mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-3 w-full max-w-sm sm:max-w-none sm:w-auto sm:flex-row sm:gap-5"
                  >
                    <Link
                      href="/contact"
                      className="btn-hero-primary group relative w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-black font-black text-sm flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-[0.98]"
                    >
                      {tx.heroCTA1}
                      <ArrowRight size={20} className={cn("transition-transform", lang === "ar" || lang === "ku" ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                    </Link>

                    <Link
                      href="/case-studies"
                      className="btn-hero-secondary w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl border text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-sky-400/15 transition-all active:scale-[0.98]"
                    >
                      {tx.heroCTA2}
                    </Link>
                  </motion.div>

                  <div className="mt-8 sm:mt-12 md:mt-16 flex justify-start gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none w-full">
                    {chips.map((x, i) => (
                      <motion.button
                        key={x}
                        onClick={() => setActiveEmulator(i)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="snap-start group relative shrink-0 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl chip-theme border text-[10px] sm:text-[11px] font-black uppercase tracking-wide sm:tracking-widest transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <div className="w-1.5 h-1.5 rounded-full chip-theme-dot transition-all duration-300" />
                        {x}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Right Side: Roadmap */}
                <div className="lg:col-span-5 relative w-full min-w-0">
                  {/* Mobile: horizontal steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="md:hidden -mx-1"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300/70 mb-3 flex justify-center items-center gap-2">
                      <Layout size={14} />
                      {lang === "ar" ? "خارطة التنفيذ" : lang === "ku" ? "پلانی جێبەجێکردن" : "Delivery Roadmap"}
                    </p>
                    <div className="flex justify-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none w-full">
                      {[
                        { icon: Zap, label: lang === "ar" ? "تحليل" : lang === "ku" ? "پێداچوون" : "Plan" },
                        { icon: Shield, label: lang === "ar" ? "تطوير" : lang === "ku" ? "دیزاین" : "Build" },
                        { icon: Globe, label: lang === "ar" ? "اختبار" : lang === "ku" ? "تاقی" : "Test" },
                        { icon: CheckCircle2, label: lang === "ar" ? "إطلاق" : lang === "ku" ? "دەستپێ" : "Launch" },
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[4.5rem] rounded-xl border border-sky-400/25 bg-sky-400/5 px-3 py-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky-400/15 border border-sky-400/30 flex items-center justify-center text-sky-300">
                            <step.icon size={18} strokeWidth={1.5} />
                          </div>
                          <span className="text-[9px] font-bold text-white/60 text-center leading-tight">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative hidden md:block rounded-[2.5rem] border border-brand bg-roadmap-card backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden group/roadmap"
                  >
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none group-hover/roadmap:bg-cyan-500/20 transition-colors duration-700" />
                    
                    <h3 className="text-xl font-black text-brand-logo mb-8 flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-brand-cyan-badge text-brand-cyan">
                        <Layout size={20} />
                      </span>
                      {lang === "ar" ? "خارطة التنفيذ الذكية" : lang === "ku" ? "پلانی جێبەجێکردن" : "Elite Delivery Roadmap"}
                    </h3>

                    <div className="space-y-6 relative">
                      {[
                        { icon: Zap, label: lang === "ar" ? "تحليل المتطلبات" : lang === "ku" ? "پێداچوونەوە" : "Strategic Planning" },
                        { icon: Shield, label: lang === "ar" ? "تصميم وتطوير" : lang === "ku" ? "دیزاین" : "Premium Development" },
                        { icon: Globe, label: lang === "ar" ? "اختبار جودة فائق" : lang === "ku" ? "تاقیکردنەوە" : "Global Standards Testing" },
                        { icon: CheckCircle2, label: lang === "ar" ? "إطلاق عالمي" : lang === "ku" ? "دەستپێکردن" : "Zero-Day Launch" },
                      ].map((step, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="flex items-center gap-5 group/item"
                        >
                          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-brand-soft border border-brand flex items-center justify-center text-slate-900 dark:text-brand-logo-muted group-hover/item:text-black dark:group-hover/item:text-brand-cyan group-hover/item:border-brand-cyan transition-all duration-300">
                              <step.icon size={22} strokeWidth={1.5} />
                            </div>
                            {i < 3 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-brand-soft group-hover/item:bg-brand-cyan-soft transition-colors" />}
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-brand-logo-muted group-hover/item:text-black dark:group-hover/item:text-brand-logo transition-colors">
                            {step.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-10 p-5 rounded-2xl bg-brand-cyan-soft border-brand-cyan-soft border">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan mb-2">
                        {lang === "ar" ? "ضمان الجودة" : lang === "ku" ? "تێبینی" : "Quality Assurance"}
                      </p>
                      <p className="text-xs font-bold text-brand-logo leading-relaxed">
                        {lang === "ar" ? "نلتزم بأعلى معايير الأمان والأداء بنسبة 100%." : lang === "ku" ? "ئێمە پابەندین بە بەرزترین ستانداردەکان." : "We adhere to 100% security and performance SLAs from code to cloud."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Floating badges — desktop only */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden md:block absolute -top-6 -left-6 px-4 py-2.5 bg-brand-badge backdrop-blur-md border border-brand text-[10px] font-black rounded-xl shadow-2xl"
                  >
                    NEXT.JS 15
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="hidden md:block absolute -bottom-6 -right-6 px-4 py-2.5 bg-brand-cyan-badge backdrop-blur-md border border-brand-cyan-soft text-[10px] font-black rounded-xl shadow-2xl"
                  >
                    SECURE_STACK
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Bottom Footer — desktop */}
            <div className="mt-6 md:mt-8 hidden sm:flex justify-center">
              <div className="px-4 sm:px-6 py-2 rounded-full border border-sky-400/15 bg-sky-400/5 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                {[
                  lang === "ar" ? "تصميم فخم" : "Premium UX",
                  lang === "ar" ? "كود نظيف" : "Clean Code",
                  lang === "ar" ? "تسليم منظم" : "Reliable Delivery"
                ].map((item, id) => (
                  <span key={id} className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emulator Modal */}
      <AnimatePresence>
        {activeEmulator !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir={lang === "ar" || lang === "ku" ? "rtl" : "ltr"}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEmulator(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-[95vw] sm:w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              style={{ height: '70vh', maxHeight: '600px' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-4" dir="ltr">
                    <button onClick={() => setActiveEmulator(null)} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono font-medium text-white/40 select-none uppercase tracking-widest">
                    {activeEmulator === 0 ? "browser - next.js" :
                     activeEmulator === 1 ? "dashboard - analytics" :
                     activeEmulator === 2 ? "terminal - root@cloud" :
                     "security - scan"}
                  </span>
                </div>
                <button onClick={() => setActiveEmulator(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden relative bg-[#0a0f1c]" dir="ltr">
                {activeEmulator === 0 && <WebEmulator />}
                {activeEmulator === 1 && <DashboardEmulator />}
                {activeEmulator === 2 && <CloudEmulator />}
                {activeEmulator === 3 && <SecurityEmulator />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

function WebEmulator() {
  return (
    <div className="w-full h-full flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
      <div className="h-12 border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between shrink-0">
        <div className="font-black text-lg sm:text-xl tracking-tighter text-sky-600">Logo</div>
        <div className="hidden sm:flex gap-6 text-sm font-medium text-slate-500">
          <div className="hover:text-slate-900 cursor-pointer">Home</div>
          <div className="hover:text-slate-900 cursor-pointer">Features</div>
          <div className="hover:text-slate-900 cursor-pointer">Pricing</div>
        </div>
        <div className="px-3 py-1.5 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-medium">Sign Up</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4 tracking-tight">Build the Future</h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-6 sm:mb-8">Create stunning websites with our modern components and highly optimized frameworks.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <div className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-bold text-sm">Get Started</div>
            <div className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">Learn More</div>
          </div>
        </div>
        
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12 relative z-10">
          {[1,2,3].map(i => (
             <div key={i} className="h-24 sm:h-32 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 text-left flex flex-col justify-center">
               <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sky-100 mb-2 sm:mb-3" />
               <div className="w-16 sm:w-20 h-2 bg-slate-200 rounded-full mb-2" />
               <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full mb-1" />
               <div className="w-2/3 h-1.5 sm:h-2 bg-slate-100 rounded-full" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardEmulator() {
  return (
    <div className="w-full h-full flex bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <div className="w-32 sm:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-14 border-b border-slate-200 flex items-center px-4 font-bold text-slate-800 text-sm sm:text-base">Analytics</div>
        <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
          {["Overview", "Users", "Revenue", "Settings"].map((item, i) => (
             <div key={item} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${i === 0 ? "bg-sky-50 text-sky-600" : "text-slate-500 hover:bg-slate-50"}`}>
               {item}
             </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
           <h2 className="text-lg sm:text-xl font-bold">Overview</h2>
           <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm">Last 30 Days</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
           {[ {l: "Total Users", v: "12,450", c: "+15%"}, {l: "Revenue", v: "$45,200", c: "+8%"}, {l: "Bounce Rate", v: "24.5%", c: "-2%"} ].map((s,i) => (
             <div key={i} className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl">
               <div className="text-[10px] sm:text-xs text-slate-500 mb-1">{s.l}</div>
               <div className="text-xl sm:text-2xl font-bold mb-1">{s.v}</div>
               <div className="text-[10px] sm:text-xs text-emerald-500 font-medium">{s.c} from last month</div>
             </div>
           ))}
        </div>
        <div className="h-40 sm:h-64 bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col">
           <div className="text-xs sm:text-sm font-bold mb-2 sm:mb-4">Traffic Sources</div>
           <div className="flex-1 flex items-end gap-1 sm:gap-2 px-2 sm:px-4 pt-2 sm:pt-4 border-b border-slate-100">
             {[40, 70, 45, 90, 65, 80, 55, 100, 60, 40].map((h, i) => (
               <div key={i} className="flex-1 bg-sky-200 rounded-t-sm sm:rounded-t-md relative group">
                 <div className="absolute bottom-0 left-0 w-full bg-sky-500 rounded-t-sm sm:rounded-t-md transition-all duration-500" style={{ height: `${h}%` }} />
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function CloudEmulator() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-emerald-400 font-mono text-xs sm:text-sm p-4 overflow-hidden flex flex-col">
       <div className="mb-4">
         <span className="text-sky-400">root@kodify-cloud</span>:<span className="text-blue-400">~/server</span>$ ./status --watch
       </div>
       <div className="flex-1 overflow-y-auto">
         <div className="flex flex-col gap-1 opacity-80">
           <div className="flex justify-between border-b border-emerald-900/50 pb-1 mb-2 text-[10px] sm:text-xs text-emerald-600">
             <span className="w-24 sm:w-32">SERVICE</span><span className="w-12 sm:w-16">STATUS</span><span className="w-12 sm:w-16">CPU</span><span>MEM</span>
           </div>
           {["api-gateway", "auth-service", "db-primary", "cache-redis", "worker-queue"].map((s) => (
             <div key={s} className="flex justify-between">
               <span className="w-24 sm:w-32 truncate pr-2">{s}</span>
               <span className="w-12 sm:w-16 text-emerald-500">[OK]</span>
               <span className="w-12 sm:w-16">{Math.floor(Math.random() * 20)}.{Math.floor(Math.random() * 9)}%</span>
               <span>{Math.floor(Math.random() * 500)}MB</span>
             </div>
           ))}
           <br/>
           <div>System Load: 1.04 1.12 1.08</div>
           <div>Uptime: 45 days, 12 hours, 23 mins</div>
           <br/>
           <div className="animate-pulse">Monitoring active logs...</div>
         </div>
       </div>
    </div>
  );
}

function SecurityEmulator() {
  return (
    <div className="w-full h-full bg-slate-950 text-sky-400 font-mono text-xs sm:text-sm p-6 overflow-hidden flex flex-col relative items-center justify-center">
       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0, #020617 100%), repeating-radial-gradient(circle at center, transparent, transparent 40px, rgba(56, 189, 248, 0.2) 41px)' }} />
       
       <div className="relative z-10 flex flex-col items-center">
         <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-sky-500/50 flex items-center justify-center relative mb-6 sm:mb-8">
           <div className="absolute inset-0 rounded-full border border-sky-400/20 animate-ping" style={{ animationDuration: '3s' }} />
           <ShieldAlert className="text-sky-400 w-10 h-10 sm:w-12 sm:h-12" />
           <div className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-[2px] bg-sky-400 origin-left animate-spin" style={{ animationDuration: '4s', animationTimingFunction: 'linear' }} />
         </div>
         
         <div className="text-center">
           <div className="text-lg sm:text-xl font-black text-white mb-2 tracking-widest">NETWORK SECURE</div>
           <div className="text-sky-500/60 mb-1">0 Threats Detected</div>
           <div className="text-sky-500/60">Firewall: ACTIVE | Encryption: AES-256</div>
         </div>
       </div>
    </div>
  );
}
