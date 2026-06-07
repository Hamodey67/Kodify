"use client";

import React from "react";
import { MinusCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RedFlagItem } from "../utils";

export default function RedFlagsPanel({
  title,
  flags,
  revealed,
  lockedMessage,
}: {
  title: string;
  flags: RedFlagItem[];
  revealed: boolean;
  lockedMessage: string;
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
          {flags.map((flag) => (
            <li
              key={flag.id}
              className={cn(
                "flex gap-3 rounded-xl border border-[var(--accent-bright)]/20 bg-[var(--accent-primary)]/[0.06] px-3.5 py-3 transition-colors duration-300"
              )}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/15 text-[var(--accent-bright)]">
                <flag.Icon size={15} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{flag.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{flag.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
