"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useApp } from "@/app/providers";
import { ShieldCheck, Zap, CheckCircle2, Wrench } from "lucide-react";

const items = [
  {
    en: {
      title: "Security by design",
      desc: "Best practices, secure defaults, and layered protection protocols.",
    },
    ar: {
      title: "الأمان من التصميم",
      desc: "أفضل الممارسات وإعدادات آمنة مع حماية متعددة الطبقات.",
    },
    ku: {
      title: "ئاسایش لە سەرەتاوە",
      desc: "باشترین ڕێنماییەکان، ڕێکخستنە پارێزراوەکان، و پاراستنی فرە چین.",
    },
    icon: ShieldCheck,
    color: "cyan",
  },
  {
    en: { title: "High performance", desc: "Lightning fast loads, optimized caching, and buttery smooth UX." },
    ar: { title: "أداء عالي الأداء", desc: "تحميل فائق السرعة، تخزين ذكي، وتجربة مستخدم سلسة بشكل مبهر." },
    ku: { title: "ئادای بەرز", desc: "بارکردنی زۆر خێرا، کاشکردنی گونجاو، و ئەزموونێکی بەکارهێنەری زۆر نەرم." },
    icon: Zap,
    color: "blue",
  },
  {
    en: { title: "Clean delivery", desc: "Structured milestones, rigorous testing, and seamless handoff." },
    ar: { title: "تسليم نظيف ومنظم", desc: "مراحل هيكلية، اختبارات صارمة، وعملية تسليم سلسة ومتكاملة." },
    ku: { title: "گەیاندنی ڕێکخراو", desc: "قۆناغە ڕێکخراووەکان، تاقیکردنەوەی چڕ، و گواستنەوەی بێ کێشە." },
    icon: CheckCircle2,
    color: "sky",
  },
  {
    en: { title: "Ongoing support", desc: "24/7 monitoring, regular updates, and continuous optimization." },
    ar: { title: "دعم فني مستدام", desc: "مراقبة على مدار الساعة، تحديثات دورية، وتحسينات برمجية مستمرة." },
    ku: { title: "پشتگیری بەردەوام", desc: "چاودێري بەردەوام، نوێکردنەوەی ناوبەناو، و چاکسازی بێ بڕانەوە." },
    icon: Wrench,
    color: "indigo",
  },
];

const colorStyles = {
  cyan: "group-hover:text-cyan-400 group-hover:bg-cyan-500/10 shadow-cyan-500/20",
  blue: "group-hover:text-blue-400 group-hover:bg-blue-500/10 shadow-blue-500/20",
  sky: "group-hover:text-sky-400 group-hover:bg-sky-500/10 shadow-sky-500/20",
  indigo: "group-hover:text-indigo-400 group-hover:bg-indigo-500/10 shadow-indigo-500/20",
};

export default function FeatureGrid() {
  const { lang } = useApp();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {items.map((it, idx) => {
        const x = lang === "ar" ? it.ar : lang === "ku" ? it.ku : it.en;
        const Icon = it.icon;

        return (
          <Reveal
            key={idx}
            delayMs={idx * 100}
            from="up"
          >
            <TiltCard
              maxRotate={15}
              glare
              className="group relative h-full flex flex-col p-8 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Animated hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Dynamic light orb */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 
                ${it.color === 'cyan' ? 'bg-cyan-500' : it.color === 'blue' ? 'bg-blue-500' : it.color === 'sky' ? 'bg-sky-500' : 'bg-indigo-500'}`} 
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500
                    bg-white/[0.05] border border-white/10 text-white/60
                    ${colorStyles[it.color as keyof typeof colorStyles]}
                `}>
                  <Icon size={28} strokeWidth={1.5} className="transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <h3 className="text-xl font-black text-white mb-4 group-hover:tracking-wide transition-all duration-500">
                  {x.title}
                </h3>
                
                <p className="text-sm font-medium text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                  {x.desc}
                </p>

                {/* Decorative corner element */}
                <div className="mt-auto pt-6 flex justify-end">
                   <div className="w-8 h-[2px] bg-white opacity-[0.05] group-hover:opacity-20 group-hover:w-16 transition-all duration-700" />
                </div>
              </div>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
