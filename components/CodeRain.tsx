"use client";

import { useEffect, useRef, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]<>;:./\\|&%$#@_+-=~";

const NAVY = "#001220";
const TEAL = "#1D9E75";
const HEAD = "#D4FFF0";

type Column = {
  x: number;
  y: number;
  speed: number;
  length: number;
  fontSize: number;
  layer: number;
  drift: number;
  driftPhase: number;
  glyphs: string[];
};

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function tealAlpha(alpha: number) {
  const { r, g, b } = hexToRgb(TEAL);
  return `rgba(${r},${g},${b},${alpha})`;
}

function headAlpha(alpha: number) {
  const { r, g, b } = hexToRgb(HEAD);
  return `rgba(${r},${g},${b},${alpha})`;
}

function buildColumns(width: number, height: number): Column[] {
  const columns: Column[] = [];
  const layers = [
    { fontSize: 11, gap: 22, opacity: 1, speed: [0.35, 0.55], len: [8, 14] },
    { fontSize: 13, gap: 18, opacity: 1, speed: [0.55, 0.85], len: [10, 18] },
    { fontSize: 15, gap: 26, opacity: 1, speed: [0.75, 1.15], len: [12, 22] },
  ];

  layers.forEach((layer, layerIndex) => {
    const count = Math.ceil(width / layer.gap) + 2;
    for (let i = 0; i < count; i++) {
      const length =
        layer.len[0] + Math.floor(Math.random() * (layer.len[1] - layer.len[0] + 1));
      columns.push({
        x: i * layer.gap + (Math.random() - 0.5) * 6,
        y: Math.random() * height * -1.2,
        speed: layer.speed[0] + Math.random() * (layer.speed[1] - layer.speed[0]),
        length,
        fontSize: layer.fontSize,
        layer: layerIndex,
        drift: 0.15 + Math.random() * 0.25,
        driftPhase: Math.random() * Math.PI * 2,
        glyphs: Array.from({ length }, randChar),
      });
    }
  });

  return columns;
}

/** الكومبوننت الفعلي — يحتوي كل منطق الكانفاس بدون أي تغيير */
function CodeRainInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setReduced = () => {
      reducedMotionRef.current = motionMq.matches;
    };
    setReduced();
    motionMq.addEventListener("change", setReduced);

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.font = "500 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      columnsRef.current = buildColumns(width, height);
      ctx!.fillStyle = NAVY;
      ctx!.fillRect(0, 0, width, height);
    }

    resize();
    window.addEventListener("resize", resize);

    function drawVignette() {
      const g = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.45,
        Math.min(width, height) * 0.15,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      g.addColorStop(0, "rgba(0, 18, 32, 0)");
      g.addColorStop(0.55, "rgba(0, 18, 32, 0.25)");
      g.addColorStop(1, "rgba(0, 8, 18, 0.72)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawColumn(col: Column, t: number) {
      const layerOpacity = [0.22, 0.38, 0.52][col.layer] ?? 0.35;
      const x = col.x + Math.sin(t * 0.0004 + col.driftPhase) * col.drift * 8;

      ctx!.font = `500 ${col.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      for (let i = 0; i < col.length; i++) {
        const charY = col.y - i * col.fontSize;
        if (charY < -col.fontSize || charY > height + col.fontSize) continue;

        const trail = i / Math.max(col.length - 1, 1);
        let color: string;

        if (i === 0) {
          color = headAlpha(0.85 * layerOpacity);
        } else if (trail < 0.35) {
          color = tealAlpha((0.75 - trail * 1.2) * layerOpacity);
        } else {
          color = tealAlpha(Math.max(0, (0.45 - trail * 0.5) * layerOpacity));
        }

        ctx!.fillStyle = color;
        ctx!.fillText(col.glyphs[i] ?? randChar(), x, charY);
      }
    }

    let last = performance.now();
    let staticTimer = 0;

    function tick(now: number) {
      if (!visibleRef.current) return;

      const reduced = reducedMotionRef.current;
      const delta = now - last;
      last = now;
      timeRef.current += delta;

      if (reduced) {
        staticTimer += delta;
        if (staticTimer < 2200) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        staticTimer = 0;
      }

      ctx!.fillStyle = "rgba(0, 18, 32, 0.09)";
      ctx!.fillRect(0, 0, width, height);

      const speedMul = reduced ? 0.08 : 1;

      for (const col of columnsRef.current) {
        col.y += col.speed * speedMul * (delta / 16);

        if (Math.random() < 0.04) {
          const idx = Math.floor(Math.random() * col.glyphs.length);
          col.glyphs[idx] = randChar();
        }

        if (col.y - col.length * col.fontSize > height + 40) {
          col.y = -Math.random() * height * 0.4;
          col.glyphs = Array.from({ length: col.length }, randChar);
        }

        drawColumn(col, timeRef.current);
      }

      drawVignette();
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      motionMq.removeEventListener("change", setReduced);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-[0.55]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 0%, rgba(0, 18, 32, 0.35) 55%, rgba(0, 8, 18, 0.85) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Wrapper مسؤول فقط عن كشف الموبايل.
 * على الموبايل → null (بدون كانفاس = بدون CPU/GPU overhead)
 * على الحاسبة → CodeRainInner بدون أي تغيير
 */
export default function CodeRain() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth <= 768;
    if (coarse || small) setIsMobile(true);
  }, []);

  if (isMobile) return null;
  return <CodeRainInner />;
}

