"use client";

import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useApp } from "@/app/providers";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const { lang } = useApp();

  const title =
    lang === "ar" ? "آراء العملاء" : lang === "ku" ? "ڕای کڕیارەکان" : "Testimonials";

  const clientLabel =
    lang === "ar" ? "عميل" : lang === "ku" ? "کڕیار" : "Client";

  return (
    <div>
      <div className="text-3xl font-extrabold text-white">{title}</div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {testimonials.map((x, idx) => {
          const text =
            lang === "ar"
              ? x.ar
              : lang === "ku"
              ? (x as any).ku ?? x.en
              : x.en;

          return (
            <Reveal
              key={idx}
              delayMs={idx * 55}
              from={idx % 2 === 0 ? "left" : "right"}
            >
              <TiltCard
                className="card card-hover p-6 flex flex-col min-h-[170px]"
                maxRotate={12}
                glare
              >
                <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                  “{text}”
                </p>

                <div className="mt-auto pt-4 text-xs text-white/60">
                  {clientLabel} #{idx + 1}
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
