"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import { t, Lang } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Box, Cpu, ChevronRight, Share2, ShieldCheck, Zap } from "lucide-react";

import PhoneFrame from "./PhoneFrame";
import StoreDemo from "./demos/StoreDemo";
import MenuDemo from "./demos/MenuDemo";
import PosDemo from "./demos/PosDemo";

type TabKey = "store" | "menu" | "pos";

export default function ProjectsSection() {
  const { lang } = useApp() as { lang: Lang };
  const tx = t[lang ?? "ar"];
  const isRtl = lang === "ar" || lang === "ku";

  const [active, setActive] = useState<TabKey>("store");

  const tabs = useMemo(() => {
    return {
      store: {
        id: "STORE.v1",
        title: tx.projectsPage.tabs.store,
        desc: lang === "ar" 
          ? "متجر إلكتروني متكامل مع تجربة شراء واقعية، سلة تفاعلية، وتحكم كامل بالمنتجات." 
          : "Full e-commerce flow with real cart interactions and product management.",
        tech: ["Next.js 15", "TypeScript", "Tailwind", "i18n"],
        features: lang === "ar" ? ["سلة ذكية", "صفحة تفاصيل", "نظام طلبات"] : ["Smart Cart", "Product Details", "Order System"],
        demo: <StoreDemo />,
      },
      menu: {
        id: "MENU.v2",
        title: tx.projectsPage.tabs.menu,
        desc: lang === "ar" 
          ? "نظام منيو رقمي سريع للمطاعم، يدعم الأقسام المختلفة والطلب المباشر من الطاولة." 
          : "Fast digital menu for restaurants with categories and direct table ordering.",
        tech: ["React.js", "Motion", "i18n-Ally"],
        features: lang === "ar" ? ["أقسام ذكية", "طلب سريع", "ملاحظات الشيف"] : ["Categories", "Quick Order", "Chef Notes"],
        demo: <MenuDemo />,
      },
      pos: {
        id: "POS.v3",
        title: tx.projectsPage.tabs.pos,
        desc: lang === "ar" 
          ? "نظام مبيعات (كاشير) عالي الأداء، مخصص للأجهزة اللوحية والموبايل، مع حساب ضرائب فوري." 
          : "High-performance POS system for tablets and mobile with instant tax calculation.",
        tech: ["PostgreSQL", "Next.js", "Zustand"],
        features: lang === "ar" ? ["حساب فوري", "إدارة ضريبية", "واجهة تاتش"] : ["Instant Calc", "Tax Logic", "Touch UI"],
        demo: <PosDemo />,
      },
    } as const;
  }, [lang, tx]);

  const current = tabs[active];

  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 scroll-mt-48" id="projects">
      {/* HUD Style Section Header - More compact */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="relative">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 30 }}
            className="h-1 bg-cyan-500 rounded-full mb-3" 
          />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
            {tx.projectsPage.title}
          </h2>
          <p className="mt-3 text-white/40 font-medium text-base max-w-lg">
             {tx.projectsPage.desc}
          </p>
        </div>
      </div>

      {/* Main Unified Dashboard Container */}
      <div className="relative group">
        {/* Glow behind dashboard */}
        <div className="absolute -inset-10 bg-cyan-500/5 blur-[120px] rounded-[4rem] group-hover:bg-cyan-500/10 transition-colors duration-700" />
        
        <div className="relative rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
           <div className="grid lg:grid-cols-[1.1fr_.9fr] items-stretch">
             
             {/* Left Column: Data & Specs - Tighter padding */}
             <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                       <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-widest text-cyan-400">
                         {current.id}
                       </span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
                      {current.title}
                    </h3>

                    <p className="text-lg md:text-xl font-medium text-white/40 leading-snug mb-8 max-w-lg">
                      {current.desc}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-8 mb-12">
                       <div>
                          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                             <Cpu size={12} />
                             {tx.projectsPage.meta.stack}
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {current.tech.map(t => (
                               <span key={t} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/60">
                                 {t}
                               </span>
                             ))}
                          </div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                             <Box size={12} />
                             {tx.projectsPage.meta.highlights}
                          </div>
                          <div className="space-y-2">
                             {current.features.map(f => (
                               <div key={f} className="flex items-center gap-2 text-sm font-bold text-white/80">
                                 <ShieldCheck size={14} className="text-cyan-500" />
                                 {f}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-10">
                       <a 
                        href="/contact"
                        className="flex-1 sm:flex-none px-10 py-5 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all"
                       >
                         {tx.projectsPage.cta.contact}
                         <ArrowRight size={18} />
                       </a>
                       <button className="flex-1 sm:flex-none px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                          <Share2 size={18} className="text-white/40" />
                          {lang === "ar" ? "مشاركة" : "Share"}
                       </button>
                    </div>

                    {/* Tabs moved here as per user request */}
                    <div>
                      <div className="inline-flex p-1 rounded-[1.4rem] bg-white/[0.04] border border-white/5 backdrop-blur-xl">
                        {(Object.keys(tabs) as TabKey[]).map((k) => (
                          <button
                            key={k}
                            onClick={() => setActive(k)}
                            className={cn(
                              "relative h-10 px-6 rounded-[1.1rem] text-[11px] font-black transition-all duration-300",
                              active === k ? "text-black" : "text-white/30 hover:text-white"
                            )}
                          >
                            {active === k && (
                              <motion.div 
                                layoutId="activeProjTab"
                                className="absolute inset-0 bg-white" 
                                style={{ borderRadius: 'inherit' }}
                              />
                            )}
                            <span className="relative z-10 uppercase tracking-wider">{tabs[k].title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
             </div>

             {/* Right Column: Phone Playground - Scaled down */}
             <div className="relative bg-slate-950/40 p-10 md:p-14 flex items-center justify-center overflow-hidden">
                {/* Visual accents behind phone */}
                <div className="absolute inset-0 pointer-events-none">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)]" />
                   <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03]">
                      {[...Array(36)].map((_, i) => <div key={i} className="border-[0.5px] border-white" />)}
                   </div>
                </div>

                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 0.92, y: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="relative z-10"
                >
                  <PhoneFrame>
                    {current.demo}
                  </PhoneFrame>
                </motion.div>

                {/* Floating Technical Badge */}
                <div className="absolute bottom-10 right-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-500 shadow-xl shadow-cyan-500/20">
                   <Zap size={16} className="text-white" fill="white" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE_PREVIEW_REACTIVE</span>
                </div>
             </div>

           </div>
        </div>
      </div>
    </section>
  );
}
