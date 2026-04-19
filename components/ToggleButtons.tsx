"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/app/providers";

const items = [
  { key: "ar", label: "AR — عربي" },
  { key: "en", label: "EN — English" },
  { key: "ku", label: "KU — کوردی" },
] as const;

export default function ToggleButtons() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const current = items.find((x) => x.key === lang)?.key.toUpperCase() ?? "LANG";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="h-10 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold text-white inline-flex items-center gap-2"
        aria-label="Language menu"
      >
        <span>{current}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      <div
        className={[
          "absolute top-[110%] right-0 min-w-[170px] rounded-2xl border border-white/10",
          "bg-black/70 backdrop-blur p-2 shadow-lg origin-top",
          "transition-all duration-150",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
      >
        {items.map((x) => (
          <button
            key={x.key}
            onClick={() => {
              setLang(x.key);
              setOpen(false);
            }}
            className={[
              "w-full text-left px-3 py-2 rounded-xl text-sm",
              "hover:bg-white/10 text-white/90",
              lang === x.key ? "bg-white/10" : "",
            ].join(" ")}
          >
            {x.label}
          </button>
        ))}
      </div>
    </div>
  );
}
