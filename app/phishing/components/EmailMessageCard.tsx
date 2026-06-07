"use client";

import React from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang, Scenario } from "../data/scenarios";
import type { PhishingCopy } from "../data/copy";
import {
  highlightDomain,
  highlightUrgency,
  isSuspiciousSender,
  parseSender,
} from "../utils";

type VerdictFeedback = {
  correct: boolean;
  message: string;
};

export default function EmailMessageCard({
  scenario,
  lang,
  copy,
  verdict,
}: {
  scenario: Scenario;
  lang: Lang;
  copy: PhishingCopy;
  verdict: VerdictFeedback | null;
}) {
  const sender = parseSender(scenario.from[lang]);
  const domainParts = highlightDomain(sender.domain, scenario.isPhishing);
  const showSpoof = isSuspiciousSender(sender.domain, scenario.isPhishing);
  const [ctaHover, setCtaHover] = React.useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-[#0c1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_48px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-500",
        verdict?.correct === true &&
          "border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.25),0_0_32px_rgba(52,211,153,0.12)]",
        verdict?.correct === false &&
          "border-amber-400/40 shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_0_32px_rgba(251,191,36,0.12)]",
        verdict == null && "border-white/[0.08]"
      )}
    >
      {verdict && (
        <div
          className={cn(
            "flex items-center gap-2 border-b px-4 py-2.5 text-sm font-semibold",
            verdict.correct
              ? "border-emerald-400/15 bg-emerald-500/10 text-emerald-200"
              : "border-amber-400/15 bg-amber-500/10 text-amber-100"
          )}
        >
          <span aria-hidden>{verdict.correct ? "✓" : "✗"}</span>
          <span>{verdict.message}</span>
        </div>
      )}

      {/* Email client chrome */}
      <div className="border-b border-white/[0.06] bg-[#091220] px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] font-medium text-white/40">
          <span className="rounded bg-white/[0.06] px-2 py-0.5">Inbox</span>
          <span>•</span>
          <span>Message</span>
        </div>
      </div>

      {/* Email body surface */}
      <div className="bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6">
        {/* Header block */}
        <div className="flex gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              showSpoof
                ? "bg-amber-500/15 text-amber-800 ring-2 ring-amber-400/30"
                : "bg-slate-200 text-slate-700"
            )}
            aria-hidden
          >
            {sender.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-bold text-slate-900">{sender.displayName}</span>
              {showSpoof && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                  <AlertTriangle size={10} aria-hidden />
                  {copy.unverifiedLabel}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-slate-500" dir="ltr">
              <span className="font-mono">{sender.email.split("@")[0]}@</span>
              <span className="font-mono">
                {domainParts.map((part, i) => (
                  <span
                    key={i}
                    className={cn(
                      part.suspicious &&
                        "rounded-sm bg-amber-400/25 px-0.5 text-amber-900 underline decoration-amber-500/50 decoration-dotted underline-offset-2"
                    )}
                  >
                    {part.text}
                  </span>
                ))}
              </span>
            </p>

            <p className="mt-1.5 text-xs text-slate-400">{scenario.to[lang]}</p>
          </div>
        </div>

        {/* Subject */}
        <h2 className="mt-5 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {highlightUrgency(scenario.subject[lang])}
        </h2>

        {/* Body */}
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
          {scenario.body[lang].map((line, i) => (
            <p key={i}>{highlightUrgency(line)}</p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <div className="relative inline-block">
            <button
              type="button"
              disabled
              tabIndex={-1}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              className={cn(
                "group relative rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                scenario.isPhishing
                  ? "border border-amber-400/50 bg-amber-500/10 text-amber-900 hover:underline hover:decoration-amber-500 hover:underline-offset-4"
                  : "border border-slate-300 bg-white text-slate-800 shadow-sm"
              )}
            >
              {scenario.ctaText[lang]}
              {scenario.isPhishing && (
                <ExternalLink
                  size={13}
                  className="ms-2 inline-block opacity-60"
                  aria-hidden
                />
              )}
            </button>
            {ctaHover && scenario.isPhishing && (
              <div
                className="absolute bottom-full z-10 mb-2 max-w-xs rounded-lg border border-amber-400/30 bg-slate-900 px-3 py-2 text-[11px] font-medium text-amber-100 shadow-lg"
                dir="ltr"
              >
                {copy.ctaTooltip(scenario.ctaUrl)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
