"use client";

/** خلفية خفيفة للموبايل — بدون أنيميشن ثقيلة */
export default function BackgroundMobile() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#101a2e]" />
      <div
        className="absolute -top-[20%] left-1/2 h-[55%] w-[120%] -translate-x-1/2 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(125, 211, 252, 0.2), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[20%] h-[45%] w-[70%] opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(103, 232, 249, 0.15), transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% 30%, transparent 0%, rgba(16, 26, 46, 0.6) 100%)",
        }}
      />
    </div>
  );
}
