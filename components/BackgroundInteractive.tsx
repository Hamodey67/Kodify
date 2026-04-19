"use client";

import { useEffect, useRef } from "react";

export default function BackgroundInteractive() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0,
      h = 0,
      dpr = 1;

    const pointer = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      active: false,
    };

    const COUNT = 70; // كثافة الخطوط
    const lines = Array.from({ length: COUNT }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0009,
      vy: (Math.random() - 0.5) * 0.0009,
      len: 0.035 + Math.random() * 0.08, // طول الخط كنسبة من العرض/الارتفاع
      w: 0.9 + Math.random() * 0.8, // سماكة خفيفة
      a: 0.18 + Math.random() * 0.22, // شفافية
    }));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMove(e: PointerEvent) {
      pointer.active = true;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    }
    function onLeave() {
      pointer.active = false;
    }

    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    resize();
    window.addEventListener("resize", resize);
    if (!isCoarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }

    // Initial pointer center
    pointer.x = w * 0.5;
    pointer.y = h * 0.45;
    pointer.tx = pointer.x;
    pointer.ty = pointer.y;

    function draw() {
      // smooth follow
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // draw lines
      for (const l of lines) {
        // drift
        l.x += l.vx;
        l.y += l.vy;

        // wrap
        if (l.x < -0.1) l.x = 1.1;
        if (l.x > 1.1) l.x = -0.1;
        if (l.y < -0.1) l.y = 1.1;
        if (l.y > 1.1) l.y = -0.1;

        const px = l.x * w;
        const py = l.y * h;

        // mouse force
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const influence = Math.max(0, 1 - dist / 260); // نطاق التأثير
        const push = influence * (pointer.active ? 0.015 : 0.008);

        // push away a bit (gives "floating" feel)
        l.vx += (dx / dist) * push * 0.0008;
        l.vy += (dy / dist) * push * 0.0008;

        // damp velocity
        l.vx *= 0.985;
        l.vy *= 0.985;

        // line angle (use velocity)
        const ang = Math.atan2(l.vy, l.vx);
        const L = l.len * Math.min(w, h);

        const x2 = px + Math.cos(ang) * L;
        const y2 = py + Math.sin(ang) * L;

        // gradient stroke (cyan/emerald) very subtle
        const g = ctx.createLinearGradient(px, py, x2, y2);
        g.addColorStop(0, `rgba(34,211,238,${l.a})`); // cyan-400
        g.addColorStop(1, `rgba(16,185,129,${l.a * 0.9})`); // emerald-500

        ctx.strokeStyle = g;
        ctx.lineWidth = l.w;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // tiny glow dot near mouse (subtle)
        if (influence > 0.25) {
          ctx.fillStyle = `rgba(34,211,238,${0.08 * influence})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
