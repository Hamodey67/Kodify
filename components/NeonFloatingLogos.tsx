"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const logos = [
    {
        name: "React",
        color: "hsl(193, 100%, 70%)",
        icon: (
            <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-full h-full">
                <circle cx="0" cy="0" r="2.05" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
            </svg>
        ),
    },
    {
        name: "Node.js",
        color: "hsl(200, 100%, 70%)",
        icon: (
            <svg viewBox="0 0 256 256" className="w-full h-full" fill="currentColor">
                <path d="M128,0,32,55.43V166.28L128,221.7l96-55.42V55.43ZM204,155.19,128,199.07,52,155.19V66.51L128,22.63l76,43.88Z" />
            </svg>
        ),
    },
    {
        name: "TypeScript",
        color: "hsl(211, 100%, 70%)",
        icon: (
            <svg viewBox="0 0 256 256" className="w-full h-full" fill="currentColor">
                <path d="M0 0h256v256H0V0zm112.5 190.2c-2.3-1.6-4.5-3.3-6.6-5.1l-14.8 11.8c7.3 6 15.6 11.2 24.8 15.6 12 5.6 25.1 8.3 39.4 8.3 22.8 0 40-6.1 51.6-18.4 11.6-12.3 17.4-28.7 17.4-49.4 0-19-4.8-33.6-14.4-43.8-9.6-10.2-24.3-17.1-44-20.6-10-1.8-17.5-3.9-22.3-6.1-4.9-2.2-7.3-5.3-7.3-9.5 0-3.9 1.8-6.9 5.5-8.9 3.7-2 9.1-3 16.2-3 8.3 0 15.1 1.6 20.2 4.9s8.8 7.3 11 11.9L191 106c-2.9-7-7.7-12.6-14.4-16.7-6.7-4.1-15.5-6.1-26.6-6.1-17.4 0-31.5 5.5-42.3 16.4-10.8 10.9-16.2 25.1-16.2 42.6 0 19.5 5 34.3 15 44.5s24.4 16.9 43.1 20.3c13.7 2.5 23.3 5.4 28.7 8.7 5.4 3.3 8.1 8 8.1 14.3 0 5.4-2.3 9.7-7 12.8s-12.5 4.7-23.4 4.7c-9.5 0-17.5-1.5-24-4.5l-6.5-2.8zM42.3 94.6h85.3V111H95v106.3H74.8V111H42.3V94.6z" />
            </svg>
        ),
    },
    {
        name: "Python",
        color: "hsl(48, 100%, 70%)",
        icon: (
            <svg viewBox="0 0 256 256" className="w-full h-full" fill="currentColor">
                <path d="M127.3,0a125.13,125.13,0,0,0-54.7,0C36,0,32,24,32,48v32l40,40H32s-32,4-32,32v32c0,32,24,32,48,32h32s0,40,40,40h32s40-4,40-40V127.3h40s32-4,32-32V63.3s-4-32-32-32l-40-1.3Z" />
            </svg>
        ),
    },
    {
        name: "Next.js",
        color: "hsl(0, 0%, 100%)",
        icon: (
            <svg viewBox="0 0 256 256" className="w-full h-full" fill="currentColor">
                <path d="M128,0a128,128,0,1,0,128,128A128,128,0,0,0,128,0ZM128,210.7a82.7,82.7,0,1,1,82.7-82.7A82.7,82.7,0,0,1,128,210.7Z" />
                <path d="M187,187,112,88v99H95V70h17l75,99.5V70h17V187Z" />
            </svg>
        ),
    },
];

const shapes = [
    { type: "circle", color: "hsla(180, 100%, 70%, 0.5)", size: 40 },
    { type: "triangle", color: "hsla(280, 100%, 70%, 0.5)", size: 30 },
    { type: "square", color: "hsla(340, 100%, 70%, 0.5)", size: 35 },
    { type: "card", color: "hsla(0, 0%, 100%, 0.3)", size: 60 },
];

export default function NeonFloatingLogos() {
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        const newElements = [];
        // Create logos
        for (let i = 0; i < 12; i++) {
            const logo = logos[i % logos.length];
            newElements.push({
                id: `logo-${i}`,
                content: logo.icon,
                color: logo.color,
                size: Math.random() * 50 + 40,
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: Math.random() * 15 + 20,
                delay: Math.random() * 10,
                isLogo: true,
                z: Math.random() * 100 - 50,
            });
        }
        // Create shapes
        for (let i = 0; i < 15; i++) {
            const shape = shapes[i % shapes.length];
            newElements.push({
                id: `shape-${i}`,
                type: shape.type,
                color: shape.color,
                size: Math.random() * 60 + 30,
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: Math.random() * 18 + 25,
                delay: Math.random() * 10,
                isLogo: false,
                z: Math.random() * 100 - 50,
            });
        }
        setElements(newElements);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-[5]" style={{ perspective: "1000px" }}>
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    initial={{ opacity: 0, scale: 0, z: -200 }}
                    animate={{
                        opacity: [0, 0.7, 0.7, 0],
                        scale: [0.7, 1.1, 1, 0.7],
                        x: [`${el.x}%`, `${(el.x + 20) % 100}%`],
                        y: [`${el.y}%`, `${(el.y - 30 + 100) % 100}%`],
                        rotateX: [0, 360],
                        rotateY: [0, 360],
                        z: [el.z, el.z + 100],
                    }}
                    transition={{
                        duration: el.duration,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        width: el.size,
                        height: el.size,
                        color: el.color,
                        filter: `drop-shadow(0 0 15px ${el.color})`,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {el.isLogo ? (
                        el.content
                    ) : el.type === "card" ? (
                        <div
                            className="w-full h-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            style={{
                                transform: "translateZ(10px)",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                border: `3px solid ${el.color}`,
                                boxShadow: `0 0 20px ${el.color}, inset 0 0 10px ${el.color}`,
                                borderRadius: el.type === "circle" ? "50%" : el.type === "square" ? "8px" : "0",
                                clipPath: el.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
                                background: "rgba(255,255,255,0.05)",
                                backdropFilter: "blur(5px)",
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
