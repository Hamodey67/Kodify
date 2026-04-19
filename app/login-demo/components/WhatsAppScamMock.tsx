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
            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
        )}
        aria-pressed={active}
      >
        <span className={cn("h-2 w-2 rounded-full", active ? "bg-emerald-400" : "bg-white/30")} />
        {label}
      </button>
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
      {/* URL bar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-white/70">
          <span className="text-white/60">{urlLabel}:</span>{" "}
          <span className="font-mono text-white/90">{url}</span>
        </div>
        <span
          className={cn(
            "w-fit rounded-full px-3 py-1 text-xs",
            badgeTone === "danger" ? "bg-rose-500/15 text-rose-200" : "bg-emerald-500/15 text-emerald-200"
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
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3">
          <div className="text-sm font-semibold text-white">{wa.header}</div>
          <div className="text-xs text-white/50">{wa.fromMeta}</div>
        </div>

        <div className="p-4">
          <div className="text-xs text-white/50">{wa.fromName}</div>

          <div className="mt-2 max-w-[520px] rounded-2xl bg-white/10 p-4 text-sm text-white/90">
            <div className="whitespace-pre-line">{wa.message}</div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => onHotspot("cta")}
                className="w-full rounded-xl border border-white/10 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/15"
              >
                {wa.cta}
              </button>
            </div>

            <div className="mt-3 text-xs text-white/50">
              <span className="text-white/40">{urlLabel}:</span> <span className="font-mono">{url}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
