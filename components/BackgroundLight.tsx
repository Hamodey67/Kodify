"use client";

/** خلفية الوضع الفاتح — هادئة بدون كود متحرك */
export default function BackgroundLight() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <div
        className="absolute -top-[15%] left-1/2 h-[50%] w-[110%] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, var(--bg-glow-a), transparent 72%)",
        }}
      />
      <div
        className="absolute -bottom-[10%] -right-[15%] h-[40%] w-[55%] opacity-50"
        style={{
          background:
            "radial-gradient(circle, var(--bg-glow-b), transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, var(--bg-vignette) 100%)",
        }}
      />
    </div>
  );
}
