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
    <div className='theme-surface rounded-2xl p-5 shadow-sm'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='text-sm text-[var(--muted)]'>
            <div className='font-medium text-[var(--fg)]'>{from}</div>
            <div className='text-[var(--muted-2)]'>{to}</div>
          </div>

          {reveal && domain && (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                isSuspiciousDomain ? "bg-rose-500/15 text-rose-700 dark:text-rose-200" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
              )}
              title={domain}
            >
              {isSuspiciousDomain ? "⚠️" : "✅"} {domain}
            </span>
          )}
        </div>

        <div className='border-t border-[var(--border)] pt-3'>
          <div className='text-base font-semibold text-[var(--fg)]'>{subject}</div>
          <div className='mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]'>
            {body.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className='mt-4'>
            <button
              type='button'
              className='rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--surface-muted)] shadow-sm active:scale-[0.99]'
              onClick={() => {
                // no-op: demo button
              }}
            >
              {scenario.ctaText[lang]}
            </button>

            {reveal && (
              <div className='mt-2 text-xs text-[var(--muted-2)]'>
                {scenario.ctaUrl}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
