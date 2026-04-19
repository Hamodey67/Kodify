"use client";

export default function Rocket3D() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Rocket */}
      <div className="rocket-wrap absolute left-[8%] md:left-[12%] bottom-[-30%] opacity-80">
        <div className="rocket-tilt">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="drop-shadow-[0_25px_60px_rgba(0,0,0,.45)]"
          >
            <defs>
              <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgba(255,255,255,.95)" />
                <stop offset="0.6" stopColor="rgba(180,210,255,.85)" />
                <stop offset="1" stopColor="rgba(70,120,255,.75)" />
              </linearGradient>
              <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgba(34,211,238,.9)" />
                <stop offset="1" stopColor="rgba(59,130,246,.35)" />
              </linearGradient>
              <radialGradient id="flame" cx="50%" cy="30%" r="70%">
                <stop offset="0" stopColor="rgba(255,255,255,.95)" />
                <stop offset="0.35" stopColor="rgba(34,211,238,.9)" />
                <stop offset="1" stopColor="rgba(16,185,129,.05)" />
              </radialGradient>
            </defs>

            {/* glow aura */}
            <circle cx="60" cy="60" r="44" fill="rgba(34,211,238,.10)" />
            <circle cx="60" cy="60" r="32" fill="rgba(16,185,129,.08)" />

            {/* body */}
            <path
              d="M60 12
                 C75 28, 86 46, 86 62
                 C86 82, 74 98, 60 108
                 C46 98, 34 82, 34 62
                 C34 46, 45 28, 60 12Z"
              fill="url(#body)"
              stroke="rgba(255,255,255,.22)"
              strokeWidth="1.2"
            />

            {/* window */}
            <circle cx="60" cy="54" r="10" fill="url(#glass)" stroke="rgba(255,255,255,.25)" />

            {/* fins */}
            <path d="M34 70 C26 74, 22 82, 24 92 C30 86, 36 82, 42 80 Z" fill="rgba(59,130,246,.35)" />
            <path d="M86 70 C94 74, 98 82, 96 92 C90 86, 84 82, 78 80 Z" fill="rgba(16,185,129,.28)" />

            {/* flame */}
            <path
              className="rocket-flame"
              d="M60 108
                 C70 102, 72 92, 68 86
                 C66 92, 62 96, 60 98
                 C58 96, 54 92, 52 86
                 C48 92, 50 102, 60 108Z"
              fill="url(#flame)"
              opacity="0.95"
            />
          </svg>

          {/* trail */}
          <div className="trail mt-[-8px] mx-auto w-2 h-40 rounded-full"></div>

          {/* particles */}
          <span className="spark s1" />
          <span className="spark s2" />
          <span className="spark s3" />
        </div>
      </div>

      {/* CSS (scoped via global style tag) */}
      <style jsx global>{`
        .rocket-wrap {
          animation: rocket-rise 11s linear infinite;
          filter: saturate(1.15);
        }

        /* صعود + لفّة بسيطة */
        @keyframes rocket-rise {
          0%   { transform: translateY(55vh) translateX(0) scale(.92); opacity: 0; }
          8%   { opacity: .85; }
          50%  { transform: translateY(-10vh) translateX(18px) scale(1); opacity: .9; }
          100% { transform: translateY(-95vh) translateX(-10px) scale(.98); opacity: 0; }
        }

        /* حركة 3D خفيفة */
        .rocket-tilt {
          animation: rocket-tilt 2.6s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        @keyframes rocket-tilt {
          0%, 100% { transform: rotateZ(-6deg) rotateX(12deg); }
          50%      { transform: rotateZ(6deg) rotateX(18deg); }
        }

        /* flame flicker */
        .rocket-flame {
          transform-origin: 60px 108px;
          animation: flame 0.22s ease-in-out infinite;
        }
        @keyframes flame {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: .95; }
          50%      { transform: scaleY(1.18) scaleX(.92); opacity: .85; }
        }

        /* trail */
        .trail {
          background: linear-gradient(
            to bottom,
            rgba(34, 211, 238, 0.0),
            rgba(34, 211, 238, 0.25),
            rgba(16, 185, 129, 0.18),
            rgba(59, 130, 246, 0.0)
          );
          filter: blur(0.3px);
          animation: trail 0.6s ease-in-out infinite;
        }
        @keyframes trail {
          0%,100% { opacity: .55; height: 150px; }
          50%     { opacity: .85; height: 190px; }
        }

        /* sparks */
        .spark {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.9);
          box-shadow: 0 0 18px rgba(34,211,238,.45);
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
        }
        .spark.s1 { bottom: -8px; animation: spark 1.1s linear infinite; }
        .spark.s2 { bottom: -18px; animation: spark 1.35s linear infinite; }
        .spark.s3 { bottom: -28px; animation: spark 1.6s linear infinite; }

        @keyframes spark {
          0%   { transform: translateX(-50%) translateY(0) scale(.8); opacity: 0; }
          15%  { opacity: .95; }
          100% { transform: translateX(-50%) translateY(70px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
