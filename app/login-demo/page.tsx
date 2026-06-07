"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, RotateCcw, Search, Shield, ShieldAlert, X } from "lucide-react";
import Footer from "@/components/Footer";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import { getDemoScenarios, getLoginDemoCopy, DemoScenarioKind } from "./data/demo";
import LoginPageMock from "./components/LoginPageMock";
import WhatsAppScamMock from "./components/WhatsAppScamMock";
import ScorePanel from "./components/ScorePanel";
import CluesPanel from "./components/CluesPanel";
import { getActiveCluesForScenario } from "./utils";

type VerdictChoice = "none" | "safe" | "phishing";

export default function LoginDemoPage() {
  const { lang } = useApp();
  const l = lang as "ar" | "en" | "ku";
  const isRtl = l === "ar" || l === "ku";
  const copy = useMemo(() => getLoginDemoCopy(l), [l]);

  const [tab, setTab] = useState<DemoScenarioKind>("login");
  const scenarios = useMemo(() => getDemoScenarios(l, tab), [l, tab]);

  const [idx, setIdx] = useState(0);
  const scenario = scenarios[Math.min(idx, Math.max(0, scenarios.length - 1))];

  const [choice, setChoice] = useState<VerdictChoice>("none");
  const [inspect, setInspect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const activeClues = useMemo(
    () => (scenario ? getActiveCluesForScenario(scenario) : new Set<string>()),
    [scenario]
  );

  const correct = useMemo(() => {
    if (!scenario || choice === "none") return null;
    const userSaysPhishing = choice === "phishing";
    return userSaysPhishing === scenario.isPhishing;
  }, [choice, scenario]);

  const verdictFeedback = useMemo(() => {
    if (choice === "none" || correct == null || !scenario) return null;
    return {
      choice,
      correct,
      message: correct ? copy.result.correct : scenario.note ?? copy.result.wrong,
    };
  }, [choice, correct, scenario, copy.result]);

  const resetRound = () => {
    setChoice("none");
    setInspect(false);
    setShareStatus(null);
  };

  const submitChoice = (v: VerdictChoice) => {
    if (!scenario || v === "none") return;
    setChoice(v);
    setInspect(true);
    setShareStatus(null);
    const isCorrect = (v === "phishing") === scenario.isPhishing;
    setStreak((s) => (isCorrect ? s + 1 : 0));
    setCorrectCount((c) => (isCorrect ? c + 1 : c));
  };

  const nextScenario = () => {
    const n = scenarios.length || 1;
    setIdx((i) => (i + 1) % n);
    resetRound();
  };

  const changeTab = (k: DemoScenarioKind) => {
    setTab(k);
    setIdx(0);
    setStreak(0);
    setCorrectCount(0);
    resetRound();
  };

  const share = async () => {
    if (!scenario) return;
    const text = copy.shareText({
      score: correctCount,
      max: scenarios.length,
      streak,
      brand: scenario.brand,
      kind: tab,
    });
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus(copy.buttons.copied);
      window.setTimeout(() => setShareStatus(null), 1600);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setShareStatus(copy.buttons.copied);
        window.setTimeout(() => setShareStatus(null), 1600);
      } catch {
        setShareStatus(null);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip" dir={isRtl ? "rtl" : "ltr"}>
      <section className="mx-auto w-full min-w-0 max-w-6xl px-3 pb-16 pt-10 sm:px-6 md:pt-14">
        <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#071525]/95 shadow-[0_40px_100px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[1.75rem]">
          {/* Header */}
          <div className="border-b border-white/[0.06] px-4 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {copy.title}
                  </h1>
                  <span className="rounded-full border border-[var(--accent-bright)]/25 bg-[var(--accent-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-bright)]">
                    {copy.demoBadge}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                  {copy.desc}
                </p>
              </div>

              {scenario && (
                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                  <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/70">
                    {scenario.brand}
                  </span>
                  <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium tabular-nums text-white/45">
                    {idx + 1}/{scenarios.length}
                  </span>
                  <span className="rounded-lg border border-white/[0.06] bg-transparent px-3 py-1.5 text-[11px] font-medium text-white/35">
                    {tab === "login" ? copy.tabs.login : copy.tabs.whatsapp}
                  </span>
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

            <div className="mt-5 flex flex-wrap gap-2">
              {(["login", "whatsapp"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => changeTab(k)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    tab === k
                      ? "bg-[var(--accent-primary)]/15 text-[var(--accent-bright)] ring-1 ring-[var(--accent-bright)]/25"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white/70"
                  )}
                >
                  {k === "login" ? copy.tabs.login : copy.tabs.whatsapp}
                </button>
              ))}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid min-w-0 gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:p-8">
            {/* Challenge — first on mobile */}
            <div className="order-1 min-w-0 w-full lg:order-2 lg:col-start-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scenario?.id ?? "empty"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {scenario?.kind === "login" && scenario.form ? (
                    <LoginPageMock
                      url={scenario.shownUrl}
                      strings={scenario.form}
                      notSecureLabel={copy.notSecure}
                      secureLabel={copy.secure}
                      verdict={verdictFeedback}
                    />
                  ) : scenario?.kind === "whatsapp" && scenario.wa ? (
                    <WhatsAppScamMock
                      url={scenario.shownUrl}
                      wa={scenario.wa}
                      notSecureLabel={copy.notSecure}
                      secureLabel={copy.secure}
                      verdict={verdictFeedback}
                    />
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] p-8 text-white/45">
                      No scenarios
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Verdict controls */}
              <div className="mt-5 min-w-0 sm:mt-6">
                <p className="mb-3 text-sm font-medium leading-relaxed text-white/50 sm:mb-4">{copy.instruction}</p>

                <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => submitChoice("safe")}
                    disabled={choice !== "none"}
                    className={cn(
                      "group flex min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-bold transition-all duration-300 sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-5 sm:text-base",
                      choice === "safe"
                        ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
                        : "border-emerald-400/30 bg-emerald-500/[0.07] text-emerald-100 hover:border-emerald-400/50 hover:bg-emerald-500/12",
                      choice !== "none" && choice !== "safe" && "opacity-40"
                    )}
                  >
                    <Shield size={18} className="sm:hidden" aria-hidden />
                    <Shield size={20} className="hidden sm:block" aria-hidden />
                    {copy.buttons.safe}
                  </button>
                  <button
                    type="button"
                    onClick={() => submitChoice("phishing")}
                    disabled={choice !== "none"}
                    className={cn(
                      "group flex min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-bold transition-all duration-300 sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-5 sm:text-base",
                      choice === "phishing"
                        ? "border-amber-400/50 bg-amber-500/15 text-amber-100"
                        : "border-amber-400/30 bg-amber-500/[0.07] text-amber-100 hover:border-amber-400/50 hover:bg-amber-500/12",
                      choice !== "none" && choice !== "phishing" && "opacity-40"
                    )}
                  >
                    <ShieldAlert size={18} className="sm:hidden" aria-hidden />
                    <ShieldAlert size={20} className="hidden sm:block" aria-hidden />
                    {copy.buttons.phishing}
                  </button>
                </div>

                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3 sm:mt-4 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => setInspect(true)}
                    disabled={inspect}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-35"
                  >
                    <Search size={14} aria-hidden />
                    {copy.buttons.inspect}
                  </button>
                  <button
                    type="button"
                    onClick={resetRound}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white/70"
                  >
                    <RotateCcw size={14} aria-hidden />
                    {copy.buttons.reset}
                  </button>
                  <button
                    type="button"
                    onClick={nextScenario}
                    className="ms-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white/70"
                  >
                    {copy.buttons.next}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="order-2 flex min-w-0 flex-col gap-5 lg:order-1 lg:col-start-1 lg:row-start-1">
              <ScorePanel
                scoreLabel={copy.result.scoreLabel}
                score={correctCount}
                maxScore={scenarios.length}
                streakLabel={copy.result.streakLabel}
                streak={streak}
                roundLabel={copy.roundLabel}
                roundCurrent={idx + 1}
                roundTotal={scenarios.length}
                shareLabel={shareStatus ?? copy.buttons.share}
                onShare={share}
                shareDisabled={choice === "none"}
              />

              <CluesPanel
                title={copy.cluesTitle}
                clues={copy.clues}
                activeClues={activeClues}
                revealed={inspect}
                lockedMessage={copy.cluesLocked}
                presentLabel={copy.statusPresent}
                absentLabel={copy.statusAbsent}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
