"use client";

import Image from "next/image";
import { useApp } from "@/app/providers";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LogoMark({ compact = false }: { compact?: boolean }) {
  const { theme } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To prevent hydration mismatch, you could either render a placeholder or
  // just the dark mode logo until mounted.
  const src = mounted && theme === "light" ? "/logo1.png" : "/kodify.png";

  return (
    <Image
      src={src}
      alt="Logo"
      width={40}
      height={20}
      priority
      className={cn(
        "w-auto transition-[height,opacity] duration-300",
        compact ? "h-9" : "h-12"
      )}
    />
  );
}
