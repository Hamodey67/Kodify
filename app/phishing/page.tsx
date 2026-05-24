"use client";

import React, { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { useApp } from "@/app/providers";
import ProgressBar from "./components/ProgressBar";
import EmailCard from "./components/EmailCard";
import ResultPanel from "./components/ResultPanel";
import { getScenarios } from "./data/scenarios";

type Pick = "safe" | "phish";

export default function PhishingPage() {
  const { lang } = useApp();

  const scenarios = useMemo(() => getScenarios(), []);
  const total = scenarios.length;

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Pick | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);

  const scenario = scenarios[idx];

  const title =
    lang === "ar"
      ? "🎣 محاكي التصيّد (Phishing Simulator)"
      : lang === "ku"
      ? "🎣 فێربوونی Phishing (Simulator)"
      : "🎣 Phishing Simulator";

  const desc =
    lang === "ar"
      ? "اقرأ الرسالة واختر: آمنة لو خطر/احتيال. بعدها نوضح لك الأدلة."
      : lang === "ku"
      ? "نامەکە بخوێنەوە و هەڵبژێرە: ئاساییە یان مەترسی/فێڵ. دواتر نیشانەکان دەبینیت."
      : "Read the message and decide: Legit or Risk. Then we show you the clues.";

  // ✅ بدلنا كلمة "تصيد" إلى "خطر/احتيال" حتى تكون أوضح
  const safeLabel =
    lang === "ar" ? "✅ آمنة" : lang === "ku" ? "✅ ئاساییە" : "✅ Legit";

  const phishLabel =
    lang === "ar"
      ? "⚠️ خطر / احتيال"
      : lang === "ku"
      ? "⚠️ مەترسی / فێڵ"
      : "⚠️ Risk / Scam";

  function pick(v: Pick) {
    if (picked) return;

    setPicked(v);

    const correct = (v === "phish") === scenario.isPhishing;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  }

  function next() {
    if (!picked) return;

    const isLast = idx === total - 1;
    if (isLast) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setDone(false);
  }

  const rank = useMemo(() => {
    const pct = total ? score / total : 0;
    if (pct >= 0.85) return "Security Pro 🏅";
    if (pct >= 0.6) return "Phish Hunter 🔥";
    return "Rookie 🎓";
  }, [score, total]);

  return (
    <>
      {/* ✅ هنا التوسيط الحقيقي: mx-auto + w-full + max-w */}
      <Section
        title={title}
        desc={desc}
        className="w-full max-w-6xl mx-auto"
      >
        {/* ✅ grid داخل Container متوسّط */}
        <div className="mx-auto w-full grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ProgressBar
              value={Math.min(idx + (done ? 1 : 0), total)}
              max={total}
            />

            {!done ? (
              <>
                <EmailCard scenario={scenario} lang={lang} reveal={!!picked} />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!!picked}
                    onClick={() => pick("safe")}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] disabled:opacity-50 shadow-sm"
                  >
                    {safeLabel}
                  </button>
                  <button
                    type="button"
                    disabled={!!picked}
                    onClick={() => pick("phish")}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] disabled:opacity-50 shadow-sm"
                  >
                    {phishLabel}
                  </button>
                </div>

                <div className="text-xs text-[var(--muted-2)]">
                  {lang === "ar"
                    ? "ملاحظة: هذا تدريب فقط — لا تدخل بيانات حقيقية."
                    : lang === "ku"
                    ? "تێبینی: ئەمە تەنها فێرکارییە — هیچ زانیارییەکی ڕاست مەنووسە."
                    : "Note: Training only — never enter real credentials."}
                </div>
              </>
            ) : (
              <div className="theme-surface rounded-2xl p-6">
                <div className="text-2xl font-bold text-[var(--fg)]">
                  {lang === "ar"
                    ? "انتهينا ✅"
                    : lang === "ku"
                    ? "تەواو بوو ✅"
                    : "Done ✅"}
                </div>

                <div className="mt-2 text-sm text-[var(--muted)]">
                  {lang === "ar"
                    ? `نتيجتك: ${score} / ${total}`
                    : lang === "ku"
                    ? `ئەنجامەکەت: ${score} / ${total}`
                    : `Your score: ${score} / ${total}`}
                </div>

                <div className="mt-3 text-sm text-[var(--muted)]">
                  {lang === "ar"
                    ? `أفضل سلسلة صحيحة: ${bestStreak}`
                    : lang === "ku"
                    ? `باشترین ڕیزەوە: ${bestStreak}`
                    : `Best streak: ${bestStreak}`}
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-[var(--fg)] border border-[var(--border)]">
                  {rank}
                </div>

                <button
                  type="button"
                  onClick={restart}
                  className="mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm"
                >
                  {lang === "ar"
                    ? "ابدأ من جديد"
                    : lang === "ku"
                    ? "دووبارە دەستپێبکە"
                    : "Restart"}
                </button>
              </div>
            )}
          </div>

          <div>
            {!done && picked ? (
              <ResultPanel
                scenario={scenario}
                lang={lang}
                picked={picked}
                onNext={next}
                isLast={idx === total - 1}
                score={score}
                total={total}
                streak={streak}
              />
            ) : (
              <div className="theme-surface rounded-2xl p-6 text-sm text-[var(--muted)]">
                <div className="text-base font-semibold text-[var(--fg)]">
                  {lang === "ar"
                    ? "نصيحة سريعة 👇"
                    : lang === "ku"
                    ? "ئامۆژگاری خێرا 👇"
                    : "Quick tip 👇"}
                </div>

                <ul className="mt-3 list-disc space-y-2 ps-5">
                  <li>
                    {lang === "ar"
                      ? "دوم تحقق من الدومين الحقيقي (مثلاً: microsoft.com)."
                      : lang === "ku"
                      ? "هەمیشە دۆمەینی ڕاست پشکنە (وەک: microsoft.com)."
                      : "Always verify the real domain (e.g., microsoft.com)."}
                  </li>
                  <li>
                    {lang === "ar"
                      ? "أي رسالة بيها استعجال/تهديد غالبًا مشبوهة."
                      : lang === "ku"
                      ? "نامەی پڕ لە فشار/هەڕەشە زۆرجار مشکوکە."
                      : "Urgency + threats are common phishing tactics."}
                  </li>
                  <li>
                    {lang === "ar"
                      ? "لا تسجل دخول من رابط داخل الرسالة — روح للموقع بنفسك."
                      : lang === "ku"
                      ? "لە ناو نامەوە چوونەژوورەوە مەکە — خۆت بڕۆ ماڵپەڕەکە."
                      : "Don’t log in from email links — go to the site yourself."}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}
