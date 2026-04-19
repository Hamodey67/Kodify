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

      // حركة خفيفة جدًا (parallax)
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
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

      <div
        className="absolute -inset-[20%] opacity-70"
        style={{
          transform:
            "translate(calc(var(--mx) * -18px), calc(var(--my) * -14px))",
          background:
            "radial-gradient(700px 520px at 25% 20%, rgba(56,189,248,0.18), transparent 60%)," +
            "radial-gradient(780px 560px at 75% 35%, rgba(56,189,248,0.14), transparent 60%)," +
            "radial-gradient(900px 700px at 50% 80%, rgba(99,102,241,0.10), transparent 65%)",
        }}
      />

      <div
        className="absolute -inset-[30%] opacity-35 blur-2xl"
        style={{
          transform:
            "translate(calc(var(--mx) * 26px), calc(var(--my) * 18px)) rotate(-6deg)",
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(34,211,238,0.14), rgba(56,189,248,0.10), rgba(99,102,241,0.10), rgba(34,211,238,0.14))",
          maskImage:
            "radial-gradient(closest-side at 50% 50%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(closest-side at 50% 50%, black 0%, transparent 72%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), " +
            "linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          transform:
            "translate(calc(var(--mx) * 10px), calc(var(--my) * 8px))",
        }}
      />

      {/* Grain / noise (Premium) */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 35%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}
