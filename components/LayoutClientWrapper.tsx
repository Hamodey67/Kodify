"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import BackgroundClient from "@/components/backgroundClient";
import { motion } from "framer-motion";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

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
        </motion.div>
      )}
    </>
  );
}
