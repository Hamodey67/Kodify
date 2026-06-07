"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Hide scrollbar while splashing to avoid shifting
    document.body.style.overflow = "hidden";
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5 seconds total for a smoother, faster intro

    const unmountTimer = setTimeout(() => {
      document.body.style.overflow = "";
      onCompleteRef.current?.();
    }, 3300); // give time for the exit animation

    return () => {
      document.body.style.overflow = "";
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080d17] overflow-hidden"
          style={{ willChange: "opacity, transform, filter", cursor: "none" }}
          dir="ltr"
        >
          <style>{`
            #custom-cursor {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
          `}</style>

          {/* Smooth subtle ambient background glow */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.35, scale: 1.2 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="h-[50vw] w-[50vw] max-h-[600px] max-w-[600px] rounded-full bg-sky-500/20 blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex items-center justify-center mb-8"
            >
              {/* Outer pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-6 rounded-full border border-sky-400/20 bg-sky-400/10 blur-xl"
              />
              
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-slate-900/70 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <img
                  src="/kodify.png"
                  alt="KODIFY"
                  className="h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(125,211,252,0.4)]"
                  draggable={false}
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0em" }}
              animate={{ opacity: 1, letterSpacing: "0.25em" }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-black text-[#ffffff] tracking-widest"
              style={{
                textShadow: "0 0 40px rgba(125,211,252,0.5)",
              }}
            >
              KODIFY
            </motion.h1>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-200/50"
            >
              Built to be remembered
            </motion.p>

            {/* Loading Line */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "160px", opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              className="mt-10 h-[2px] bg-gradient-to-r from-transparent via-sky-400/70 to-transparent rounded-full shadow-[0_0_15px_rgba(56,189,248,0.6)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
