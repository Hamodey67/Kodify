"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "@/app/providers";
import Reveal from "./Reveal";
import { projects } from "@/lib/data";
import { ExternalLink, Tag, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectsShowcase() {
  const { lang } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((p, idx) => {
        const title = lang === "ar" ? p.arTitle : lang === "ku" ? p.kuTitle : p.enTitle;
        const desc = lang === "ar" ? p.arDesc : lang === "ku" ? p.kuDesc : p.enDesc;

        return (
          <Reveal key={p.id} delayMs={idx * 150} from="up">
            <div className="group relative h-full flex flex-col rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-2">
              
              {/* Image Container with HUD effect */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={p.image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* HUD Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white tracking-[0.2em] uppercase">
                    Build_{idx + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/50">
                    <ExternalLink size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex gap-2 mb-4">
                  {p.stack.slice(0, 2).map((s, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                       <Tag size={10} className="text-cyan-500/50" />
                       {s}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {title}
                </h3>
                
                <p className="text-sm font-medium text-white/40 leading-relaxed mb-8 flex-1">
                  {desc}
                </p>

                {/* Status Bar */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Terminal size={12} className="text-cyan-400/60" />
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Deployment_Live</span>
                   </div>
                   <a 
                     href={p.href} 
                     target="_blank" 
                     className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors"
                   >
                     {lang === 'ar' ? 'عرض العمل' : 'View Work'} →
                   </a>
                </div>
              </div>

              {/* Interaction Light */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/0 via-transparent to-white/0 group-hover:from-cyan-500/[0.05] transition-all duration-700" />
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
