"use client";

import { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

type Lang = "ar" | "en" | "ku";

type FlipCardLabels = {
  hoverHint: string;
  openCta: string;
  comingSoon: string;
};

const defaultLabelsByLang: Record<Lang, FlipCardLabels> = {
  ar: {
    hoverHint: "عرض التفاصيل",
    openCta: "زيارة الموقع ↗",
    comingSoon: "قريبًا",
  },
  en: {
    hoverHint: "View details",
    openCta: "Visit Site ↗",
    comingSoon: "Coming soon",
  },
  ku: {
    hoverHint: "بینینی وردەکاری",
    openCta: "بینینی ماڵپەڕ ↗",
    comingSoon: "بەم زووانە",
  },
};

type FlipCardProps = {
  title: string;
  description: string;
  chips?: string[];
  image?: React.ReactNode;
  backTitle?: string;
  backText?: string;
  backChips?: string[];
  href?: string;
  lang?: Lang;
  labels?: Partial<FlipCardLabels>;
};

export default function FlipCard({
  title,
  description,
  chips = [],
  image,
  backText,
  href,
  lang = "ar",
  labels,
}: FlipCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0;
  }, []);

  const ui: FlipCardLabels = {
    ...defaultLabelsByLang[lang],
    ...(labels ?? {}),
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full h-[450px]">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {}}
        onMouseLeave={() => setMousePos({ x: 50, y: 50 })}
        className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-[var(--border)] bg-[var(--surface)] backdrop-blur-md cursor-default group shadow-[var(--card-shadow)]"
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 z-0">
          {image ? (
            <div className="h-full w-full transition-transform duration-1000 ease-out group-hover:scale-110">
              {image}
            </div>
          ) : (
            <div className="h-full w-full bg-slate-800" />
          )}
          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors duration-500" />
        </div>

        {/* Dynamic Glow and Border */}
        {!isTouch && (
          <div 
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, rgba(34, 211, 238, 0.1), transparent)`
            }}
          />
        )}
        
        <div className="absolute inset-0 z-10 border border-transparent group-hover:border-cyan-500/20 rounded-[2.5rem] transition-colors duration-500" />

        {/* Content Container */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 text-right">
          {/* Top Section: Tags */}
          <div className="flex flex-wrap gap-2 justify-end">
            {chips.map((chip, i) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-cyan-400 backdrop-blur-xl uppercase tracking-widest shadow-lg"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Bottom Section: Info */}
          <div className="relative">
            <h3 className="text-3xl font-black text-white tracking-tight mb-4 group-hover:text-cyan-400 transition-colors duration-300">
              {title}
            </h3>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium line-clamp-3 opacity-90">
              {backText || description}
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-between gap-4">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-2xl bg-cyan-500 text-black font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(34,211,238,0.2)] hover:shadow-[0_15px_40px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:-translate-y-1 active:translate-y-0"
                >
                  {ui.openCta}
                </a>
              ) : (
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                  {ui.comingSoon}
                </div>
              )}

              <div className="w-12 h-[2px] bg-cyan-500/30 group-hover:w-20 transition-all duration-500 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


