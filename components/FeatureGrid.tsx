"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { useApp } from "@/app/providers";
import { ShieldCheck, Zap, CheckCircle2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    en: {
      title: "Security by design",
      desc: "Best practices, secure defaults, and layered protection protocols.",
      tag: "Zero-trust ready",
    },
    ar: {
      title: "الأمان من التصميم",
      desc: "أفضل الممارسات وإعدادات آمنة مع حماية متعددة الطبقات.",
      tag: "جاهزية أمنية",
    },
    ku: {
      title: "ئاسایش لە بنچینەوە",
      desc: "باشترین ڕێکارەکان، ڕێکخستنە پارێزراوەکان، و پاراستنی فرەچێن.",
      tag: "ئامادەیی ئاسایش",
    },
    icon: ShieldCheck,
  },
  {
    en: {
      title: "High performance",
      desc: "Lightning-fast loads, optimized caching, and buttery-smooth UX.",
      tag: "Core Web Vitals",
    },
    ar: {
      title: "أداء فائق السرعة",
      desc: "تحميل فائق السرعة، تخزين ذكي، وتجربة مستخدم سلسة بشكل مبهر.",
      tag: "أداء محسّن",
    },
    ku: {
      title: "کارایی بەرز",
      desc: "بارکردنی خێرا، کاشکردنی گونجاو، و ئەزموونی بەکارهێنەری بێوێنە.",
      tag: "کارایی باشترکراو",
    },
    icon: Zap,
  },
  {
    en: {
      title: "Clean delivery",
      desc: "Structured milestones, rigorous testing, and seamless handoff.",
      tag: "Agile workflow",
    },
    ar: {
      title: "تسليم نظيف ومنظم",
      desc: "مراحل هيكلية، اختبارات صارمة، وعملية تسليم سلسة ومتكاملة.",
      tag: "منهجية واضحة",
    },
    ku: {
      title: "ڕادەستکردنی خاوێن",
      desc: "قۆناغی کارکردنی ڕێکخراو، تاقیکردنەوەی چڕ، و ڕادەستکردنی بێ کێشە.",
      tag: "ڕێکارێکی ڕوون",
    },
    icon: CheckCircle2,
  },
  {
    en: {
      title: "Ongoing support",
      desc: "24/7 monitoring, regular updates, and continuous optimization.",
      tag: "Always-on",
    },
    ar: {
      title: "دعم فني مستدام",
      desc: "مراقبة على مدار الساعة، تحديثات دورية، وتحسينات برمجية مستمرة.",
      tag: "دعم مستمر",
    },
    ku: {
      title: "پشتگیری بەردەوام",
      desc: "چاودێری ٢٤ کاتژمێر، نوێکردنەوەی خولی، و باشترکردنی بەردەوام.",
      tag: "پشتگیری هەمیشەیی",
    },
    icon: Wrench,
  },
];

const stats = {
  ar: [
    { value: "100%", label: "أمان" },
    { value: "24/7", label: "مراقبة" },
    { value: "50+", label: "مشروع" },
    { value: "SLA", label: "التزام" },
  ],
  ku: [
    { value: "100%", label: "ئاسایش" },
    { value: "24/7", label: "چاودێری" },
    { value: "50+", label: "پڕۆژە" },
    { value: "SLA", label: "پابەندی" },
  ],
  en: [
    { value: "100%", label: "Security" },
    { value: "24/7", label: "Monitoring" },
    { value: "50+", label: "Projects" },
    { value: "SLA", label: "Commitment" },
  ],
};

export default function FeatureGrid() {
  const { lang } = useApp();
  const statRow = stats[lang];

  return (
    <div className="relative space-y-8 sm:space-y-10">
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {items.map((it, idx) => {
          const x = lang === "ar" ? it.ar : lang === "ku" ? it.ku : it.en;
          const Icon = it.icon;

          return (
            <Reveal key={idx} delayMs={idx * 70} from="up">
              <motion.article
                whileHover={{ y: -3 }}
                transition={{ duration: 0.22 }}
                className={cn(
                  "group relative flex gap-4 sm:gap-5",
                  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
                  "p-5 sm:p-6 shadow-[var(--card-shadow)]",
                  "transition-colors hover:border-[var(--accent-border)]"
                )}
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent-strong)]">
                  <Icon size={22} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest theme-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-[var(--border)]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black theme-heading mb-1.5 leading-snug">
                    {x.title}
                  </h3>
                  <p className="text-sm theme-muted leading-relaxed">{x.desc}</p>
                  <span className="mt-3 inline-block text-[10px] font-bold theme-accent">
                    {x.tag}
                  </span>
                </div>
              </motion.article>
            </Reveal>
          );
        })}
      </div>

      {/* Stats — شريط واحد مرتب */}
      <Reveal delayMs={120} from="up">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
          {statRow.map((s) => (
            <div
              key={s.label}
              className="bg-[var(--surface-muted)] px-3 py-4 sm:px-4 sm:py-5 text-center"
            >
              <div className="text-lg sm:text-2xl font-black theme-accent tabular-nums leading-none">
                {s.value}
              </div>
              <div className="mt-1.5 text-[10px] sm:text-xs font-bold theme-muted uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
