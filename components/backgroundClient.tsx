"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/app/providers";
import BackgroundMindLike from "@/components/BackgroundMindLike";
import BackgroundAurora from "@/components/BackgroundAurora";
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
    return (
      <>
        <BackgroundLight />
        <BackgroundCodeFX />
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <BackgroundAurora colorStops={["#0373FF", "#00c6fb", "#0373FF"]} blend={0.5} amplitude={1.0} speed={0.5} />
        <BackgroundMobile />
      </>
    );
  }

  return (
    <>
      <BackgroundAurora colorStops={["#0373FF", "#00c6fb", "#0373FF"]} blend={0.5} amplitude={1.0} speed={0.5} />
      <BackgroundMindLike />
      <BackgroundCodeSymbols />
      <BackgroundCodeFX />
    </>
  );
}
