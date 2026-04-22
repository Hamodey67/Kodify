"use client";

import Link from "next/link";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, Zap, Layout, Globe } from "lucide-react";
import React, { useRef } from "react";

export default function Hero() {
  const { lang } = useApp();
  const tx = t[lang];
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={containerRef} className="relative pt-32 md:pt-48 pb-10 overflow-hidden">
      {/* Dynamic Background Elements - Hidden on mobile for performance */}
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
           className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-700/10 blur-[160px] rounded-full" 
         />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group lg:p-1"
        >
          <div className="relative group">
            {/* Main Glass Card with Animated Border */}
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl md:backdrop-blur-3xl shadow-2xl p-8 md:p-12 lg:p-16">
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80">{badge}</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-7xl lg:text-[80px] font-black leading-[1.3] tracking-tight text-white mb-8 pb-6"
                  >
                    {tx.heroTitle.split(" ").map((word, i) => (
                      <span key={i} className={cn("inline-block mx-2 md:mx-3 px-1 py-3", i > 1 && "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500")}>
                        {word}
                      </span>
                    ))}
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12"
                  >
                    {tx.heroDesc}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-5"
                  >
                    <Link
                      href="/contact"
                      className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {tx.heroCTA1}
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/case-studies"
                      className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
                    >
                      {tx.heroCTA2}
                    </Link>
                  </motion.div>

                  <div className="mt-16 flex flex-wrap gap-3">
                    {chips.map((x, i) => (
                      <motion.span
                        key={x}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-bold text-white/30 uppercase tracking-widest hover:text-cyan-400 hover:border-cyan-500/30 transition-colors cursor-default"
                      >
                        {x}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Right Side: High-Tech Roadmap Card */}
                <div className="lg:col-span-5 relative">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative rounded-[2.5rem] border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden group/roadmap"
                  >
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none group-hover/roadmap:bg-cyan-500/20 transition-colors duration-700" />
                    
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
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
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover/item:text-cyan-400 group-hover/item:border-cyan-500/30 transition-all duration-300">
                              <step.icon size={22} strokeWidth={1.5} />
                            </div>
                            {i < 3 && <div className="absolute top-12 left-1/2 w-[1px] h-6 bg-white/5" />}
                          </div>
                          <span className="text-sm font-bold text-white/50 group-hover/item:text-white transition-colors">
                            {step.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-10 p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/60 mb-2">
                        {lang === "ar" ? "ضمان الجودة" : lang === "ku" ? "تێبینی" : "Quality Assurance"}
                      </p>
                      <p className="text-xs font-bold text-white/80 leading-relaxed">
                        {lang === "ar" ? "نلتزم بأعلى معايير الأمان والأداء بنسبة 100%." : lang === "ku" ? "ئێمە پابەندین بە بەرزترین ستانداردەکان." : "We adhere to 100% security and performance SLAs from code to cloud."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Floating Tech Badges */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -left-6 px-4 py-2 bg-white text-black text-[10px] font-black rounded-lg shadow-xl"
                  >
                    NEXT.JS 15
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-6 -right-6 px-4 py-2 bg-cyan-500 text-white text-[10px] font-black rounded-lg shadow-xl"
                  >
                    SECURE_STACK
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Bottom Footer Info inside Card Area */}
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] flex items-center gap-6">
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
    </section>
  );
}
