"use client";

import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useApp } from "@/app/providers";

type Lang = "ar" | "en" | "ku";

import { Layout, Database, Shield } from "lucide-react";

const items = [
  {
    icon: Layout,
    color: "cyan",
    en: {
      title: "Sports subscription platform",
      desc: "Architected a high-concurrency billing engine that reduced manual ops by 60%.",
      tags: ["Next.js", "Recurly", "WhatsApp CTA"],
    },
    ar: {
      title: "منصة اشتراكات رياضية",
      desc: "بناء محرك فوترة عالي الأداء قلل العمل اليدوي بنسبة 60% وزاد المبيعات.",
      tags: ["Next.js", "فوترة", "واتساب"],
    },
    ku: {
      title: "پلاتفۆرمی ئیشتراکە وەرزشی",
      desc: "بنیاتنانی سیستەمێکی پارەدان کە کاری دەستی بە رێژەی %60 کەمکردەوە.",
      tags: ["Next.js", "داشبۆرد", "WhatsApp"],
    },
  },
  {
    icon: Database,
    color: "blue",
    en: {
      title: "Inventory & sales system",
      desc: "Full-stack ERP system with real-time analytics and multi-warehouse sync.",
      tags: ["Admin ERP", "RBAC", "Audit Logs"],
    },
    ar: {
      title: "نظام مخزون ومبيعات ذكي",
      desc: "نظام ERP متكامل مع تحليلات لحظية ومزامنة متعددة للمستودعات.",
      tags: ["ERP", "صلاحيات", "سجلات مبيعات"],
    },
    ku: {
      title: "سیستەمی کۆگا و فرۆشتن",
      desc: "سیستەمی ERP گشتگیر لەگەڵ ڕاپۆرتی کاتی و هاوکاتکردنی کۆگاکان.",
      tags: ["Admin ERP", "دەسەڵات", "Audit"],
    },
  },
  {
    icon: Shield,
    color: "indigo",
    en: {
      title: "Network security overhaul",
      desc: "End-to-end security hardening for a financial firm, closing 12 critical gaps.",
      tags: ["CyberSec", "Hardening", "VAPT"],
    },
    ar: {
      title: "تحصين أمني للشبكات",
      desc: "تحصين أمني شامل لشركة مالية، أدى لإغلاق 12 ثغرة أمنية حرجة.",
      tags: ["أمن سيبراني", "تحصين", "VAPT"],
    },
    ku: {
      title: "ئاسایشی تۆڕی کۆمپانیا",
      desc: "بەهێزکردنی ئاسایشی تۆڕ بۆ کۆمپانیایەکی دارایی و داخستنی 12 کەلێن.",
      tags: ["CyberSec", "Hardening", "VAPT"],
    },
  },
];

export default function CaseStudiesGrid() {
  const { lang } = useApp() as { lang: Lang };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {items.map((it, idx) => {
        const x = lang === "ar" ? it.ar : lang === "ku" ? it.ku : it.en;

        return (
          <Reveal
            key={idx}
            delayMs={idx * 70}
            from={idx % 2 === 0 ? "left" : "right"}
          >
            <TiltCard
              className="group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl md:backdrop-blur-3xl p-8 flex flex-col min-h-[300px] shadow-[var(--card-shadow)] transition-all duration-500 hover:border-[var(--border-strong)]"
              maxRotate={10}
              glare
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                <it.icon size={80} strokeWidth={1} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 shadow-inner">
                    <it.icon size={24} />
                 </div>
                 <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                {x.title}
              </div>
              
              <p className="text-white/50 text-base leading-relaxed mb-8 flex-1 font-medium">
                {x.desc}
              </p>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {x.tags.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-xl border border-white/5 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
