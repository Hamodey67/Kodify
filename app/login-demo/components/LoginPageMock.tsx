"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function LoginPageMock({
  urlLabel,
  url,
  badge,
  badgeTone,
  onHotspot,
  found,
  strings,
  hotspotLabels,
}: {
  urlLabel: string;
  url: string;
  badge: string;
  badgeTone: "danger" | "ok";
  onHotspot: (id: string) => void;
  found: Set<string>;
  strings: {
    heading: string;
    email: string;
    password: string;
    forgot: string;
    signIn: string;
    footer: string;
  };
  hotspotLabels: {
    domain: string;
    http: string;
    branding: string;
    cta: string;
    pressure: string;
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

      {/* Mock login */}
      <div className="mt-5 rounded-2xl border border-[var(--border)] bg-brand-soft p-4 md:p-6">
        <div className="text-lg font-semibold text-[var(--fg)]">{strings.heading}</div>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-[var(--muted-2)]">{strings.email}</span>
            <input
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted-2)] focus:outline-none focus:ring-2 focus:ring-[var(--border-strong)]"
              placeholder={strings.email}
              disabled
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[var(--muted-2)]">{strings.password}</span>
            <input
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted-2)] focus:outline-none focus:ring-2 focus:ring-[var(--border-strong)]"
              placeholder={strings.password}
              disabled
              type="password"
            />
          </label>

          <div className="flex items-center justify-between">
            <button type="button" className="text-xs text-[var(--muted-2)] hover:text-[var(--fg)]" disabled>
              {strings.forgot}
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm"
              disabled
            >
              {strings.signIn}
            </button>
          </div>
        </div>

        <div className="mt-6 text-xs text-[var(--muted-2)]">{strings.footer}</div>
      </div>
    </div>
  );
}
