"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const BOOT_LINES = [
  { text: "> kodify init --secure --force", delay: 0.1 },
  { text: "> loading kernel modules...", delay: 0.35 },
  { text: "> mounting encrypted volumes [OK]", delay: 0.55 },
  { text: "> establishing TLS 1.3 tunnel...", delay: 0.75 },
  { text: "> verifying JWT signatures...", delay: 0.95 },
  { text: "> deploying edge runtime...", delay: 1.15 },
  { text: "> SYSTEM ARMED — ACCESS GRANTED", delay: 1.4, accent: true },
];

const RAIN_LINES = [
  "import { encrypt } from '@kodify/core'",
  "await secureData(payload)",
  "export async function boot()",
  "const hash = bcrypt.hash(pw, 12)",
  "kubectl apply -f deploy.yaml",
  "docker compose up -d",
  "SELECT * FROM auth_logs",
  "git push origin main",
  "useEffect(() => init(), [])",
  "NextResponse.redirect('/app')",
  "fn validate(token) -> bool",
  "middleware(req) { }",
  "Promise.all([fetch('/api')])",
  "Redis.set(key, data)",
  "{ }",
  "=> async () =>",
  "0xFF 0x00 0xAB",
];

function CodeRainColumn({ index }: { index: number }) {
  const lines = useMemo(() => {
    const n = RAIN_LINES.length;
    return Array.from({ length: 12 }, (_, i) => RAIN_LINES[(index * 2 + i) % n]);
  }, [index]);

  const dur = 4 + (index % 4) * 0.8;
  const block = (
    <div className="flex flex-col gap-1 py-1 text-[10px] leading-tight text-sky-300/40">
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );

  return (
    <div
      className="splash-rain-col relative h-full flex-1 overflow-hidden opacity-60"
      style={{ ["--rain-dur" as string]: `${dur}s`, ["--rain-delay" as string]: `${-index * 0.6}s` }}
    >
      <div className="splash-rain-track absolute inset-x-0 top-0">
        {block}
        <div aria-hidden>{block}</div>
      </div>
    </div>
  );
}

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const inc = prev < 60 ? 3 + Math.floor(Math.random() * 4) : 2 + Math.floor(Math.random() * 3);
        return Math.min(prev + inc, 100);
      });
    }, 45);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(20px) brightness(1.4)",
            transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#101a2e] overflow-hidden font-mono"
          style={{ willChange: "opacity, transform, filter" }}
          dir="ltr"
        >
          <style>{`
            @keyframes splash-glitch {
              0%, 90%, 100% { transform: translate(0); clip-path: inset(0 0 0 0); }
              91% { transform: translate(-3px, 1px); clip-path: inset(8% 0 82% 0); }
              92% { transform: translate(3px, -1px); clip-path: inset(62% 0 12% 0); }
              93% { transform: translate(-2px, 2px); clip-path: inset(32% 0 48% 0); }
              94% { transform: translate(2px, 0); clip-path: inset(0 0 0 0); }
            }
            @keyframes splash-scan {
              0% { top: -4px; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
            @keyframes splash-rain-fall {
              0% { transform: translateY(-50%); }
              100% { transform: translateY(0); }
            }
            @keyframes splash-flicker {
              0%, 100% { opacity: 1; }
              92% { opacity: 0.85; }
              93% { opacity: 1; }
              94% { opacity: 0.7; }
              95% { opacity: 1; }
            }
            @keyframes splash-cursor {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
            .splash-glitch-text {
              animation: splash-glitch 2.5s infinite;
            }
            .splash-scanline {
              animation: splash-scan 2.2s linear infinite;
            }
            .splash-rain-track {
              animation: splash-rain-fall var(--rain-dur, 5s) linear infinite;
              animation-delay: var(--rain-delay, 0s);
            }
            .splash-terminal {
              animation: splash-flicker 4s infinite;
            }
            .splash-cursor {
              animation: splash-cursor 0.8s step-end infinite;
            }
          `}</style>

          {/* CRT scanlines */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
            }}
          />

          {/* Code rain — edges */}
          <div className="pointer-events-none absolute inset-0 z-0 flex gap-0 px-0 opacity-80">
            <div className="flex h-full w-[18%] min-w-[72px] max-w-[140px]">
              {Array.from({ length: 3 }, (_, i) => (
                <CodeRainColumn key={`l${i}`} index={i} />
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex h-full w-[18%] min-w-[72px] max-w-[140px]">
              {Array.from({ length: 3 }, (_, i) => (
                <CodeRainColumn key={`r${i}`} index={i + 4} />
              ))}
            </div>
          </div>

          {/* Grid + vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(125,211,252,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.12) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 50% 45% at 50% 50%, transparent 0%, rgba(1,4,9,0.85) 100%)",
            }}
          />

          {/* Glitch flash on enter */}
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-[20] bg-sky-300/15 mix-blend-screen"
          />

          {/* Moving scan beam */}
          <div className="splash-scanline pointer-events-none absolute left-0 right-0 z-[15] h-[3px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent shadow-[0_0_20px_rgba(125,211,252,0.5)]" />

          {/* Center terminal */}
          <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6">
            {/* Terminal window */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="splash-terminal w-full overflow-hidden rounded-lg border border-sky-400/20 bg-slate-900/90 shadow-[0_0_50px_rgba(125,211,252,0.12),inset_0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-sm"
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-sky-400/20 bg-slate-800/40 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400/80" />
                </div>
                <span className="ml-2 text-[10px] font-bold tracking-widest text-sky-300/80">
                  KODIFY://BOOT_SEQUENCE
                </span>
                <span className="ml-auto text-[9px] text-sky-400/50">v2.0.0-secure</span>
              </div>

              {/* Boot log */}
              <div className="space-y-1.5 p-4 text-left text-[11px] leading-relaxed md:text-xs">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: line.delay, duration: 0.25 }}
                    className={
                      line.accent
                        ? "font-bold text-sky-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                        : "text-sky-400/80"
                    }
                  >
                    {line.text}
                    {i === BOOT_LINES.length - 1 && phase >= 1 && (
                      <span className="splash-cursor ml-0.5 inline-block h-[1em] w-[7px] bg-sky-400 align-middle" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Logo + brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-10 flex flex-col items-center"
            >
              <div className="absolute -inset-8 rounded-full bg-sky-400/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-sky-400/25 bg-slate-900/90 p-5 shadow-[0_0_36px_rgba(125,211,252,0.2)]">
                <motion.div
                  animate={{ y: [-10, 120] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80"
                />
                <img
                  src="/kodify.png"
                  alt="KODIFY"
                  className="relative h-20 w-20 object-contain md:h-24 md:w-24"
                  draggable={false}
                />
              </div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : {}}
                transition={{ duration: 0.3 }}
                className="splash-glitch-text mt-8 text-5xl font-black tracking-[0.35em] text-white md:text-7xl"
                style={{
                  textShadow:
                    "0 0 20px rgba(125,211,252,0.5), 2px 0 rgba(103,232,249,0.3), -2px 0 rgba(186,230,253,0.35)",
                }}
              >
                KODIFY
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={phase >= 3 ? { opacity: 1, letterSpacing: "0.55em" } : {}}
                transition={{ duration: 0.6 }}
                className="mt-3 text-[10px] font-bold uppercase text-sky-300/80 md:text-xs"
              >
                SECURE BY DESIGN
              </motion.p>
            </motion.div>

            {/* Progress — terminal style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 w-full max-w-md"
            >
              <div className="mb-2 flex justify-between text-[10px] text-sky-400/70">
                <span>[ LOADING_MODULES ]</span>
                <span className="tabular-nums text-sky-300">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-sm border border-sky-400/20 bg-black/60">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                  style={{ boxShadow: "0 0 12px rgba(59,130,246,0.8)" }}
                />
              </div>
              <div className="mt-2 flex gap-1 overflow-hidden text-[9px] text-sky-500/60">
                {Array.from({ length: 32 }, (_, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: progress > (i / 32) * 100 ? 1 : 0.15 }}
                    className={progress > (i / 32) * 100 ? "text-sky-300" : ""}
                  >
                    █
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Corner HUD */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 text-[9px] text-sky-400/50">
            <div>PID: 0xkodify</div>
            <div>MEM: {progress}% ALLOC</div>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 text-right text-[9px] text-sky-400/50">
            <div>ENCRYPT: AES-256-GCM</div>
            <div>STATUS: {progress >= 100 ? "READY" : "BOOTING"}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
