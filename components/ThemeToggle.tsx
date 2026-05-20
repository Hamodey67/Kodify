"use client";

import { useApp } from "@/app/providers";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, lang } = useApp();
  const isLight = theme === "light";

  const label =
    lang === "ar"
      ? isLight
        ? "الوضع الداكن"
        : "الوضع الفاتح"
      : lang === "ku"
      ? isLight
        ? "دۆخی تاریک"
        : "دۆخی ڕووناک"
      : isLight
      ? "Dark mode"
      : "Light mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
        "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--accent-strong)]",
        "hover:bg-[var(--accent-muted)] hover:border-[var(--accent-border)]",
        "active:scale-95",
        className
      )}
    >
      {isLight ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
    </button>
  );
}
