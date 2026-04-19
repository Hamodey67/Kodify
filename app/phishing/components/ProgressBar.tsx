"use client";

import React from "react";

export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);

  return (
    <div className='w-full'>
      <div className='mb-2 flex items-center justify-between text-xs text-white/60'>
        <span>{value} / {max}</span>
        <span>{pct}%</span>
      </div>
      <div className='h-2 w-full rounded-full bg-white/10'>
        <div className='h-2 rounded-full bg-white/40' style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
