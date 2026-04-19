"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";
import LogoMark from "./LogoMark";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Globe, Menu, X, Rocket, ShieldCheck } from "lucide-react";

type Lang = "ar" | "en" | "ku";

export default function Navbar() {
  const { lang, setLang } = useApp() as { lang: Lang; setLang: (l: Lang) => void };
  const tx = t[lang];
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const isRtl = lang === "ar" || lang === "ku";
  const { scrollY } = useScroll();
  const langRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
    // Hide past 'Why us' section (~1200px)
    setHidden(latest > 1200);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tagline =
    lang === "ar"
      ? "تطور • أمان • أداء"
      : lang === "ku"
      ? "گەشە • ئاسایش • ئەدا"
      : "Logic • Security • Speed";

  const navItems = useMemo(
    () => [
      { href: "/", label: tx.nav.home },
      { href: "/services/", label: tx.nav.services },
      { href: "/projects/", label: tx.nav.projects },
      { href: "/blog/", label: tx.nav.blog },
    ],
    [tx.nav]
  );

  const langs: { key: Lang; label: string }[] = [
    { key: "ar", label: "العربية" },
    { key: "en", label: "English" },
    { key: "ku", label: "کوردی" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-[100] transition-all duration-700 py-4 md:py-6 px-4 md:px-0",
          scrolled ? "md:top-4" : "top-0",
          hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
        <nav 
          className={cn(
            "mx-auto transition-all duration-500 flex items-center justify-between",
            scrolled 
              ? "max-w-4xl bg-slate-950/60 backdrop-blur-3xl border border-white/10 rounded-3xl px-6 py-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)]" 
              : "max-w-7xl bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl px-6 py-2"
          )}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
               <motion.div 
                 animate={{ rotate: scrolled ? 360 : 0 }}
                 transition={{ duration: 1 }}
                 className="relative z-10"
               >
                 <LogoMark />
               </motion.div>
               <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-black text-lg text-white tracking-tight">{tx.brand}</div>
              <div className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">{tagline}</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className="relative px-5 py-2 group overflow-hidden"
                >
                  <span className={cn(
                    "relative z-10 text-sm font-bold transition-colors duration-300",
                    active ? "text-white" : "text-white/40 group-hover:text-white"
                  )}>
                    {it.label}
                  </span>
                  {active && (
                    <motion.div 
                      layoutId="navActive"
                      className="absolute inset-0 bg-white/5 rounded-xl border border-white/5"
                    />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-500 group-hover:w-1/2 transition-all duration-300 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher (Click based) */}
            <div className="relative" ref={langRef}>
               <button 
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all border",
                  langOpen ? "bg-white/10 border-white/20" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08]"
                )}
               >
                  <Globe size={16} className={langOpen ? "text-cyan-400" : "text-white/40"} />
                  <span className="text-xs font-black text-white/80">{lang.toUpperCase()}</span>
                  <ChevronDown size={14} className={cn("text-white/20 transition-transform", langOpen && "rotate-180")} />
               </button>
               
               <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 z-[110]"
                  >
                    <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] min-w-[150px]">
                      {langs.map((l) => (
                        <button
                          key={l.key}
                          onClick={() => {
                            setLang(l.key);
                            setLangOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black tracking-wider transition-all mb-1 last:mb-0",
                            l.key === lang ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-white/50 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {l.label}
                          {l.key === lang && <motion.div layoutId="activeDot" className="w-1 h-1 bg-white rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>

            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-black text-sm hover:scale-105 transition-transform"
            >
              <Rocket size={16} />
              {tx.nav.contact}
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setOpen(!open)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] lg:hidden"
          >
            {/* Backdrop with heavy blur */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setOpen(false)} />
            
            <motion.div 
              initial={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute top-0 h-full w-[85%] max-w-sm bg-slate-900/95 border-white/10 p-8 flex flex-col pt-24 shadow-[0_0_100px_rgba(0,0,0,0.8)]",
                isRtl ? "left-0 border-r" : "right-0 border-l"
              )}
            >
               {/* Cyber Background Accent */}
               <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:30px_30px]" />
               </div>

               <div className="flex flex-col gap-2 relative z-10">
                  {navItems.map((it, idx) => {
                    const active = isActive(it.href);
                    return (
                      <motion.div
                        key={it.href}
                        initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                      >
                        <Link
                          href={it.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group relative flex items-center justify-between px-6 py-5 rounded-[2rem] transition-all duration-300",
                            active 
                              ? "bg-white/5 border border-white/10 text-white shadow-xl" 
                              : "text-white/40 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full transition-all duration-500",
                               active ? "bg-cyan-500 shadow-[0_0_10px_#22d3ee] scale-125" : "bg-white/10"
                             )} />
                             <span className={cn(
                               "text-xl font-black uppercase tracking-tight transition-colors",
                               active ? "text-white" : "group-hover:text-white/80"
                             )}>
                               {it.label}
                             </span>
                          </div>
                          
                          {active && (
                            <motion.div layoutId="activeMobileDot" className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
               </div>

               <div className="mt-auto relative z-10">
                 {/* Language HUD Control */}
                 <div className="p-1.5 bg-white/5 border border-white/5 rounded-[2rem] mb-6 flex gap-1">
                    {langs.map((l) => (
                      <button
                        key={l.key}
                        onClick={() => {
                          setLang(l.key);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex-1 py-3 px-2 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                          l.key === lang 
                            ? "bg-white text-black shadow-xl" 
                            : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
                        )}
                      >
                        {l.label.substring(0, 3)}
                      </button>
                    ))}
                 </div>

                 {/* Premium Contact Button */}
                 <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="group relative flex items-center justify-between w-full p-1 rounded-[2.5rem] bg-cyan-500 text-white overflow-hidden shadow-2xl shadow-cyan-500/20 active:scale-[0.98] transition-all"
                 >
                    <span className="ml-8 font-black text-lg uppercase tracking-wider">{tx.nav.contact}</span>
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                       <Rocket size={24} className={cn("transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1", isRtl && "rotate-[-90deg]")} />
                    </div>
                 </Link>
                 
                 <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
                       <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">System_Online_v4.0</span>
                    </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
