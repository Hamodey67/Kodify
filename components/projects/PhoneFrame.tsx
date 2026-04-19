"use client";

import { cn } from "@/lib/utils";

export default function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-[320px] sm:w-[360px]", className)}>
      <div className="relative">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -inset-8 rounded-[70px] bg-cyan-500/10 blur-3xl" />

        {/* Metal body */}
        <div className="relative rounded-[54px] p-[10px] bg-gradient-to-b from-[#1a2233] via-[#0b0f18] to-[#05070c] shadow-[0_45px_140px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
          {/* Metal edge highlight */}
          <div className="pointer-events-none absolute inset-[6px] rounded-[48px] ring-1 ring-white/8" />

          {/* Side buttons (decorative) */}
          <div className="pointer-events-none absolute left-[-3px] top-[120px] h-12 w-[5px] rounded-full bg-white/12 shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
          <div className="pointer-events-none absolute left-[-3px] top-[178px] h-16 w-[5px] rounded-full bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
          <div className="pointer-events-none absolute right-[-3px] top-[150px] h-20 w-[5px] rounded-full bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.6)]" />

          {/* Screen bezel */}
          <div className="relative overflow-hidden rounded-[46px] bg-black ring-1 ring-white/10">
            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-28 h-96 w-96 rotate-12 rounded-full bg-white/6 blur-3xl" />
              <div className="absolute -right-24 top-24 h-80 w-80 -rotate-12 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/6 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_55%)]" />
            </div>

            {/* Notch / island */}
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2">
              <div className="relative h-8 w-40 rounded-full bg-black/85 ring-1 ring-white/10">
                {/* tiny camera dot */}
                <div className="absolute right-6 top-2 h-2 w-2 rounded-full bg-cyan-300/35 blur-[0.5px]" />
                {/* speaker hint */}
                <div className="absolute left-10 top-[13px] h-[2px] w-10 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Screen (✅ نفس القياس السابق حتى ما يأثر على الترتيب) */}
            <div className="relative pt-12">
              <div className="h-[640px] bg-[#0b1220]">{children}</div>
            </div>

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 h-1.5 w-32 -translate-x-1/2 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
