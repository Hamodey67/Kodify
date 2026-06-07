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
      {/* Animated Hero Glow Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <div className="hero-glow-pulse w-[1000px] h-[600px] rounded-full blur-[120px]" />
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
              <div className="md:hidden absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.06] via-transparent to-transparent pointer-events-none" />
 
              <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 w-full">
                {/* Left Content */}
                <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-start w-full min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 mb-5 sm:mb-8"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-bright)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-bright)]" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[var(--accent-glow)]">{badge}</span>
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
                        className="rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-2 py-3 text-center"
                      >
                        <div className="text-lg sm:text-xl font-black text-[var(--accent-glow)]">{s.v}</div>
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
                      href="/simulator/"
                      className="btn-hero-secondary w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl border text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-[var(--accent-primary)]/15 transition-all active:scale-[0.98]"
                    >
                      {tx.heroCTA2}
                    </Link>
                  </motion.div>
  

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
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-glow)]/70 mb-3 flex justify-center items-center gap-2">
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
                          className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[4.5rem] rounded-xl border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/5 px-3 py-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-glow)]">
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
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-primary)]/10 blur-[60px] rounded-full pointer-events-none group-hover/roadmap:bg-[var(--accent-primary)]/20 transition-colors duration-700" />
                    
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
              <div className="px-4 sm:px-6 py-2 rounded-full border border-[var(--accent-primary)]/15 bg-[var(--accent-primary)]/5 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                {[
                  lang === "ar" ? "تصميم فخم" : "Premium UX",
                  lang === "ar" ? "كود نظيف" : "Clean Code",
                  lang === "ar" ? "تسليم منظم" : "Reliable Delivery"
                ].map((item, id) => (
                  <span key={id} className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]/40" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
