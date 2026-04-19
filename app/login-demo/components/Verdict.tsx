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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">{scoreLabel}</div>
        <div className="text-sm text-white/70">
          {streakLabel}: <span className="font-semibold text-white">{streak}</span>
        </div>
      </div>

      <div className="mt-2 text-3xl font-bold text-white">
        {score} <span className="text-white/40 text-xl">/ {maxScore}</span>
      </div>

      <div
        className={cn(
          "mt-4 rounded-2xl border px-4 py-3 text-sm",
          !show
            ? "border-white/10 bg-black/20 text-white/60"
            : correct
            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
            : "border-rose-400/30 bg-rose-500/10 text-rose-200"
        )}
      >
        {!show ? "—" : correct ? labelCorrect : labelWrong}
      </div>

      <button
        type="button"
        onClick={onShare}
        disabled={shareDisabled}
        className={cn(
          "mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-semibold",
          shareDisabled
            ? "border-white/10 bg-black/10 text-white/30"
            : "border-white/10 bg-white/10 text-white hover:bg-white/15"
        )}
      >
        {shareLabel}
      </button>
    </div>
  );
}
