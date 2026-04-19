"use client";

import { useEffect, useRef } from "react";

export default function BackgroundWaveLines() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0,
      h = 0,
      dpr = 1;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    let t = 0;

    const LINES = 22; // عدد الخطوط الأفقية
    const STEP = 18; // كثافة النقاط على الخط (أصغر = نقاط أكثر)
    const AMP = 14; // ارتفاع الموجة
    const SPEED = 0.018; // سرعة حركة الموجة
    const MOUSE_RADIUS = 220; // مدى تأثير الماوس
    const MOUSE_BOOST = 22; 

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // مركز مبدئي
      pointer.x = w * 0.5;
      pointer.y = h * 0.45;
      pointer.tx = pointer.x;
      pointer.ty = pointer.y;
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

    function draw() {
      t += SPEED;

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const topPad = h * 0.1;
      const bottomPad = h * 0.15;
      const usableH = h - topPad - bottomPad;

      for (let i = 0; i < LINES; i++) {
        const yBase = topPad + (usableH * i) / (LINES - 1);

        const mid = (LINES - 1) / 2;
        const fade = 1 - Math.min(1, Math.abs(i - mid) / mid);
        const alpha = 0.05 + fade * 0.14;

        const lw = 0.7 + fade * 0.9;

        const grad = ctx.createLinearGradient(0, yBase, w, yBase);
        grad.addColorStop(0, `rgba(56,189,248,${alpha})`);
        grad.addColorStop(1, `rgba(37,99,235,${alpha * 0.9})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.beginPath();

        // موجة كل خط تختلف شوي
        const phase = i * 0.55;
        const freq = 0.008 + i * 0.00015;

        for (let x = 0; x <= w; x += STEP) {
          const dx = x - pointer.x;
          const dy = yBase - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const influence = Math.max(0, 1 - dist / MOUSE_RADIUS);
          const mouseAmp = influence * (pointer.active ? MOUSE_BOOST : MOUSE_BOOST * 0.55);

          const wave =
            Math.sin(x * freq + t + phase) * AMP +
            Math.sin(x * (freq * 1.6) + t * 1.35 + phase) * (AMP * 0.35);

          const y = yBase + wave * (1 + mouseAmp / 30);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

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
