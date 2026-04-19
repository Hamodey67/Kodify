"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { DemoClue } from "../data/demo";

export default function CluesPanel({
  title,
  clues,
  found,
  foundLabel,
  hiddenLabel,
}: {
  title: string;
  clues: DemoClue[];
  found: Set<string>;
  foundLabel: string;
  hiddenLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="mt-4 grid gap-3">
        {clues.map((c) => {
          const active = found.has(c.id);
          return (
            <div
              key={c.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                active
                  ? "border-emerald-400/30 bg-emerald-500/10"
                  : "border-white/10 bg-black/20"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-white">{c.title}</div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs",
                    active ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/60"
                  )}
                >
                  {active ? foundLabel : hiddenLabel}
                </span>
              </div>
              <div className="mt-2 text-sm text-white/70">{c.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}