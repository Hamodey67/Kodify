"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  from?: "up" | "left" | "right";
  once?: boolean;
};

const variantsFor = (from: Props["from"]): Variants => {
  if (from === "left") {
    return { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } };
  }
  if (from === "right") {
    return { hidden: { opacity: 0, x: 28 }, show: { opacity: 1, x: 0 } };
  }
  // default: up
  return { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
};

export default function Reveal({
  children,
  className = "",
  delayMs = 0,
  from = "up",
  once = true,
}: Props) {
  const v = variantsFor(from);

  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.18 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: delayMs / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
