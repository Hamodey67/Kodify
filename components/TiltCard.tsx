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

    if (glare) {
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(600px circle at ${Math.round(px * 100)}% ${Math.round(py * 100)}%,
          rgba(255,255,255,.35), rgba(255,255,255,0) 55%)`,
      });
    }
  };

  const onLeave = () => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setGlareStyle({ opacity: 0 });
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
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            transition: "opacity 250ms ease",
            ...glareStyle,
          }}
        />
      )}

      {/* content layer */}
      <div className="relative [transform:translateZ(20px)]">
        {children}
      </div>
    </div>
  );
}
