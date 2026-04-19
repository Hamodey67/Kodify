"use client";

import { useEffect, useRef } from "react";

export default function BackgroundFX() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      el.style.setProperty("--mx", String(x));
      el.style.setProperty("--my", String(y));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* طبقة نجوم بسيطة */}
      <div className="bg-stars absolute inset-0 opacity-70" />

      {/* ضباب/أوربس تتحرك لوحدها */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      {/* بارالاكس خفيف مع الماوس */}
      <div className="parallax-sheen" />
    </div>
  );
}
