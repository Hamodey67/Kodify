"use client";

import Reveal from "./Reveal";
import { useApp } from "@/app/providers";
import { motion } from "framer-motion";
import { MessageSquare, ArrowUpRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  const { lang } = useApp();

  const title =
    lang === "ar"
      ? "تخطط لبناء شيء عظيم؟"
      : lang === "ku"
      ? "ئامادەی دەستپێکردنی پرۆژەکەتیت؟"
      : "Planning to build something great?";

  const desc =
    lang === "ar"
      ? "نحن نجمع بين الهندسة المتقدمة والتصميم الفخم لنحول فكرتك إلى واقع تقني ملموس يتخطى التوقعات."
      : lang === "ku"
      ? "با چارەسەرێکی Premium، پارێزراو و خێرا دروست بکەین — لە بیرۆکەوە بۆ بڵاوکردنەوە."
      : "We blend advanced engineering with elite design to turn your vision into a high-performance reality.";

  const btnContact =
    lang === "ar" ? "ابدأ رحلتك معنا" : lang === "ku" ? "پەیوەندی بکە" : "Launch Your Project";

  const btnServices =
    lang === "ar"
      ? "حلولنا التقنية"
      : lang === "ku"
      ? "خزمەتگوزارییەکان"
      : "Elite Solutions";

  return (
    <Reveal>
      <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl md:backdrop-blur-3xl p-10 md:p-16 shadow-2xl">
        {/* Background Animation Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-1000" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-start">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 mb-8"
            >
               <Zap size={14} className="text-cyan-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready for Deployment</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tight mb-6">
              {title}
            </h2>

            <p className="text-lg md:text-xl font-medium text-white/40 leading-relaxed max-w-xl">
              {desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto">
            <Link
              href="/contact"
              className="group/btn relative px-10 py-5 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <MessageSquare size={18} />
              {btnContact}
            </Link>

            <Link
              href="/services"
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 group/svc"
            >
              {btnServices}
              <ArrowUpRight size={18} className="text-white/40 group-hover/svc:text-white group-hover/svc:translate-x-1 group-hover/svc:-translate-y-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Footer info in CTA */}
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap gap-10 opacity-30">
           <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Full Post-Launch Support</span>
           </div>
           <div className="flex items-center gap-3">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Advanced Security Defaults</span>
           </div>
        </div>
      </div>
    </Reveal>
  );
}
