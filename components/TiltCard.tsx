"use client";

import React, { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // degrees
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

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1

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
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={"relative [transform-style:preserve-3d] " + className}
      style={{
        transition: "transform 250ms ease",
        ...style,
      }}
    >
      {/* Spotlight Border Glow */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] z-30"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, 
            rgba(133, 189, 255, 0.45), 
            rgba(43, 127, 255, 0.05) 50%, 
            transparent 100%)`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20"
          style={{
            transition: "opacity 250ms ease",
            ...glareStyle,
          }}
        />
      )}

      {/* content layer */}
      <div className="relative [transform:translateZ(20px)] w-full h-full">
        {children}
      </div>
    </div>
  );
}
