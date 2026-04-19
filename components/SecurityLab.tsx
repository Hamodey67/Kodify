"use client";

import { useApp } from "@/app/providers";
import { t, Lang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ShieldAlert, Fingerprint, MousePointer2, ExternalLink, Zap, Terminal } from "lucide-react";
import Link from "next/link";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";

export default function SecurityLab() {
  const { lang } = useApp() as { lang: Lang };
  const tx = t[lang];

  const labs = [
    {
      href: "/login-demo",
      icon: Fingerprint,
      color: "cyan",
      title: lang === "ar" ? "محاكي تسجيل الدخول السليم" : lang === "ku" ? "دیمۆی چوونەژوورەوەی تەندروست" : "Login Security Demo",
      desc: lang === "ar" ? "تعلم كيف تكتشف صفحات تسجيل الدخول المزيفة والهجمات قبل ما تقع في الفخ." : lang === "ku" ? "فێربە چۆن لاپەڕە فەیکەکان بدۆزیتەوە پێش ئەوەی بکەویتە داوەوە." : "Learn to spot fake login pages and credential harvesting attacks in a safe environment.",
      tag: "VULN_SCAN_INTERACTIVE"
    },
    {
      href: "/phishing",
      icon: ShieldAlert,
      color: "blue",
      title: lang === "ar" ? "محاكي رسائل الصيد" : lang === "ku" ? "فێربوونی فێڵەکانی Phishing" : "Phishing Simulator",
      desc: lang === "ar" ? "اختبر قدرتك على تمييز الرسائل والروابط المشبوهة التي قد تخترق جهازك." : lang === "ku" ? "توانای خۆت تاقیبکەرەوە لە ناسینەوەی نامە و لینکە مەترسیدارەکان." : "Test your ability to distinguish between legitimate emails and malicious phishing attempts.",
      tag: "SOCIAL_ENG_TRAINING"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {labs.map((lab, i) => (
        <Reveal key={lab.href} delayMs={i * 100} from={i === 0 ? "left" : "right"}>
          <Link href={lab.href} className="block group">
            <TiltCard
              maxRotate={10}
              glare
              className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl p-10 flex flex-col h-full shadow-2xl transition-all duration-500 hover:border-cyan-500/30 hover:-translate-y-2"
            >
              {/* Animated HUD Grid overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                 <div className="h-full w-full bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${lab.color}-500/10 border border-${lab.color}-500/20 text-${lab.color}-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500`}>
                      <lab.icon size={28} />
                   </div>
                   <div className="flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                      <span className="text-[10px] font-black tracking-widest uppercase text-white/20 group-hover:text-cyan-400/50">{lab.tag}</span>
                      <ExternalLink size={14} className="text-white/20 group-hover:text-cyan-400" />
                   </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {lab.title}
                </h3>
                
                <p className="text-white/40 text-lg leading-relaxed font-medium mb-10 flex-1">
                  {lab.desc}
                </p>

                <div className="flex items-center gap-4">
                   <div className="flex-1 h-px bg-white/5" />
                   <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:bg-cyan-500 group-hover:text-black group-hover:border-transparent transition-all">
                      {lang === 'ar' ? 'ابدأ المحاكي' : 'Start Simulation'}
                   </div>
                </div>
              </div>

              {/* Interaction Detail */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </TiltCard>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
