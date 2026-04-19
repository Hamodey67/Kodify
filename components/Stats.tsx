"use client";

import { useApp } from "@/app/providers";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";

export default function Stats() {
  const { lang } = useApp();

  const items = [
    { n: "120+", ar: "مشروع/مهمة", en: "Projects/Tasks", ku: "پرۆژە/ئەرک" },
    { n: "6+", ar: "سنوات خبرة", en: "Years Experience", ku: "ساڵانی ئەزموون" },
    { n: "24/7", ar: "متابعة ودعم", en: "Support", ku: "پشتگیری" },
    { n: "99%", ar: "رضا العملاء", en: "Client Satisfaction", ku: "ڕەزامەندی کڕیار" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((x, i) => {
        const label = lang === "ar" ? x.ar : lang === "ku" ? x.ku : x.en;

        return (
          <Reveal key={x.n} delayMs={i * 80}>
            <TiltCard
              className="rounded-3xl border border-black/10 dark:border-white/10 p-6 bg-black/5 dark:bg-white/5 card-hover"
              maxRotate={10}
              glare
            >
              <div className="text-2xl font-extrabold text-black dark:text-white">{x.n}</div>
              <div className="mt-2 text-sm text-black/70 dark:text-white/70">{label}</div>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
