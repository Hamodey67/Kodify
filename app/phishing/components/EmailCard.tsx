"use client";

import React from "react";
import { Scenario, Lang } from "../data/scenarios";
import { cn } from "@/lib/utils";

export default function EmailCard({
  scenario,
  lang,
  reveal,
}: {
  scenario: Scenario;
  lang: Lang;
  reveal: boolean;
}) {
  const from = scenario.from[lang];
  const to = scenario.to[lang];
  const subject = scenario.subject[lang];
  const body = scenario.body[lang];

  // simple heuristic: show domain badge after reveal
  const domainMatch = from.match(/@([^>]+)>/);
  const domain = domainMatch?.[1] ?? "";

  const isSuspiciousDomain =
    domain && /(secure|verify|login|payroll|micros0ft|apple-secure|security)\./i.test(domain);

  return (
    <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='text-sm text-white/70'>
            <div className='font-medium text-white'>{from}</div>
            <div className='text-white/60'>{to}</div>
          </div>

          {reveal && domain && (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
                isSuspiciousDomain ? "bg-rose-500/15 text-rose-200" : "bg-emerald-500/15 text-emerald-200"
              )}
              title={domain}
            >
              {isSuspiciousDomain ? "⚠️" : "✅"} {domain}
            </span>
          )}
        </div>

        <div className='border-t border-white/10 pt-3'>
          <div className='text-base font-semibold text-white'>{subject}</div>
          <div className='mt-3 space-y-2 text-sm leading-6 text-white/80'>
            {body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className='mt-4'>
            <button
              type='button'
              className='rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 active:scale-[0.99]'
              onClick={() => {
                // no-op: demo button
              }}
            >
              {scenario.ctaText[lang]}
            </button>

            {reveal && (
              <div className='mt-2 text-xs text-white/50'>
                {scenario.ctaUrl}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
