"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import BackgroundMindLike from "@/components/BackgroundMindLike";
import BackgroundCodeFX from "@/components/BackgroundCodeFX";
import BackgroundCodeSymbols from "@/components/BackgroundCodeSymbols";
import BackgroundMobile from "@/components/BackgroundMobile";
import BackgroundLight from "@/components/BackgroundLight";

export default function BackgroundClient() {
  const { theme } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)"); // موبايل فقط
    const update = () => setIsMobile(mq.matches);
    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  if (theme === "light") {
    return <BackgroundLight />;
  }

  if (isMobile) {
    return <BackgroundMobile />;
  }

  return (
    <>
      <BackgroundMindLike />
      <BackgroundCodeSymbols />
      <BackgroundCodeFX />
    </>
  );
}
