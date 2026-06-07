"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";
import LogoMark from "./LogoMark";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Fingerprint, Globe, Menu, ShieldAlert, X, Rocket, ShieldCheck } from "lucide-react";
type Lang = "ar" | "en" | "ku";

export default function Navbar() {
  const { lang, setLang } = useApp() as { lang: Lang; setLang: (l: Lang) => void };
  const tx = t[lang];
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const isRtl = lang === "ar" || lang === "ku";
  const { scrollY } = useScroll();
  const langRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);

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
      if (securityRef.current && !securityRef.current.contains(event.target as Node)) {
        setSecurityOpen(false);
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
      { href: "/our-projects/", label: tx.nav.projects },
      { href: "/simulator/", label: tx.nav.phoneDemo },
    ],
    [tx.nav]
  );

  const scrollToHash = (href: string) => {
    if (!href.includes("#")) return;
    const id = href.split("#")[1];
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as Window & { lenis?: { scrollTo: (t: Element | string, o?: { offset?: number }) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -120 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#") && (pathname === "/" || pathname === "")) {
      scrollToHash(href);
    }
    setOpen(false);
  };

  const langs: { key: Lang; label: string }[] = [
    { key: "ar", label: "العربية" },
    { key: "en", label: "English" },
    { key: "ku", label: "کوردی" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const normalized = href.replace(/\/$/, "");
    const path = pathname.replace(/\/$/, "") || "/";
    return path === normalized || path.startsWith(`${normalized}/`);
  };

  const securityLinks = useMemo(
    () => [
      { href: "/login-demo/", label: tx.nav.fakeLogin, icon: Fingerprint },
      { href: "/phishing/", label: tx.nav.phishingSim, icon: ShieldAlert },
    ],
    [tx.nav.fakeLogin, tx.nav.phishingSim]
  );

  const isSecurityActive = securityLinks.some((l) => isActive(l.href));

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-[100] transition-all duration-700 py-3 md:py-6 px-3 sm:px-4 md:px-0",
          scrolled ? "md:top-4" : "top-0",
          hidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
        <nav 
          className={cn(
            "mx-auto max-w-7xl theme-nav border shadow-[var(--shadow)]",
            "grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4",
            "transition-[padding,border-radius,backdrop-filter,box-shadow] duration-500",
            scrolled
              ? "backdrop-blur-xl md:backdrop-blur-3xl rounded-3xl px-4 sm:px-5 py-2.5"
              : "backdrop-blur-md md:backdrop-blur-md rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5"
          )}
        >
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative shrink-0">
               <motion.div 
                 animate={{ rotate: scrolled ? 360 : 0 }}
                 transition={{ duration: 1 }}
                 className="relative z-10"
               >
                 <LogoMark compact={scrolled} />
               </motion.div>
               <div className="absolute inset-0 bg-[var(--accent-primary)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block leading-tight min-w-0">
              <div className={cn(
                "font-black text-brand-logo tracking-tight truncate transition-[font-size] duration-300",
                scrolled ? "text-base" : "text-lg"
              )}>{tx.brand}</div>
              <div className={cn(
                "text-[10px] font-bold text-brand-logo-muted tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden",
                scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
              )}>{tagline}</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center justify-center gap-0.5 shrink min-w-0">
            {navItems.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => handleNavClick(it.href)}
                  className={cn(
                    "relative group overflow-hidden whitespace-nowrap shrink-0 transition-[padding] duration-300",
                    scrolled ? "px-3 py-1.5" : "px-4 py-2"
                  )}
                >
                  <span className={cn(
                    "relative z-10 text-sm font-bold transition-colors duration-300",
                    active
                      ? "text-[var(--accent-primary)] nav-active-text"
                      : "text-[var(--text-muted)] group-hover:text-[var(--heading)]"
                  )}>
                    {it.label}
                  </span>
                  {active && (
                    <motion.div 
                      layoutId="navActive"
                      className="absolute inset-0 bg-[var(--accent-primary)]/8 rounded-xl border border-[var(--accent-primary)]/15"
                    />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--accent-primary)] group-hover:w-1/2 transition-all duration-300 opacity-60" />
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            {/* Security training dropdown */}
            <div className="relative hidden lg:block" ref={securityRef}>
              <button
                type="button"
                onClick={() => {
                  setSecurityOpen(!securityOpen);
                  setLangOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 transition-all",
                  securityOpen || isSecurityActive
                    ? "border-[var(--border-strong)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] bg-[var(--accent-muted)]/50 hover:bg-[var(--accent-muted)]"
                )}
              >
                <ShieldCheck
                  size={16}
                  className={securityOpen || isSecurityActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}
                />
                <span className="max-w-[7rem] truncate text-xs font-black text-[var(--heading)]">
                  {tx.nav.securityTraining}
                </span>
                <ChevronDown
                  size={14}
                  className={cn("text-[var(--text-muted)] transition-transform", securityOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {securityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={cn("absolute top-full z-[110] mt-3 min-w-[220px]", isRtl ? "right-0" : "left-0")}
                  >
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-2 shadow-[var(--card-shadow)] backdrop-blur-3xl">
                      {securityLinks.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setSecurityOpen(false);
                              setOpen(false);
                            }}
                            className={cn(
                              "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[11px] font-black tracking-wide transition-all last:mb-0",
                              active
                                ? "bg-[var(--accent-primary)] text-white shadow-lg"
                                : "text-[var(--text-muted)] hover:bg-[var(--accent-muted)] hover:text-[var(--heading)]"
                            )}
                          >
                            <Icon size={15} aria-hidden />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher (Click based) */}
            <div className="relative" ref={langRef}>
                <button 
                 onClick={() => {
                   setLangOpen(!langOpen);
                   setSecurityOpen(false);
                 }}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2 rounded-xl transition-all border",
                   langOpen
                     ? "bg-[var(--accent-muted)] border-[var(--border-strong)]"
                     : "bg-[var(--accent-muted)]/50 border-[var(--border)] hover:bg-[var(--accent-muted)]"
                 )}
                >
                   <Globe size={16} className={langOpen ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"} />
                  <span className="text-xs font-black text-[var(--heading)]">{lang.toUpperCase()}</span>
                  <ChevronDown size={14} className={cn("text-[var(--text-muted)] transition-transform", langOpen && "rotate-180")} />
               </button>
               
               <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 z-[110]"
                  >
                    <div className="bg-[var(--bg-surface)] backdrop-blur-3xl border border-[var(--border)] rounded-2xl p-2 shadow-[var(--card-shadow)] min-w-[150px]">
                      {langs.map((l) => (
                        <button
                          key={l.key}
                          onClick={() => {
                            setLang(l.key);
                            setLangOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black tracking-wider transition-all mb-1 last:mb-0",
                            l.key === lang
                              ? "bg-[var(--accent-primary)] text-white shadow-lg"
                              : "text-[var(--text-muted)] hover:bg-[var(--accent-muted)] hover:text-[var(--heading)]"
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
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] text-white font-black text-sm hover:scale-105 hover:opacity-90 transition-all whitespace-nowrap shrink-0",
                scrolled ? "px-4 py-2" : "px-5 py-2.5"
              )}
            >
              <Rocket size={16} />
              {tx.nav.contact}
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setOpen(!open)}
              className="p-2.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--border)] text-[var(--heading)] lg:hidden"
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[#020810]/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.aside
              initial={{ x: isRtl ? "-100%" : "100%", opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? "-100%" : "100%", opacity: 0.6 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className={cn(
                "absolute top-0 flex h-full w-[88%] max-w-[340px] flex-col",
                "border-white/[0.08] bg-[#06111f]/92 backdrop-blur-2xl",
                "shadow-[0_0_60px_rgba(0,0,0,0.55)]",
                isRtl ? "left-0 border-r" : "right-0 border-l"
              )}
              aria-label={lang === "ar" ? "القائمة" : "Navigation menu"}
            >
              {/* Ambient accents */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-24 start-0 h-56 w-56 rounded-full bg-[var(--accent-primary)]/10 blur-[80px]" />
                <div className="absolute bottom-24 end-0 h-48 w-48 rounded-full bg-cyan-400/8 blur-[70px]" />
                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(91,164,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(91,164,255,0.45) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
              </div>

              {/* Scrollable nav */}
              <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-[5.5rem] sm:px-6">
                <nav className="flex flex-col gap-1.5" aria-label="Main">
                  {navItems.map((it, idx) => {
                    const active = isActive(it.href);
                    return (
                      <motion.div
                        key={it.href}
                        initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + idx * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={it.href}
                          onClick={() => handleNavClick(it.href)}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 ease-out",
                            active
                              ? "border border-[var(--accent-primary)]/25 bg-gradient-to-r from-[var(--accent-primary)]/16 via-[var(--accent-primary)]/8 to-white/[0.02] shadow-[0_0_28px_rgba(43,127,255,0.14)] backdrop-blur-md"
                              : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                          )}
                        >
                          {active && (
                            <span
                              className={cn(
                                "absolute inset-y-2.5 w-[3px] rounded-full bg-gradient-to-b from-[var(--accent-primary)] to-[#85bdff] shadow-[0_0_10px_rgba(43,127,255,0.65)]",
                                isRtl ? "right-0" : "left-0"
                              )}
                            />
                          )}
                          <span className="flex w-5 shrink-0 items-center justify-center">
                            <span
                              className={cn(
                                "rounded-full transition-all duration-200",
                                active
                                  ? "h-2 w-2 bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]"
                                  : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/45"
                              )}
                            />
                          </span>
                          <span
                            className={cn(
                              "min-w-0 flex-1 text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-200",
                              active
                                ? "text-white"
                                : "text-white/55 group-hover:text-white/90"
                            )}
                          >
                            {it.label}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Soft divider */}
                <div
                  className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent"
                  aria-hidden
                />

                {/* Security training */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.35 }}
                >
                  <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/38">
                    {tx.nav.securityTraining}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {securityLinks.map((item, idx) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.36 + idx * 0.06,
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={cn(
                              "group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ease-out",
                              active
                                ? "border border-[var(--accent-primary)]/25 bg-gradient-to-r from-[var(--accent-primary)]/14 via-[var(--accent-primary)]/6 to-transparent shadow-[0_0_24px_rgba(43,127,255,0.12)] backdrop-blur-md"
                                : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                            )}
                          >
                            {active && (
                              <span
                                className={cn(
                                  "absolute inset-y-2.5 w-[3px] rounded-full bg-gradient-to-b from-[var(--accent-primary)] to-[#85bdff] shadow-[0_0_10px_rgba(43,127,255,0.65)]",
                                  isRtl ? "right-0" : "left-0"
                                )}
                              />
                            )}
                            <span className="flex w-5 shrink-0 items-center justify-center">
                              <Icon
                                size={17}
                                strokeWidth={active ? 2.25 : 2}
                                className={cn(
                                  "transition-colors duration-200",
                                  active ? "text-[var(--accent-primary)]" : "text-white/40 group-hover:text-white/70"
                                )}
                              />
                            </span>
                            <span
                              className={cn(
                                "min-w-0 flex-1 text-sm font-medium leading-snug transition-colors duration-200",
                                active ? "text-white" : "text-white/55 group-hover:text-white/90"
                              )}
                            >
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Footer controls */}
              <div className="relative z-10 shrink-0 border-t border-white/[0.06] bg-[#06111f]/80 px-5 py-5 backdrop-blur-xl sm:px-6">
                {/* Language segmented control */}
                <div className="relative mb-4 flex rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1 backdrop-blur-md">
                  {langs.map((l) => {
                    const selected = l.key === lang;
                    return (
                      <button
                        key={l.key}
                        type="button"
                        onClick={() => {
                          setLang(l.key);
                          setOpen(false);
                        }}
                        className={cn(
                          "relative z-10 flex-1 rounded-xl px-2 py-2.5 text-[11px] font-semibold tracking-wide transition-colors duration-200",
                          selected ? "text-white" : "text-white/45 hover:text-white/75"
                        )}
                      >
                        {selected && (
                          <motion.span
                            layoutId="mobileSidebarLang"
                            className="absolute inset-0 rounded-xl bg-gradient-to-b from-[var(--accent-primary)] to-[#1a5fd6] shadow-[0_4px_18px_rgba(43,127,255,0.35)]"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{l.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Contact CTA */}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--accent-primary)] via-[#3d8bff] to-[#1c5fd6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_32px_rgba(43,127,255,0.32)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(43,127,255,0.42)] active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <Rocket size={17} className="relative z-10 shrink-0" />
                  <span className="relative z-10">{tx.nav.contact}</span>
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
