"use client";

import React from "react";
import { Scenario, Lang } from "../data/scenarios";

export default function ResultPanel({
  scenario,
  lang,
  picked,
  onNext,
  isLast,
  score,
  total,
  streak,
}: {
  scenario: Scenario;
  lang: Lang;
  picked: "safe" | "phish";
  onNext: () => void;
  isLast: boolean;
  score: number;
  total: number;
  streak: number;
}) {
  const correct = (picked === "phish") === scenario.isPhishing;

  const heading =
    lang === "ar"
      ? correct
        ? "إجابة صحيحة ✅"
        : "مو صحيح ❌"
      : lang === "ku"
      ? correct
        ? "وەڵامی ڕاست ✅"
        : "هەڵەیە ❌"
      : correct
      ? "Correct ✅"
      : "Not quite ❌";

  const sub =
    lang === "ar"
      ? scenario.isPhishing
        ? "هذي محاولة تصيّد (Phishing)."
        : "هذي رسالة طبيعية (Legit)."
      : lang === "ku"
      ? scenario.isPhishing
        ? "ئەمە هەوڵی Phishing ـە."
        : "ئەمە نامەی ئاساییە (Legit)."
      : scenario.isPhishing
      ? "This is phishing."
      : "This is legitimate.";

  const nextLabel =
    lang === "ar" ? (isLast ? "شوف نتيجتك" : "التالي") : lang === "ku" ? (isLast ? "ئەنجام" : "دواتر") : isLast ? "See results" : "Next";

  const scoreLabel =
    lang === "ar" ? `النتيجة: ${score} / ${total}` : lang === "ku" ? `ئەنجام: ${score} / ${total}` : `Score: ${score} / ${total}`;

  const streakLabel =
    lang === "ar" ? `سلسلة صحيحة: ${streak}` : lang === "ku" ? `ڕیزەوەی ڕاست: ${streak}` : `Streak: ${streak}`;

  return (
    <div className='theme-surface rounded-2xl p-5'>
      <div className='flex flex-col gap-2'>
        <div className='text-lg font-semibold text-[var(--fg)]'>{heading}</div>
        <div className='text-sm text-[var(--muted)]'>{sub}</div>

        <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-2)]'>
          <span className='rounded-full bg-brand-soft px-3 py-1 border border-[var(--border)]'>{scoreLabel}</span>
          <span className='rounded-full bg-brand-soft px-3 py-1 border border-[var(--border)]'>🔥 {streakLabel}</span>
        </div>

        <div className='mt-4'>
          <div className='text-sm font-medium text-[var(--fg)]'>
            {lang === "ar" ? "ليش؟" : lang === "ku" ? "بۆچی؟" : "Why?"}
          </div>
          <ul className='mt-2 list-disc space-y-1 ps-5 text-sm text-[var(--muted)]'>
            {scenario.reasons[lang].map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <button
          type='button'
          onClick={onNext}
          className='mt-5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm active:scale-[0.99]'
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
