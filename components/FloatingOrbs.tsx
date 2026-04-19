"use client";

import { useEffect, useState } from "react";

export default function FloatingOrbs() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (reduce || coarse) setEnabled(false);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span className="orb o1" />
      <span className="orb o2" />
      <span className="orb o3" />
      <span className="orb o4" />

      <style jsx global>{`
        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(20px);
          opacity: .35;
          transform-style: preserve-3d;
          animation: floaty 12s ease-in-out infinite;
          background: radial-gradient(circle at 30% 30%, rgba(34,211,238,.28), rgba(34,211,238,0) 60%),
                      radial-gradient(circle at 70% 70%, rgba(16,185,129,.22), rgba(16,185,129,0) 60%);
        }

        .o1 { width: 320px; height: 320px; left: -80px; top: 10%; animation-duration: 14s; }
        .o2 { width: 420px; height: 420px; right: -120px; top: 18%; animation-duration: 18s; opacity: .28; }
        .o3 { width: 360px; height: 360px; left: 18%; bottom: -140px; animation-duration: 16s; opacity: .22; }
        .o4 { width: 520px; height: 520px; right: 12%; bottom: -220px; animation-duration: 20s; opacity: .18; }

        @keyframes floaty {
          0%, 100% { transform: translate3d(0, 0, 0) rotateZ(0deg); }
          50% { transform: translate3d(30px, -22px, 0) rotateZ(8deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
