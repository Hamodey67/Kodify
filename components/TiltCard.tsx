"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  glare?: boolean;
  onClick?: () => void;
};

export default function TiltCard({
  children,
  className = "",
  maxRotate = 10,
  glare = true,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setInteractive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rotY = (px - 0.5) * (maxRotate * 2);
    const rotX = -(py - 0.5) * (maxRotate * 2);

    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`,
    });

    setMousePos({ x: Math.round(px * 100), y: Math.round(py * 100) });
    setIsHovered(true);

    if (glare) {
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(600px circle at ${Math.round(px * 100)}% ${Math.round(py * 100)}%,
          rgba(255,255,255,.25), rgba(255,255,255,0) 55%)`,
      });
    }
  };

  const onLeave = () => {
    if (!interactive) return;
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      onClick={onClick}
      className={"relative " + (interactive ? "[transform-style:preserve-3d] " : "") + className}
      style={interactive ? { transition: "transform 250ms ease", ...style } : undefined}
    >
      {interactive && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] z-30"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, 
            rgba(133, 189, 255, 0.45), 
            rgba(43, 127, 255, 0.05) 50%, 
            transparent 100%)`,
            padding: "1px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {glare && interactive && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20"
          style={{
            transition: "opacity 250ms ease",
            ...glareStyle,
          }}
        />
      )}

      <div className={"relative h-full w-full " + (interactive ? "md:[transform:translateZ(20px)]" : "")}>
        {children}
      </div>
    </div>
  );
}
