"use client";

import React from "react";

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);

  return (
    <div className='w-full'>
      <div className='mb-2 flex items-center justify-between text-xs text-[var(--muted-2)] font-medium'>
        <span>{value} / {max}</span>
        <span>{pct}%</span>
      </div>
      <div className='h-2 w-full rounded-full bg-brand-soft border border-[var(--border)] overflow-hidden'>
        <div className='h-full rounded-full bg-[var(--accent-strong)] transition-all duration-300' style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
