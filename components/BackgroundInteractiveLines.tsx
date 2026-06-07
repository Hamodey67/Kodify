"use client";

import { useEffect, useRef } from "react";

export default function BackgroundInteractiveLines() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0,
      h = 0,
      dpr = 1;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const COUNT = 80; // عدد الخطوط
    const PUSH_RADIUS = 280; // مدى تأثير الماوس
    const PUSH_POWER = 0.018; // قوة الدفع

    const lines = Array.from({ length: COUNT }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      len: 0.03 + Math.random() * 0.09,
      w: 0.8 + Math.random() * 0.9,
      a: 0.14 + Math.random() * 0.18,
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
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    resize();
    window.addEventListener("resize", resize);
    if (!isCoarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }

    pointer.x = w * 0.5;
    pointer.y = h * 0.45;
    pointer.tx = pointer.x;
    pointer.ty = pointer.y;

    function draw() {
      // سلاسة حركة الماوس
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      for (const l of lines) {
        // drift
        l.x += l.vx;
        l.y += l.vy;

        // wrap around screen
        if (l.x < -0.1) l.x = 1.1;
        if (l.x > 1.1) l.x = -0.1;
        if (l.y < -0.1) l.y = 1.1;
        if (l.y > 1.1) l.y = -0.1;

        const px = l.x * w;
        const py = l.y * h;

        // mouse interaction
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const influence = Math.max(0, 1 - dist / PUSH_RADIUS);
        const push = influence * (pointer.active ? PUSH_POWER : PUSH_POWER * 0.6);

        // push away from pointer
        l.vx += (dx / dist) * push * 0.0008;
        l.vy += (dy / dist) * push * 0.0008;

        // damp velocity (نعومة)
        l.vx *= 0.985;
        l.vy *= 0.985;

        // angle from velocity
        const ang = Math.atan2(l.vy, l.vx);
        const L = l.len * Math.min(w, h);

        const x2 = px + Math.cos(ang) * L;
        const y2 = py + Math.sin(ang) * L;

        // subtle gradient color (brand blue/ice blue)
        const g = ctx.createLinearGradient(px, py, x2, y2);
        g.addColorStop(0, `rgba(43,127,255,${l.a})`); // var(--accent-primary)
        g.addColorStop(1, `rgba(133,189,255,${l.a * 0.9})`); // var(--accent-glow)

        ctx.strokeStyle = g;
        ctx.lineWidth = l.w;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x2, y2);
        ctx.stroke();
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
