"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function AppShell({
  title,
  subtitle,
  logoSrc,
  rightLabel,
  dir,
  children,
  bottom,
}: {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  rightLabel?: string;
  dir?: "rtl" | "ltr";
  children: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  return (
    <div dir={dir} className="h-full text-white flex flex-col bg-[#0b1220]">
      {/* Top app bar */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {logoSrc ? (
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden grid place-items-center">
                <Image
                  src={logoSrc}
                  alt="logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-cyan-400/20 border border-cyan-300/20" />
            )}

            <div className="min-w-0">
              <div className="font-extrabold truncate">{title}</div>
              {subtitle ? <div className="text-xs text-white/70 truncate">{subtitle}</div> : null}
            </div>
          </div>

          <div className="text-xs text-white/60">{rightLabel ?? "Demo"}</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Bottom nav (optional) */}
      {bottom ? <div className="border-t border-white/10 bg-black/25">{bottom}</div> : null}
    </div>
  );
}

export function BottomNav({
  items,
  active,
  onChange,
}: {
  items: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="px-3 py-2 grid grid-cols-3 gap-2">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={cn(
            "h-10 rounded-2xl text-sm font-bold transition border",
            active === it.key
              ? "bg-white text-black border-white"
              : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function ScreenTransition({
  children,
  k,
}: {
  children: React.ReactNode;
  k: string;
}) {

  return (
    <div key={k} className="h-full animate-[fadeIn_.18s_ease-out]">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
}
