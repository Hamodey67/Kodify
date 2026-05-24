"use client";

import React, { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import { useApp } from "@/app/providers";
import { getDemoScenarios, getLoginDemoCopy, DemoScenarioKind } from "./data/demo";
import LoginPageMock from "./components/LoginPageMock";
import WhatsAppScamMock from "./components/WhatsAppScamMock";
import Verdict from "./components/Verdict";
import CluesPanel from "./components/CluesPanel";

type VerdictChoice = "none" | "safe" | "phishing";

export default function LoginDemoPage() {
  const { lang } = useApp();
  const l = (lang as "ar" | "en" | "ku");
  const copy = useMemo(() => getLoginDemoCopy(l), [l]);

  const [tab, setTab] = useState<DemoScenarioKind>("login");
  const scenarios = useMemo(() => getDemoScenarios(l, tab), [l, tab]);

  const [idx, setIdx] = useState(0);
  const scenario = scenarios[Math.min(idx, Math.max(0, scenarios.length - 1))];

  const [choice, setChoice] = useState<VerdictChoice>("none");
  const [inspect, setInspect] = useState(false);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);

  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const maxScore = copy.clues.length;
  const score = found.size;

  const correct = useMemo(() => {
    if (!scenario) return null;
    if (choice === "none") return null;
    const userSaysPhishing = choice === "phishing";
    return userSaysPhishing === scenario.isPhishing;
  }, [choice, scenario]);

  const onHotspot = (id: string) => {
    if (!inspect) return;
    setFound((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetRound = () => {
    setChoice("none");
    setInspect(false);
    setFound(new Set());
    setShareStatus(null);
  };

  const submitChoice = (v: VerdictChoice) => {
    if (!scenario) return;
    setChoice(v);
    setInspect(true);
    setFound(new Set()); // start clue hunt fresh
    setShareStatus(null);
    setStreak((s) => {
      const isCorrect = (v === "phishing") === scenario.isPhishing;
      return isCorrect ? s + 1 : 0;
    });
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
    resetRound();
  };

  const share = async () => {
    if (!scenario) return;
    const text = copy.shareText({ score, max: maxScore, streak, brand: scenario.brand, kind: tab });
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus(copy.buttons.copied);
      window.setTimeout(() => setShareStatus(null), 1600);
    } catch {
      // Fallback for older browsers
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
    <div className="min-h-screen">
      <Section title={copy.title} desc={copy.desc} className="pt-10">
        <div className="mb-4 rounded-2xl border border-[var(--border)] bg-brand-soft p-4 text-sm text-[var(--muted)]">
          <div className="font-semibold text-[var(--fg)]">{copy.hint}</div>
          <div className="mt-1">{copy.instruction}</div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => changeTab("login")}
            className={
              tab === "login"
                ? "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-sm"
                : "rounded-2xl border border-[var(--border)] bg-brand-soft px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
            }
          >
            {copy.tabs.login}
          </button>
          <button
            type="button"
            onClick={() => changeTab("whatsapp")}
            className={
              tab === "whatsapp"
                ? "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-sm"
                : "rounded-2xl border border-[var(--border)] bg-brand-soft px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
            }
          >
            {copy.tabs.whatsapp}
          </button>

          <div className="ml-auto text-sm text-white/60">
            {scenario ? (
              <span>
                {scenario.brand} <span className="text-white/30">•</span> {idx + 1}/{scenarios.length}
              </span>
            ) : (
              "—"
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {scenario?.kind === "login" && scenario.form ? (
              <LoginPageMock
                urlLabel={copy.urlLabel}
                url={scenario.shownUrl}
                badge={scenario.isPhishing ? copy.fakeTag : copy.legitTag}
                badgeTone={scenario.isPhishing ? "danger" : "ok"}
                onHotspot={onHotspot}
                found={found}
                strings={scenario.form}
                hotspotLabels={copy.hotspots}
              />
            ) : scenario?.kind === "whatsapp" && scenario.wa ? (
              <WhatsAppScamMock
                urlLabel={copy.urlLabel}
                url={scenario.shownUrl}
                badge={scenario.isPhishing ? copy.fakeTag : copy.legitTag}
                badgeTone={scenario.isPhishing ? "danger" : "ok"}
                onHotspot={onHotspot}
                found={found}
                hotspotLabels={copy.hotspots}
                wa={scenario.wa}
              />
            ) : (
              <div className="rounded-3xl border border-[var(--border)] bg-brand-soft p-6 text-[var(--muted)]">No scenarios</div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => submitChoice("safe")}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm"
              >
                {copy.buttons.safe}
              </button>
              <button
                type="button"
                onClick={() => submitChoice("phishing")}
                className="rounded-2xl border border-rose-500/20 dark:border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-700 dark:text-rose-200 hover:bg-rose-500/15"
              >
                {copy.buttons.phishing}
              </button>

              <button
                type="button"
                onClick={() => setInspect(true)}
                className="ml-auto rounded-2xl border border-[var(--border)] bg-brand-soft px-5 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)]"
              >
                {copy.buttons.inspect}
              </button>
              <button
                type="button"
                onClick={resetRound}
                className="rounded-2xl border border-[var(--border)] bg-brand-soft px-5 py-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              >
                {copy.buttons.reset}
              </button>
              <button
                type="button"
                onClick={nextScenario}
                className="rounded-2xl border border-[var(--border)] bg-brand-soft px-5 py-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              >
                {copy.buttons.next}
              </button>
            </div>

            {scenario?.note ? (
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-brand-soft p-4 text-sm text-[var(--muted)]">
                {scenario.note}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6">
            <Verdict
              verdict={choice}
              correct={correct}
              labelCorrect={copy.result.correct}
              labelWrong={copy.result.wrong}
              scoreLabel={copy.result.scoreLabel}
              score={score}
              maxScore={maxScore}
              streakLabel={copy.result.streakLabel}
              streak={streak}
              shareLabel={shareStatus ?? copy.buttons.share}
              onShare={share}
              shareDisabled={choice === "none"}
            />

            <CluesPanel
              title={copy.cluesTitle}
              clues={copy.clues}
              found={found}
              foundLabel={copy.statusFound}
              hiddenLabel={copy.statusHidden}
            />
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
