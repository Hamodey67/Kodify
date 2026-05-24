"use client";

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/app/providers";

export default function CustomCursor() {
  const { theme } = useApp();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse || theme === "light") return;

    setVisible(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    const ease = 0.35; // أسرع بكثير لتتبع فوري وسلس بنفس الوقت

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    let rafId = 0;
    const animate = () => {
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // Hover listeners using event delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest("a, button, input, textarea, select, [role='button'], .group")) {
        setHovered(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest("a, button, input, textarea, select, [role='button'], .group")) {
        setHovered(false);
      }
    };

    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  if (!visible) return null;

  return (
    <div id="custom-cursor" className="pointer-events-none fixed inset-0 z-[999999]">
      {/* Outer Circle */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 -ml-[13px] -mt-[13px] h-[26px] w-[26px] rounded-full border border-cyan-400/50 bg-cyan-400/0 will-change-transform transition-[width,height,background-color,border-color] duration-300 ${
          hovered ? "h-[48px] w-[48px] -ml-[24px] -mt-[24px] bg-cyan-400/10 border-cyan-400" : ""
        }`}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-cyan-400 will-change-transform"
      />
    </div>
  );
}
