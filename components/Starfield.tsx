"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Star = { x: number; y: number; z: number; s: number };

export default function Starfield({ count = 220 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
        s: 0.6 + Math.random() * 1.6,
      });
    }
    return arr;
  }, [count]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      c.width = Math.floor(window.innerWidth * dpr);
      c.height = Math.floor(window.innerHeight * dpr);
      c.style.width = "100%";
      c.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // gentle vignette
      const g = ctx.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.55,
        0,
        window.innerWidth * 0.5,
        window.innerHeight * 0.55,
        Math.max(window.innerWidth, window.innerHeight) * 0.65
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // stars
      for (const st of stars) {
        st.z -= 0.006; // speed
        if (st.z <= 0) {
          st.z = 1;
          st.x = Math.random() * 2 - 1;
          st.y = Math.random() * 2 - 1;
        }

        const cx = window.innerWidth * 0.5;
        const cy = window.innerHeight * 0.5;

        const depth = 0.18 + st.z * 1.15;
        const x = cx + st.x * cx / depth;
        const y = cy + st.y * cy / depth;

        const alpha = Math.max(0, 1 - st.z) * 0.85;
        const r = st.s * (1.3 - st.z) * 0.9;

        // cyan/white mix
        ctx.fillStyle = `rgba(210,245,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-55">
      <canvas ref={canvasRef} />
    </div>
  );
}
