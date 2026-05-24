"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function Verdict({
  verdict,
  correct,
  labelCorrect,
  labelWrong,
  scoreLabel,
  score,
  maxScore,
  streakLabel,
  streak,
  onShare,
  shareLabel,
  shareDisabled,
}: {
  verdict: "none" | "safe" | "phishing";
  correct: boolean | null;
  labelCorrect: string;
  labelWrong: string;
  scoreLabel: string;
  score: number;
  maxScore: number;
  streakLabel: string;
  streak: number;
  onShare: () => void;
  shareLabel: string;
  shareDisabled?: boolean;
}) {
  const show = verdict !== "none";

  return (
    <div className="theme-surface rounded-3xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">{scoreLabel}</div>
        <div className="text-sm text-[var(--muted)]">
          {streakLabel}: <span className="font-semibold text-[var(--fg)]">{streak}</span>
        </div>
      </div>

      <div className="mt-2 text-3xl font-bold text-[var(--fg)]">
        {score} <span className="text-[var(--muted-2)] text-xl">/ {maxScore}</span>
      </div>

      <div
        className={cn(
          "mt-4 rounded-2xl border px-4 py-3 text-sm",
          !show
            ? "border-[var(--border)] bg-brand-soft text-[var(--muted)]"
            : correct
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200"
        )}
      >
        {!show ? "—" : correct ? labelCorrect : labelWrong}
      </div>

      <button
        type="button"
        onClick={onShare}
        disabled={shareDisabled}
        className={cn(
          "mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition",
          shareDisabled
            ? "border-[var(--border)] bg-brand-soft text-[var(--muted-2)] opacity-50 cursor-not-allowed"
            : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm"
        )}
      >
        {shareLabel}
      </button>
    </div>
  );
}
