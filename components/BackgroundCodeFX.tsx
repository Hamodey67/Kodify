"use client";

import { useEffect, useMemo, useRef } from "react";

type Item = {
  text: string;
  top: string;
  left: string;
  size?: "sm" | "md" | "lg";
  opacity?: number;
  blur?: boolean;
  speed?: number;
  rotate?: number;
};

export default function BackgroundCodeFX() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", String(x));
      el.style.setProperty("--my", String(y));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const items = useMemo<Item[]>(
    () => [
      { text: "< />", top: "12%", left: "8%", size: "lg", opacity: 0.12, blur: true, speed: 1.0, rotate: -8 },
      { text: "{}", top: "20%", left: "74%", size: "lg", opacity: 0.10, blur: true, speed: 0.9, rotate: 10 },

      { text: "React", top: "18%", left: "42%", size: "md", opacity: 0.10, speed: 1.2, rotate: -5 },
      { text: "Next.js", top: "40%", left: "12%", size: "md", opacity: 0.10, speed: 1.0, rotate: 6 },

      { text: "TypeScript", top: "82%", left: "46%", size: "sm", opacity: 0.10, speed: 1.3, rotate: -3 },
      { text: "Tailwind", top: "68%", left: "78%", size: "sm", opacity: 0.09, speed: 1.1, rotate: 5 },

      { text: "Node", top: "52%", left: "56%", size: "sm", opacity: 0.09, speed: 1.05, rotate: 4 },
      { text: "API", top: "28%", left: "92%", size: "sm", opacity: 0.09, speed: 1.2, rotate: -8 },

      { text: "SQL", top: "86%", left: "86%", size: "sm", opacity: 0.09, speed: 0.95, rotate: 9 },
      { text: "git", top: "12%", left: "92%", size: "sm", opacity: 0.09, speed: 1.15, rotate: -4 },

      { text: "// TODO", top: "60%", left: "26%", size: "sm", opacity: 0.09, speed: 1.0, rotate: 6 },
      { text: "const", top: "74%", left: "6%", size: "sm", opacity: 0.09, speed: 1.0, rotate: -4 },
      { text: "</>", top: "44%", left: "90%", size: "md", opacity: 0.09, blur: true, speed: 1.15, rotate: 8 },
    ],
    []
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="codefx absolute inset-0">
        {items.map((it, i) => (
          <div
            key={i}
            className={[
              "codefx-item",
              it.size === "lg" ? "codefx-lg" : it.size === "md" ? "codefx-md" : "codefx-sm",
              it.blur ? "codefx-blur" : "",
            ].join(" ")}
            style={{
              top: it.top,
              left: it.left,
              opacity: it.opacity ?? 0.1,
              ["--spd" as any]: String(it.speed ?? 1),
              ["--rot" as any]: `${it.rotate ?? 0}deg`,
            }}
          >
            {it.text}
          </div>
        ))}
      </div>

      <div className="codefx-sheen" />
    </div>
  );
}
