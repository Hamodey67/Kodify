"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMindLike() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isCoarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return; 

    let raf = 0;
    let tx = 0,
      ty = 0;
    let x = 0,
      y = 0;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tx = (e.clientX - cx) / cx; // -1..1
      ty = (e.clientY - cy) / cy; // -1..1
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;

      // الحركة خفيفة جدًا (parallax)
      el.style.setProperty("--mx", String(x));
      el.style.setProperty("--my", String(y));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        // @ts-ignore
        "--mx": 0,
        "--my": 0,
      }}
    >
      {/* Root background color transparent so Aurora shows through */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Cyber-glow header beam (shines from the top center) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-sky-400/25 to-transparent" 
      />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[120px] opacity-40 pointer-events-none" 
        style={{
          background: "radial-gradient(50% 120px at 50% 0%, rgba(125, 211, 252, 0.18), transparent)",
        }}
      />



      {/* High-Tech Premium Dotted Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          transform:
            "translate(calc(var(--mx) * 12px), calc(var(--my) * 10px))",
        }}
      />

      {/* Vignette Edges (Focuses center content) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 35%, transparent 35%, rgba(2, 4, 10, 0.8) 100%)",
        }}
      />
    </div>
  );
}
