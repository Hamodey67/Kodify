"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Lock, LockOpen, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseUrlDisplay } from "../utils";

type VerdictState = {
  choice: "safe" | "phishing";
  correct: boolean;
  message?: string;
};

export default function BrowserChrome({
  url,
  verdict,
  children,
  notSecureLabel,
  secureLabel,
}: {
  url: string;
  verdict?: VerdictState | null;
  children: React.ReactNode;
  notSecureLabel: string;
  secureLabel: string;
}) {
  const { isSecure, protocol, hostParts, path } = parseUrlDisplay(url);

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-hidden rounded-2xl border bg-[#0c1829] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_48px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-500",
        verdict?.correct === true &&
          "border-emerald-400/40 shadow-[0_0_0_1px_rgba(52,211,153,0.25),0_0_32px_rgba(52,211,153,0.12)]",
        verdict?.correct === false &&
          "border-amber-400/40 shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_0_32px_rgba(251,191,36,0.12)]",
        verdict == null && "border-white/[0.08]"
      )}
    >
      {/* Browser toolbar */}
      <div className="flex min-w-0 items-start gap-2 border-b border-white/[0.06] bg-[#091220] px-2.5 py-2 sm:items-center sm:gap-3 sm:px-4 sm:py-2.5">
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5 sm:pt-0" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
        </div>

        <div className="hidden items-center gap-0.5 sm:flex" aria-hidden>
          <span className="rounded-md p-1 text-white/25">
            <ChevronLeft size={14} />
          </span>
          <span className="rounded-md p-1 text-white/25">
            <ChevronRight size={14} />
          </span>
          <span className="rounded-md p-1 text-white/25">
            <RotateCw size={12} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-1.5 rounded-lg border border-white/[0.08] bg-[#0f1c30] px-2 py-1.5 sm:items-center sm:gap-2 sm:px-3">
            {isSecure ? (
              <Lock size={12} className="mt-0.5 shrink-0 text-emerald-400/90 sm:mt-0 sm:size-[13px]" aria-hidden />
            ) : (
              <LockOpen size={12} className="mt-0.5 shrink-0 text-amber-400/90 sm:mt-0 sm:size-[13px]" aria-hidden />
            )}
            <div
              className="min-w-0 flex-1 break-all font-mono text-[9px] leading-snug text-white/85 sm:text-xs sm:leading-normal"
              dir="ltr"
            >
              <span className="text-white/45">{protocol}</span>
              {hostParts.map((part, i) => (
                <span
                  key={i}
                  className={cn(
                    part.suspicious &&
                      "rounded-sm bg-amber-400/20 px-0.5 text-amber-200 underline decoration-amber-400/50 decoration-dotted underline-offset-2"
                  )}
                >
                  {part.text}
                </span>
              ))}
              {path && <span className="text-white/55">{path}</span>}
            </div>
          </div>
          <div
            className={cn(
              "mt-1 px-0.5 text-[9px] font-medium tracking-wide sm:text-[10px]",
              isSecure ? "text-emerald-400/80" : "text-amber-400/90"
            )}
            dir="ltr"
          >
            {isSecure ? secureLabel : notSecureLabel}
          </div>
        </div>
      </div>

      {verdict && (
        <div
          className={cn(
            "flex items-start gap-2 border-b px-4 py-2.5 text-sm font-semibold",
            verdict.correct
              ? "border-emerald-400/15 bg-emerald-500/10 text-emerald-200"
              : "border-amber-400/15 bg-amber-500/10 text-amber-100"
          )}
        >
          <span className="mt-0.5 shrink-0" aria-hidden>{verdict.correct ? "✓" : "✗"}</span>
          <span className="min-w-0 break-words">{verdict.message}</span>
        </div>
      )}

      {/* Page surface */}
      <div className="min-w-0 overflow-x-hidden bg-[#f4f6f8] text-slate-900">{children}</div>
    </div>
  );
}
