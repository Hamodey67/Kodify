"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center p-2 rounded-xl transition-all border",
        "bg-black/[0.03] border-black/5 hover:bg-black/[0.08] dark:bg-white/[0.03] dark:border-white/5 dark:hover:bg-white/[0.08]",
        "text-foreground"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-white/80" />
      ) : (
        <Moon size={18} className="text-black/80" />
      )}
    </button>
  );
}
