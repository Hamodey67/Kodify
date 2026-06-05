"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import BackgroundClient from "@/components/backgroundClient";
import ChatBot from "@/components/ChatBot";
import { motion } from "framer-motion";
import Lenis from "lenis";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

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

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
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
