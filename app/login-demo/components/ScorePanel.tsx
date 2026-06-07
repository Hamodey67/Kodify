"use client";

import React from "react";
import { Flame, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScorePanel({
  scoreLabel,
  score,
  maxScore,
  streakLabel,
  streak,
  roundLabel,
  roundCurrent,
  roundTotal,
  shareLabel,
  onShare,
  shareDisabled,
}: {
  scoreLabel: string;
  score: number;
  maxScore: number;
  streakLabel: string;
  streak: number;
  roundLabel: string;
  roundCurrent: number;
  roundTotal: number;
  shareLabel: string;
  onShare: () => void;
  shareDisabled?: boolean;
}) {
  const progress = roundTotal > 0 ? (roundCurrent / roundTotal) * 100 : 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d1a2d]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {scoreLabel}
          </p>
          <p className="mt-1 text-4xl font-black tabular-nums tracking-tight text-white">
            {score}
            <span className="ms-1 text-lg font-semibold text-white/30">/ {maxScore}</span>
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-end">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {streakLabel}
          </p>
          <p className="mt-0.5 flex items-center justify-end gap-1.5 text-lg font-bold text-[var(--accent-bright)]">
            <Flame size={16} className="text-amber-400" aria-hidden />
            {streak}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-white/45">
          <span>{roundLabel}</span>
          <span className="tabular-nums">
            {roundCurrent}/{roundTotal}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-bright)] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onShare}
        disabled={shareDisabled}
        className={cn(
          "mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
          shareDisabled
            ? "cursor-not-allowed border-white/[0.06] text-white/25"
            : "border-white/[0.12] text-white/70 hover:border-[var(--accent-bright)]/40 hover:bg-white/[0.03] hover:text-white"
        )}
      >
        <Share2 size={14} aria-hidden />
        {shareLabel}
      </button>
    </div>
  );
}
