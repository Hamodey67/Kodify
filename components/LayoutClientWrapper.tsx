"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import BackgroundClient from "@/components/backgroundClient";
import ChatBot from "@/components/ChatBot";
import { motion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/app/providers";

gsap.registerPlugin(ScrollTrigger);

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);
  const { lang } = useApp();
  const isRtl = lang === "ar" || lang === "ku";

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    if (!showContent) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
  }, [showContent]);

  return (
    <>
      <SplashScreen onComplete={() => setShowContent(true)} />
      
      {showContent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
      )}
    </>
  );
}
