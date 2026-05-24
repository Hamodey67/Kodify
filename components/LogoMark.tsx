"use client";

import Image from "next/image";
import { useApp } from "@/app/providers";
import { useEffect, useState } from "react";

export default function LogoMark() {
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
      className="h-12 w-auto transition-opacity duration-300"
    />
  );
}
