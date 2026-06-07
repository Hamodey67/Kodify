"use client";

import React from "react";
import { Globe, Lightbulb, Shield, Zap } from "lucide-react";

const TIP_ICONS = [Globe, Zap, Shield];

export default function TipsPanel({
  title,
  tips,
}: {
  title: string;
  tips: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d1a2d]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2">
        <Lightbulb size={16} className="text-[var(--accent-bright)]" aria-hidden />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      <ul className="mt-4 space-y-2.5">
        {tips.map((tip, i) => {
          const Icon = TIP_ICONS[i % TIP_ICONS.length];
          return (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/12 text-[var(--accent-bright)]">
                <Icon size={14} aria-hidden />
              </div>
              <p className="text-xs leading-relaxed text-white/60">{tip}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
