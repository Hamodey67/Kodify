"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function WhatsAppScamMock({
  urlLabel,
  url,
  badge,
  badgeTone,
  onHotspot,
  found,
  hotspotLabels,
  wa,
}: {
  urlLabel: string;
  url: string;
  badge: string;
  badgeTone: "danger" | "ok";
  onHotspot: (id: string) => void;
  found: Set<string>;
  hotspotLabels: {
    domain: string;
    http: string;
    branding: string;
    cta: string;
    pressure: string;
  };
  wa: {
    header: string;
    fromName: string;
    fromMeta: string;
    message: string;
    cta: string;
  };
}) {
  const spot = (id: "domain" | "http" | "branding" | "cta" | "pressure", label: string) => {
    const active = found.has(id);
    return (
      <button
        type="button"
        onClick={() => onHotspot(id)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition",
          active
            ? "border-emerald-500/30 dark:border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : "chip-theme hover:opacity-80"
        )}
        aria-pressed={active}
      >
        <span className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-500 dark:bg-emerald-400" : "chip-theme-dot")} />
        {label}
      </button>
    );
  };

  return (
    <div className="theme-surface rounded-3xl p-4 md:p-6">
      {/* URL bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-[var(--muted)]">
          <span className="text-[var(--muted-2)]">{urlLabel}:</span>{" "}
          <span className="font-mono text-[var(--fg)]">{url}</span>
        </div>
        <span
          className={cn(
            "w-fit rounded-full px-3 py-1 text-xs font-medium",
            badgeTone === "danger" ? "bg-rose-500/15 text-rose-700 dark:text-rose-200" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
          )}
        >
          {badge}
        </span>
      </div>

      {/* Hotspots */}
      <div className="mt-4 flex flex-wrap gap-2">
        {spot("domain", hotspotLabels.domain)}
        {spot("http", hotspotLabels.http)}
        {spot("branding", hotspotLabels.branding)}
        {spot("cta", hotspotLabels.cta)}
        {spot("pressure", hotspotLabels.pressure)}
      </div>

      {/* Mock WhatsApp */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-brand-soft">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--fg)]">{wa.header}</div>
          <div className="text-xs text-[var(--muted-2)]">{wa.fromMeta}</div>
        </div>

        <div className="p-4">
          <div className="text-xs text-[var(--muted-2)]">{wa.fromName}</div>

          <div className="mt-2 max-w-[520px] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm text-[var(--fg)]">
            <div className="whitespace-pre-line">{wa.message}</div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => onHotspot("cta")}
                className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200 hover:bg-emerald-500/15"
              >
                {wa.cta}
              </button>
            </div>

            <div className="mt-3 text-xs text-[var(--muted-2)]">
              <span className="text-[var(--muted-2)] opacity-70">{urlLabel}:</span> <span className="font-mono">{url}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
