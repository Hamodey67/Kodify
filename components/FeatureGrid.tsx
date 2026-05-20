"use client";

import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useApp } from "@/app/providers";
import { ShieldCheck, Zap, CheckCircle2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

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
    color: "blue",
  },
  {
    en: {
      title: "High performance",
      desc: "Lightning fast loads, optimized caching, and buttery smooth UX.",
    },
    ar: {
      title: "أداء فائق السرعة",
      desc: "تحميل فائق السرعة، تخزين ذكي، وتجربة مستخدم سلسة بشكل مبهر.",
    },
    ku: {
      title: "ئادای بەرز",
      desc: "بارکردنی زۆر خێرا، کاشکردنی گونجاو، و ئەزموونێکی بەکارهێنەری زۆر نەرم.",
    },
    icon: Zap,
    color: "cyan",
  },
  {
    en: {
      title: "Clean delivery",
      desc: "Structured milestones, rigorous testing, and seamless handoff.",
    },
    ar: {
      title: "تسليم نظيف ومنظم",
      desc: "مراحل هيكلية، اختبارات صارمة، وعملية تسليم سلسة ومتكاملة.",
    },
    ku: {
      title: "گەیاندنی ڕێکخراو",
      desc: "قۆناغە ڕێکخراووەکان، تاقیکردنەوەی چڕ، و گواستنەوەی بێ کێشە.",
    },
    icon: CheckCircle2,
    color: "sky",
  },
  {
    en: {
      title: "Ongoing support",
      desc: "24/7 monitoring, regular updates, and continuous optimization.",
    },
    ar: {
      title: "دعم فني مستدام",
      desc: "مراقبة على مدار الساعة، تحديثات دورية، وتحسينات برمجية مستمرة.",
    },
    ku: {
      title: "پشتگیری بەردەوام",
      desc: "چاودێری بەردەوام، نوێکردنەوەی ناوبەناو، و چاکسازی بێ بڕانەوە.",
    },
    icon: Wrench,
    color: "indigo",
  },
];

const accent = {
  blue: {
    icon: "bg-sky-400/20 border-sky-400/40 text-sky-300",
    iconLg: "lg:bg-sky-400/15 lg:border-sky-400/35 lg:shadow-[0_0_30px_rgba(125,211,252,0.2)]",
    iconHover:
      "lg:group-hover:bg-sky-400/25 lg:group-hover:border-sky-300/50 lg:group-hover:shadow-[0_0_40px_rgba(125,211,252,0.35)]",
    card: "border-sky-400/25",
    cardLg:
      "lg:border-sky-400/20 lg:bg-slate-950/50 lg:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_-12px_rgba(103,232,249,0.2)]",
    cardHover:
      "lg:hover:border-sky-300/40 lg:hover:-translate-y-1 lg:hover:shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_50px_-8px_rgba(125,211,252,0.35)]",
    glow: "bg-sky-400/20",
    line: "from-sky-400 via-cyan-400 to-transparent",
    num: "text-sky-400/25 lg:text-sky-400/20",
    numHover: "lg:group-hover:text-sky-300/40",
    title: "lg:group-hover:text-sky-200",
    dot: "bg-sky-400",
  },
  cyan: {
    icon: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
    iconLg: "lg:bg-cyan-500/15 lg:border-cyan-500/35 lg:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    iconHover:
      "lg:group-hover:bg-cyan-500/25 lg:group-hover:border-cyan-400/50 lg:group-hover:shadow-[0_0_40px_rgba(6,182,212,0.35)]",
    card: "border-cyan-500/25",
    cardLg:
      "lg:border-cyan-500/20 lg:bg-slate-950/50 lg:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_-12px_rgba(6,182,212,0.15)]",
    cardHover:
      "lg:hover:border-cyan-400/40 lg:hover:-translate-y-1 lg:hover:shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_50px_-8px_rgba(6,182,212,0.3)]",
    glow: "bg-cyan-500/20",
    line: "from-cyan-500 via-sky-300 to-transparent",
    num: "text-cyan-500/25 lg:text-cyan-500/20",
    numHover: "lg:group-hover:text-cyan-400/40",
    title: "lg:group-hover:text-cyan-300",
    dot: "bg-cyan-500",
  },
  sky: {
    icon: "bg-sky-500/20 border-sky-500/40 text-sky-400",
    iconLg: "lg:bg-sky-500/15 lg:border-sky-500/35 lg:shadow-[0_0_30px_rgba(14,165,233,0.2)]",
    iconHover:
      "lg:group-hover:bg-sky-500/25 lg:group-hover:border-sky-400/50 lg:group-hover:shadow-[0_0_40px_rgba(14,165,233,0.35)]",
    card: "border-sky-500/25",
    cardLg:
      "lg:border-sky-500/20 lg:bg-slate-950/50 lg:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_-12px_rgba(14,165,233,0.15)]",
    cardHover:
      "lg:hover:border-sky-400/40 lg:hover:-translate-y-1 lg:hover:shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_50px_-8px_rgba(14,165,233,0.3)]",
    glow: "bg-sky-500/20",
    line: "from-sky-500 via-sky-300 to-transparent",
    num: "text-sky-500/25 lg:text-sky-500/20",
    numHover: "lg:group-hover:text-sky-400/40",
    title: "lg:group-hover:text-sky-300",
    dot: "bg-sky-500",
  },
  indigo: {
    icon: "bg-indigo-500/20 border-indigo-500/40 text-indigo-400",
    iconLg: "lg:bg-indigo-500/15 lg:border-indigo-500/35 lg:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    iconHover:
      "lg:group-hover:bg-indigo-500/25 lg:group-hover:border-indigo-400/50 lg:group-hover:shadow-[0_0_40px_rgba(99,102,241,0.35)]",
    card: "border-indigo-500/25",
    cardLg:
      "lg:border-indigo-500/20 lg:bg-slate-950/50 lg:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_-12px_rgba(99,102,241,0.15)]",
    cardHover:
      "lg:hover:border-indigo-400/40 lg:hover:-translate-y-1 lg:hover:shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_50px_-8px_rgba(99,102,241,0.3)]",
    glow: "bg-indigo-500/20",
    line: "from-indigo-500 via-sky-300 to-transparent",
    num: "text-indigo-500/25 lg:text-indigo-500/20",
    numHover: "lg:group-hover:text-indigo-400/40",
    title: "lg:group-hover:text-indigo-300",
    dot: "bg-indigo-500",
  },
};

function CardContent({
  idx,
  x,
  Icon,
  a,
}: {
  idx: number;
  x: { title: string; desc: string };
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  a: (typeof accent)[keyof typeof accent];
}) {
  return (
    <>
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-100 lg:opacity-70 lg:group-hover:opacity-100 transition-opacity",
          a.line
        )}
      />
      <div
        className={cn(
          "absolute -bottom-16 -end-16 w-44 h-44 blur-[60px] rounded-full opacity-50 lg:opacity-30 lg:group-hover:opacity-70 transition-all duration-700 pointer-events-none",
          a.glow
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/[0.06] via-transparent to-transparent lg:from-sky-400/[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50 lg:opacity-30 lg:group-hover:opacity-60 transition-opacity pointer-events-none" />

      {/* Watermark number — desktop */}
      <span
        className={cn(
          "hidden lg:block absolute -top-2 -end-1 font-mono text-[4.5rem] font-black leading-none select-none pointer-events-none transition-colors duration-500",
          a.num,
          a.numHover
        )}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <div className="flex items-start justify-between gap-3 mb-3 lg:mb-0">
          <span
            className={cn(
              "lg:hidden font-mono text-3xl font-black tabular-nums leading-none",
              a.num
            )}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div
            className={cn(
              "shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center border transition-all duration-500 lg:mb-7",
              a.icon,
              a.iconLg,
              a.iconHover
            )}
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              className="lg:w-7 lg:h-7 transition-transform duration-500 lg:group-hover:scale-110 lg:group-hover:-rotate-6"
            />
          </div>
        </div>

        <h3
          className={cn(
            "text-lg sm:text-xl lg:text-[1.35rem] font-black theme-heading mb-2 sm:mb-3 lg:mb-4 transition-colors duration-500",
            a.title
          )}
        >
          {x.title}
        </h3>

        <p className="text-sm lg:text-[0.95rem] font-medium theme-muted leading-relaxed lg:group-hover:opacity-90 transition-colors flex-1">
          {x.desc}
        </p>

        <div className="mt-5 lg:mt-8 flex items-center gap-2 opacity-50 lg:opacity-30 lg:group-hover:opacity-70 transition-all">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", a.dot)} />
          <div className="h-px flex-1 bg-gradient-to-r from-sky-400/50 to-transparent" />
          <span className="text-[8px] font-black tracking-[0.3em] text-sky-300/80 uppercase font-mono">
            module_{idx + 1}
          </span>
        </div>
      </div>
    </>
  );
}

export default function FeatureGrid() {
  const { lang } = useApp();

  return (
    <div className="relative">
      {/* Connector line — desktop 2x2 grid */}
      <div
        className="hidden lg:block absolute top-[42%] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-sky-400/25 to-transparent pointer-events-none z-0"
        aria-hidden
      />
      <div
        className="hidden lg:block absolute left-[50%] top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent pointer-events-none z-0"
        aria-hidden
      />

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {items.map((it, idx) => {
          const x = lang === "ar" ? it.ar : lang === "ku" ? it.ku : it.en;
          const Icon = it.icon;
          const colorKey = it.color as keyof typeof accent;
          const a = accent[colorKey];

          const cardClass = cn(
            "group relative h-full flex flex-col overflow-hidden",
            "rounded-2xl sm:rounded-[1.75rem] lg:rounded-[2rem]",
          "bg-[var(--surface)] backdrop-blur-xl",
          "border border-[var(--border)] p-5 sm:p-6 lg:p-8 lg:min-h-[260px] xl:min-h-[280px]",
          "shadow-[var(--card-shadow)]",
            "transition-all duration-500",
            a.card,
            a.cardLg,
            a.cardHover
          );

          const inner = <CardContent idx={idx} x={x} Icon={Icon} a={a} />;

          return (
            <Reveal key={idx} delayMs={idx * 100} from="up">
              <div className={cn(cardClass, "md:hidden")}>{inner}</div>
              <TiltCard maxRotate={8} glare className={cn(cardClass, "hidden md:flex")}>
                {inner}
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
