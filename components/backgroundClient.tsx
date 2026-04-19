"use client";

import { useEffect, useState } from "react";

import BackgroundMindLike from "@/components/BackgroundMindLike";
import BackgroundWaveLines from "@/components/BackgroundWaveLines";
import BackgroundFX from "@/components/BackgroundFX";
import BackgroundCodeFX from "@/components/BackgroundCodeFX";

export default function BackgroundClient() {
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

  // ❌ نطفي الخلفيات فقط بالموبايل
  if (isMobile) return null;

  // ✅ بالحاسبة تبقى الأنيميشن كلها
  return (
    <>
      <BackgroundMindLike />
      <BackgroundWaveLines />
      <BackgroundFX />
      <BackgroundCodeFX />
    </>
  );
}
