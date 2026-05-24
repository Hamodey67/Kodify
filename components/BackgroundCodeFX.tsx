"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/app/providers";

export default function BackgroundCodeFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    
    const drops: number[] = [];
    const activeColumns = new Set<number>();
    
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height;
      if (Math.random() < 0.2) {
        activeColumns.add(x);
      }
    }

    const draw = () => {
      const isLightMode = document.documentElement.classList.contains("light");

      // Semi-transparent background for trail effect (using e2e8f4 for light mode to match the theme background)
      ctx.fillStyle = isLightMode ? "rgba(226, 232, 244, 0.12)" : "rgba(5, 11, 20, 0.12)"; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Create sparsity
        if (!activeColumns.has(i)) {
          if (Math.random() > 0.995) {
             activeColumns.add(i);
             drops[i] = 0;
          }
          continue;
        }

        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Coloring
        const isHead = Math.random() > 0.9;
        if (isLightMode) {
          ctx.fillStyle = isHead ? "#000080" : "rgba(0, 0, 128, 0.55)"; 
        } else {
          ctx.fillStyle = isHead ? "#5eead4" : "#0d9488"; // teal-300 / teal-600
        }
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
          if (Math.random() > 0.6) {
            activeColumns.delete(i);
          }
        }
        
        drops[i]++;
      }
    };

    let animationFrameId: number;
    let lastTime = 0;
    const interval = 50;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = time - lastTime;
      if (elapsed > interval) {
        lastTime = time - (elapsed % interval);
        draw();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops.length = 0;
      activeColumns.clear();
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * height;
        if (Math.random() < 0.2) activeColumns.add(x);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-75 dark:opacity-60"
    />
  );
}
