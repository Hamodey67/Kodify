"use client";

import React from "react";
import {
  Globe,
  Link2,
  Lock,
  MinusCircle,
  Palette,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoClue } from "../data/demo";

const CLUE_ICONS: Record<string, React.ElementType> = {
  domain: Globe,
  http: Lock,
  pressure: Zap,
  branding: Palette,
  cta: Link2,
};

export default function CluesPanel({
  title,
  clues,
  activeClues,
  revealed,
  lockedMessage,
  presentLabel,
  absentLabel,
}: {
  title: string;
  clues: DemoClue[];
  activeClues: Set<string>;
  revealed: boolean;
  lockedMessage: string;
  presentLabel: string;
  absentLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d1a2d]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-[var(--accent-bright)]" aria-hidden />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      {!revealed ? (
        <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-6 text-center">
          <MinusCircle size={20} className="mx-auto text-white/25" aria-hidden />
          <p className="mt-3 text-sm leading-relaxed text-white/45">{lockedMessage}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {clues.map((clue) => {
            const Icon = CLUE_ICONS[clue.id] ?? Globe;
            const present = activeClues.has(clue.id);

            return (
              <li
                key={clue.id}
                className={cn(
                  "flex gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-300",
                  present
                    ? "border-[var(--accent-bright)]/20 bg-[var(--accent-primary)]/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02]"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    present ? "bg-[var(--accent-primary)]/15 text-[var(--accent-bright)]" : "bg-white/[0.04] text-white/35"
                  )}
                >
                  <Icon size={15} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{clue.title}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        present
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-white/[0.06] text-white/35"
                      )}
                    >
                      {present ? presentLabel : absentLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{clue.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
