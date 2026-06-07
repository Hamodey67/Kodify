"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import BackgroundClient from "@/components/backgroundClient";
import { motion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/app/providers";

gsap.registerPlugin(ScrollTrigger);

const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [splashDone, setSplashDone] = useState(false);
  const { lang } = useApp();
  const isRtl = lang === "ar" || lang === "ku";

  // Initialize Lenis smooth scrolling only after splash completes
  useEffect(() => {
    if (!splashDone) return;

    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    // موبايل: التمرير الطبيعي (native) أسرع وأسلس من Lenis على iOS/Android
    // نفعّله فقط على الحاسبة
    if (isTouchDevice) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: false,
      syncTouchLerp: 0.075,
    });

    (window as any).lenis = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis' smooth scroll so scroll-driven
    // animations (reveals, parallax) fire at the correct positions.
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Positions can be off until the page is fully laid out / images decode.
    ScrollTrigger.refresh();

    const hash = window.location.hash;
    if (hash) {
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) lenis.scrollTo(el, { offset: -120 });
      };
      requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
    }

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, [splashDone]);

  return (
    <>
      <SplashScreen onComplete={() => setSplashDone(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        dir={isRtl ? "rtl" : "ltr"}
        lang={lang === "ku" ? "ckb" : lang}
      >
        <BackgroundClient />
        <Navbar />
        <main id="content" className="relative min-h-screen">
          {children}
        </main>
        <ChatBot />
      </motion.div>
    </>
  );
}
