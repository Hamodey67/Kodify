"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smoother progress increment
    const interval = 30; // ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Random increment for a more "organic/system scan" feel
        const inc = Math.random() > 0.7 ? 2 : 1;
        return Math.min(prev + inc, 100);
      });
    }, interval);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
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
            filter: "blur(15px)",
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-hidden"
          style={{ willChange: "opacity, transform, filter" }}
        >
          {/* Optimized Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/20 blur-[100px]" 
              style={{ willChange: "transform, opacity" }}
            />
            <motion.div 
              animate={{ 
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[100px]" 
              style={{ willChange: "transform, opacity" }}
            />
          </div>

          {/* Static Grid Pattern - More performant */}
          <div 
            className="absolute inset-0 opacity-[0.1]" 
            style={{ 
              backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} 
          />

          <div className="relative flex flex-col items-center">
            {/* Logo Container with Optimized Glow */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              {/* Pulsing Outer Rings - Using scale and opacity with GPU acceleration */}
              <motion.div 
                animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-[-20%] border border-cyan-500/30 rounded-full"
                style={{ willChange: "transform, opacity" }}
              />
              <motion.div 
                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-[-20%] border border-blue-500/20 rounded-full"
                style={{ willChange: "transform, opacity" }}
              />

              {/* Main Logo Box */}
              <div className="relative z-10 p-7 rounded-[2.5rem] bg-slate-950/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Horizontal Scanning Beam - Using y (translateY) with fixed pixel range for smoothness */}
                <motion.div 
                  animate={{ y: [-20, 220] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 opacity-60 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  style={{ willChange: "transform" }}
                />
                
                <div className="absolute inset-0 blur-2xl bg-cyan-500/10 rounded-full" />
                
                <img
                  src="/kodify.png"
                  alt="KODIFY"
                  className="relative w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  draggable={false}
                />
              </div>
            </motion.div>

            {/* Text Reveal with Staggered Effects */}
            <div className="flex flex-col items-center gap-4">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl md:text-8xl font-black tracking-[0.2em] text-white flex gap-[0.1em] font-sans"
                  style={{ direction: 'ltr' }}
                >
                  {"KODIFY".split("").map((char, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>
              
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, letterSpacing: "0.8em" }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                className="text-cyan-400 font-bold text-xs md:text-sm uppercase tracking-[0.8em] ml-[0.8em] opacity-80"
              >
                built to remembered
              </motion.div>
            </div>

            {/* Premium Loading Section */}
            <div className="mt-20 flex flex-col items-center w-72 md:w-96">
              <div className="w-full h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "linear" }}
                  style={{ 
                    boxShadow: "0 0 15px rgba(34,211,238,0.6)",
                    willChange: "width"
                  }}
                />
              </div>

              <div className="mt-8 flex items-center justify-between w-full px-1">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.2em]"
                >
                  Initializing Core Systems
                </motion.span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"
                      />
                    ))}
                  </div>
                  {/* Fixed width for progress to prevent jitter */}
                  <span className="text-xs font-mono text-white/50 w-[4ch] text-right tabular-nums">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


