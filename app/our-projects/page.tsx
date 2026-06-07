"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { useApp } from "@/app/providers";
import { ChevronDown } from "lucide-react";
import { endSlideTransition } from "@/lib/pageTransition";

export default function OurProjectsPage() {
  const { lang } = useApp();
  const isRtl = lang === "ar" || lang === "ku";

  const copy = {
    eyebrow: lang === "ar" ? "معرض الأعمال" : lang === "ku" ? "گەلەری کار" : "Portfolio",
    title:
      lang === "ar"
        ? "استكشف الأعمال التي أنشأناها للشركات والعلامات التجارية"
        : lang === "ku"
        ? "کارەکانی دروستکراومان بۆ کۆمپانیا و براندەکان ببینە"
        : "Explore the work we’ve created for businesses and brands.",
    hint:
      lang === "ar"
        ? "اسحب للأسفل لاستكشاف مشاريعنا"
        : lang === "ku"
        ? "بۆ خوارەوە بۆ بینینی پڕۆژەکان"
        : "Scroll to explore our projects",
  };

  const slideToProjects = () => {
    const el = document.getElementById("our-projects");
    if (!el) return;
    const lenis = (window as Window & {
      lenis?: { scrollTo: (t: Element | number, o?: { offset?: number; duration?: number; immediate?: boolean }) => void };
    }).lenis;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reveal the page by sliding the transition curtain out (if it exists).
  useEffect(() => {
    endSlideTransition();
  }, []);

  // On entry: start at the top, then glide down to the projects section.
  useEffect(() => {
    let cancelled = false;
    const lenisWin = window as Window & {
      lenis?: { scrollTo: (t: Element | number, o?: { offset?: number; duration?: number; immediate?: boolean }) => void };
    };

    const lenis = lenisWin.lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      if (!cancelled) slideToProjects();
    }, 850);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Intro hero — the "from" point of the slide */}
      <section className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--accent-bright)]/10 blur-[120px]" />
        </div>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--accent-muted)] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] theme-accent">
          {copy.eyebrow}
        </span>

        <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight theme-heading sm:text-5xl md:text-6xl">
          {copy.title}
        </h1>

        <button
          onClick={slideToProjects}
          className="group mt-12 flex flex-col items-center gap-3 text-[var(--text-muted)] transition-colors hover:text-[var(--accent-glow)]"
        >
          <span className="text-xs font-bold tracking-wide">{copy.hint}</span>
          <ChevronDown size={26} className="animate-bounce transition-transform group-hover:translate-y-1" />
        </button>
      </section>

      <ProjectsGrid />

      <Footer />
    </div>
  );
}
