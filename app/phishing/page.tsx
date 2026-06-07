"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fish, Info, RotateCcw, Shield, ShieldAlert, X } from "lucide-react";
import Footer from "@/components/Footer";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import ScorePanel from "@/app/login-demo/components/ScorePanel";
import { getScenarios } from "./data/scenarios";
import { getPhishingCopy } from "./data/copy";
import EmailMessageCard from "./components/EmailMessageCard";
import TipsPanel from "./components/TipsPanel";
import RedFlagsPanel from "./components/RedFlagsPanel";
import { buildRedFlags } from "./utils";

type Pick = "none" | "safe" | "phish";

export default function PhishingPage() {
  const { lang } = useApp();
  const l = lang as "ar" | "en" | "ku";
  const isRtl = l === "ar" || l === "ku";
  const copy = useMemo(() => getPhishingCopy(l), [l]);

  const scenarios = useMemo(() => getScenarios(), []);
  const total = scenarios.length;

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Pick>("none");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const scenario = scenarios[idx];
  const redFlags = useMemo(
    () => (scenario ? buildRedFlags(scenario, l) : []),
    [scenario, l]
  );

  const correct = useMemo(() => {
    if (!scenario || picked === "none") return null;
    return (picked === "phish") === scenario.isPhishing;
  }, [picked, scenario]);

  const verdictFeedback = useMemo(() => {
    if (picked === "none" || correct == null) return null;
    return {
      correct,
      message: correct ? copy.resultCorrect : copy.resultWrong,
    };
  }, [picked, correct, copy.resultCorrect, copy.resultWrong]);

  const progressValue = done ? total : idx + (picked !== "none" ? 1 : 0);
  const progressPct = total ? Math.round((progressValue / total) * 100) : 0;

  const rank = useMemo(() => {
    const pct = total ? score / total : 0;
    if (pct >= 0.85) return copy.rankPro;
    if (pct >= 0.6) return copy.rankHunter;
    return copy.rankRookie;
  }, [score, total, copy]);

  function pick(v: "safe" | "phish") {
    if (picked !== "none" || !scenario) return;
    setPicked(v);
    setShareStatus(null);
    const isCorrect = (v === "phish") === scenario.isPhishing;
    if (isCorrect) {
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
    if (picked === "none") return;
    if (idx === total - 1) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked("none");
    setShareStatus(null);
  }

  function restart() {
    setIdx(0);
    setPicked("none");
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setDone(false);
    setShareStatus(null);
  }

  const share = async () => {
    const text = copy.shareText({ score, total, streak: bestStreak });
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus(copy.copiedLabel);
      window.setTimeout(() => setShareStatus(null), 1600);
    } catch {
      setShareStatus(null);
    }
  };

  return (
    <div className="relative min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Subtle cyber texture — very faint, behind solid layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,255,218,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#001220]/60" aria-hidden />

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#071525]/95 shadow-[0_40px_100px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]">
          {/* Header */}
          <div className="border-b border-white/[0.06] px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Fish size={22} className="text-[var(--accent-bright)]" aria-hidden />
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {copy.title}
                  </h1>
                  <span className="rounded-full border border-[var(--accent-bright)]/25 bg-[var(--accent-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-bright)]">
                    {copy.trainingBadge}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                  {copy.desc}
                </p>
              </div>

              {!done && (
                <div className="w-full shrink-0 lg:max-w-xs">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-white/45">
                    <span className="tabular-nums">
                      {score} / {total}
                    </span>
                    <span>
                      {copy.progressLabel}: {progressPct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-bright)] transition-[width] duration-500 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {bannerOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--accent-bright)]/15 bg-[var(--accent-primary)]/[0.06] px-4 py-3">
                    <Info size={16} className="mt-0.5 shrink-0 text-[var(--accent-bright)]" aria-hidden />
                    <p className="flex-1 text-sm text-white/70">{copy.hint}</p>
                    <button
                      type="button"
                      onClick={() => setBannerOpen(false)}
                      className="shrink-0 rounded-md p-1 text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
                      aria-label={copy.bannerDismiss}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main grid */}
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:p-8">
            {/* Challenge — first on mobile */}
            <div className="order-1 lg:order-2 lg:col-start-2">
              {!done ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scenario?.id ?? "empty"}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {scenario && (
                        <EmailMessageCard
                          scenario={scenario}
                          lang={l}
                          copy={copy}
                          verdict={verdictFeedback}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      disabled={picked !== "none"}
                      onClick={() => pick("safe")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 rounded-2xl border-2 px-4 py-4 text-base font-bold transition-all duration-300 sm:py-5",
                        picked === "safe"
                          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
                          : "border-emerald-400/30 bg-emerald-500/[0.07] text-emerald-100 hover:border-emerald-400/50 hover:bg-emerald-500/12",
                        picked !== "none" && picked !== "safe" && "opacity-40"
                      )}
                    >
                      <Shield size={20} aria-hidden />
                      {copy.safeLabel}
                    </button>
                    <button
                      type="button"
                      disabled={picked !== "none"}
                      onClick={() => pick("phish")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 rounded-2xl border-2 px-4 py-4 text-base font-bold transition-all duration-300 sm:py-5",
                        picked === "phish"
                          ? "border-amber-400/50 bg-amber-500/15 text-amber-100"
                          : "border-amber-400/30 bg-amber-500/[0.07] text-amber-100 hover:border-amber-400/50 hover:bg-amber-500/12",
                        picked !== "none" && picked !== "phish" && "opacity-40"
                      )}
                    >
                      <ShieldAlert size={20} aria-hidden />
                      {copy.phishLabel}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white/70"
                    >
                      <RotateCcw size={14} aria-hidden />
                      {copy.restartLabel}
                    </button>
                    {picked !== "none" && (
                      <button
                        type="button"
                        onClick={next}
                        className="ms-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--accent-bright)] transition hover:bg-[var(--accent-primary)]/10"
                      >
                        {idx === total - 1 ? copy.lastLabel : copy.nextLabel}
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-center text-[11px] text-white/35">{copy.footerNote}</p>
                </>
              ) : (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0d1a2d]/80 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="text-2xl font-black text-white">{copy.doneTitle}</div>
                  <p className="mt-2 text-sm text-white/55">{copy.doneScore(score, total)}</p>
                  <p className="mt-1 text-sm text-white/45">{copy.doneBestStreak(bestStreak)}</p>
                  <div className="mt-5 inline-flex rounded-full border border-[var(--accent-bright)]/25 bg-[var(--accent-primary)]/10 px-4 py-2 text-sm font-bold text-[var(--accent-bright)]">
                    {rank}
                  </div>
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-8 w-full rounded-xl border border-white/[0.12] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-[var(--accent-bright)]/40 hover:bg-white/[0.03]"
                  >
                    {copy.restartLabel}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="order-2 flex flex-col gap-5 lg:order-1 lg:col-start-1">
              <ScorePanel
                scoreLabel={copy.scoreLabel}
                score={score}
                maxScore={total}
                streakLabel={copy.streakLabel}
                streak={streak}
                roundLabel={copy.roundLabel}
                roundCurrent={done ? total : idx + 1}
                roundTotal={total}
                shareLabel={shareStatus ?? copy.shareLabel}
                onShare={share}
                shareDisabled={score === 0 && !done}
              />

              <TipsPanel title={copy.tipsTitle} tips={copy.tips} />

              {!done && scenario && (
                <RedFlagsPanel
                  title={copy.whyTitle}
                  flags={redFlags}
                  revealed={picked !== "none"}
                  lockedMessage={copy.whyLocked}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
