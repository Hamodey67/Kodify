"use client";

import { useApp } from "@/app/providers";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltCard from "@/components/TiltCard";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client (prevents a flash of un-hidden content before
// GSAP sets the initial states), useEffect on the server to avoid SSR warnings.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const projects = [
  {
    id: 1,
    ar: { title: "مجموعة باريزا", category: "عقارات واستثمار", desc: "منصة متكاملة لعرض المشاريع العقارية والاستثمارية وإدارتها باحترافية." },
    en: { title: "Bareza Group", category: "Real Estate", desc: "A comprehensive platform for showcasing and managing real estate and investment projects." },
    ku: { title: "کۆمەڵەی باریزا", category: "عەقارات", desc: "سەکۆیەکی گشتگیر بۆ پیشاندان و بەڕێوەبردنی پڕۆژە عەقاری و وەبەرهێنانەکان." },
    images: ["/bareza.png", "/barez1.png", "/barez2.png"],
    link: "https://barezagroup.com/en",
  },
  {
    id: 2,
    ar: { title: "سبينوزا كافيه", category: "ضيافة ومطاعم", desc: "تجربة مستخدم تفاعلية لطلب القهوة والمنتجات بكل سلاسة." },
    en: { title: "Spinoza Cafe", category: "Hospitality", desc: "An interactive user experience for ordering coffee and products seamlessly." },
    ku: { title: "سبینۆزا کافێ", category: "چێشتخانە", desc: "ئەزموونێکی کارلێکەری بەکارهێنەر بۆ داواکردنی قاوە و بەرهەمەکان بە شێوەیەکی ئاسان." },
    images: ["/spinoza.png", "/spinoza2.png", "/spinoza3.png"],
    link: "https://spinozacafe.com/en",
  },
  {
    id: 3,
    ar: { title: "بابليون جيتس", category: "فن وتصميم", desc: "معرض رقمي يسلط الضوء على الأعمال الفنية بلمسة عصرية." },
    en: { title: "Babylon Gates", category: "Art & Design", desc: "A digital gallery highlighting artworks with a modern touch." },
    ku: { title: "بابلیۆن گەیتس", category: "هونەر و دیزاین", desc: "پێشانگایەکی دیجیتاڵی کە تیشک دەخاتە سەر کارە هونەرییەکان بە شێوازێکی سەردەمیانە." },
    images: ["/1.png", "/2.png", "/3.png"],
    link: "https://babylongates.art/",
  },
  {
    id: 4,
    ar: { title: "أدم سبورت", category: "متجر رياضي", desc: "منصة تجارة إلكترونية متكاملة لبيع الملابس والمستلزمات الرياضية." },
    en: { title: "ADMSPOORT", category: "Sports Store", desc: "An integrated e-commerce platform for selling sportswear and equipment." },
    ku: { title: "ئەدم سپۆرت", category: "فرۆشگای وەرزشی", desc: "سەکۆیەکی بازرگانی ئەلیکترۆنی بۆ فرۆشتنی جلوبەرگ و پێداویستییە وەرزشییەکان." },
    images: ["/admsop1.png"],
    link: "https://admspoort.com/",
  },
  {
    id: 5,
    ar: { title: "نظام POS", category: "مبيعات وكاشير", desc: "نظام مبيعات عالي الأداء للموبايل والتابلت مع حساب ضرائب فوري وواجهة تاتش." },
    en: { title: "Sales POS", category: "Retail & POS", desc: "High-performance POS for mobile and tablet with instant tax calculation and touch UI." },
    ku: { title: "سیستەمی POS", category: "فرۆشتن و کاشێر", desc: "سیستەمی فرۆشتنی خێرا بۆ مۆبایل و تابلێت لەگەڵ حیسابکردنی خێرای باج." },
    images: ["/demos/pos/i1.webp", "/demos/pos/i2.webp", "/demos/pos/i3.webp"],
    link: "/simulator/",
  },
];

function ProjectSlider({ images }: { images: string[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#0a1424]">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-in-out",
            i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
          )}
        />
      ))}

      {/* Soft blend into the content panel below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-10 bg-gradient-to-t from-[#020B18] to-transparent" />

      {images.length > 1 && (
        <div className="absolute top-4 end-4 z-20 flex gap-1.5">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 rounded-full transition-all duration-500",
                index === i ? "bg-[var(--accent-bright)] h-4 shadow-[0_0_12px_var(--accent-bright)]" : "bg-white/30 h-1.5"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  lang,
  isRtl,
  touchDevice,
}: {
  project: Project;
  lang: string;
  isRtl: boolean;
  touchDevice: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const content = lang === "ar" ? project.ar : lang === "ku" ? project.ku : project.en;

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleEnter = () => {
    if (touchDevice) return;
    const card = cardRef.current;
    if (!card || prefersReduced()) return;
    gsap.to(card, { y: -10, duration: 0.45, ease: "back.out(2.2)", overwrite: "auto" });
    gsap.to(card.querySelector(".pg-glow"), { autoAlpha: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    gsap.to(card.querySelector(".pg-arrow"), {
      x: isRtl ? -4 : 4,
      y: -4,
      duration: 0.35,
      ease: "back.out(3)",
      overwrite: "auto",
    });
    gsap.to(card.querySelector(".pg-explore"), {
      boxShadow: "0 0 26px rgba(91,164,255,0.55)",
      borderColor: "rgba(133,189,255,0.6)",
      duration: 0.35,
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    if (touchDevice) return;
    const card = cardRef.current;
    if (!card || prefersReduced()) return;
    gsap.to(card, { y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    gsap.to(card.querySelector(".pg-glow"), { autoAlpha: 0, duration: 0.4, overwrite: "auto" });
    gsap.to(card.querySelector(".pg-arrow"), { x: 0, y: 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
    gsap.to(card.querySelector(".pg-explore"), {
      boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
      borderColor: "rgba(255,255,255,0.2)",
      duration: 0.4,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={touchDevice ? undefined : handleEnter}
      onMouseLeave={touchDevice ? undefined : handleLeave}
      className={cn(
        "pg-card group flex h-full w-full min-w-0 flex-col lg:min-w-0",
        !touchDevice && "[will-change:transform,opacity]"
      )}
    >
      <TiltCard
        maxRotate={4}
        glare={true}
        className="flex h-full w-full max-md:h-auto flex-col rounded-[2rem] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden cursor-pointer relative"
      >
        <div className="relative flex h-full max-md:h-auto w-full flex-col max-md:transform-none md:[transform:translateZ(30px)]">
          {/* Image — fixed ratio, fills container edge-to-edge */}
          <div className="pg-image relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-[2rem] bg-[#0a1424]">
            <div className="pg-parallax absolute inset-0 h-full w-full [will-change:transform]">
              <div className="pg-hoverzoom absolute inset-0 h-full w-full transition-[transform,filter] duration-500 ease-out max-md:scale-100 group-hover:max-md:scale-100 group-hover:scale-[1.04]">
                <ProjectSlider images={project.images} />
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="relative z-20 flex flex-1 flex-col bg-[#020B18] border-t border-white/[0.06] p-4 sm:p-5 lg:p-5">
            <span className="pg-reveal mb-3 inline-flex w-fit px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--accent-glow)] text-[9px] font-extrabold uppercase tracking-[0.14em]">
              {content.category}
            </span>

            <h3
              className={cn(
                "pg-reveal mb-2.5 text-lg lg:text-xl font-extrabold text-white tracking-tight leading-snug",
                isRtl && "font-[family-name:var(--font-cairo)]"
              )}
            >
              {content.title}
            </h3>

            <p
              className={cn(
                "pg-reveal mb-4 flex-1 text-xs lg:text-sm font-medium text-white/62 leading-[1.7] text-start",
                isRtl && "font-[family-name:var(--font-cairo)] leading-[1.85]"
              )}
            >
              {content.desc}
            </p>

            <a
              href={project.link}
              target={project.link.startsWith("http") ? "_blank" : undefined}
              rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="pg-reveal pg-explore mt-auto inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-xs hover:bg-white hover:text-slate-950 hover:border-transparent transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {lang === "ar" ? "استكشف المشروع" : lang === "ku" ? "پڕۆژەکە ببینە" : "Explore Project"}
              <ArrowUpRight size={15} className="pg-arrow shrink-0" />
            </a>
          </div>

          {/* Decorative ambience elements (slow floating) */}
          <div className="pg-float pointer-events-none absolute top-[20%] right-4 w-24 h-24 bg-[var(--accent-bright)]/10 blur-[60px] -z-10 rounded-full group-hover:bg-[var(--accent-bright)]/20 transition-colors duration-700" />
          <div className="pg-float pointer-events-none absolute bottom-[30%] left-4 w-32 h-32 bg-[var(--accent-glow)]/10 blur-[80px] -z-10 rounded-full group-hover:bg-[var(--accent-bright)]/20 transition-colors duration-700" />

          {/* Hover border glow */}
          <div className="pg-glow pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 z-30 border border-[var(--accent-glow)]/40 shadow-[0_0_40px_-4px_var(--accent-glow),inset_0_0_24px_-8px_var(--accent-glow)]" />
        </div>
      </TiltCard>
    </div>
  );
}

export default function ProjectsGrid() {
  const { lang } = useApp();
  const isRtl = lang === "ar" || lang === "ku";
  const rootRef = useRef<HTMLElement | null>(null);
  const [touchDevice, setTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouchDevice(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const heading = lang === "ar" ? "مشاريعنا" : lang === "ku" ? "پڕۆژەکانمان" : "Our Projects";
  const subtitle =
    lang === "ar"
      ? "استكشف الأعمال التي أنشأناها للشركات والعلامات التجارية."
      : lang === "ku"
      ? "کارەکانی دروستکراومان بۆ کۆمپانیا و براندەکان ببینە."
      : "Explore the work we’ve created for businesses and brands.";

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // All motion lives inside the no-preference branch, so users who request
      // reduced motion simply keep the default (fully visible, static) layout.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

        const line = root.querySelector<HTMLElement>(".pg-accent-line");
        const head = root.querySelector<HTMLElement>(".pg-heading");
        const sub = root.querySelector<HTMLElement>(".pg-subtitle");
        const cards = q(".pg-card");

        // Mobile / tablet: static cards — no scroll-driven transforms during horizontal swipe
        mm.add("(max-width: 1023px)", () => {
          if (line) gsap.set(line, { scaleX: 1, transformOrigin: isRtl ? "right center" : "left center" });
          if (head) gsap.set(head, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          if (sub) gsap.set(sub, { autoAlpha: 1, y: 0 });
          gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
          gsap.set(q(".pg-reveal"), { autoAlpha: 1, y: 0 });
        });

        // Desktop: full entrance animations
        mm.add("(min-width: 1024px)", () => {
          if (line) gsap.set(line, { scaleX: 0, transformOrigin: isRtl ? "right center" : "left center" });
          if (head) gsap.set(head, { autoAlpha: 0, y: 30, filter: "blur(12px)" });
          if (sub) gsap.set(sub, { autoAlpha: 0, y: 20 });
          gsap.set(cards, { autoAlpha: 0, y: 60, scale: 0.94 });
          gsap.set(q(".pg-reveal"), { autoAlpha: 0, y: 24 });

          const headerTl = gsap.timeline({
            scrollTrigger: { trigger: root, start: "top 78%" },
          });
          if (line) headerTl.to(line, { scaleX: 1, duration: 0.7, ease: "power3.out" });
          if (head)
            headerTl.to(
              head,
              { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
              "-=0.2"
            );
          if (sub)
            headerTl.to(
              sub,
              { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
              "-=0.45"
            );

          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) => {
              batch.forEach((card, i) => {
                const inner = card.querySelectorAll(".pg-reveal");
                const tl = gsap.timeline({ delay: i * 0.12 });
                tl.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" })
                  .to(
                    inner,
                    { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
                    "-=0.42"
                  );
              });
            },
          });
        });

        // ---- Per-card background parallax (desktop only) ----
        mm.add("(min-width: 768px)", () => {
          cards.forEach((card) => {
            const parallax = card.querySelector<HTMLElement>(".pg-parallax");
            if (parallax) {
              gsap.fromTo(
                parallax,
                { yPercent: -4, scale: 1.08 },
                {
                  yPercent: 4,
                  scale: 1.04,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            }

            card.querySelectorAll<HTMLElement>(".pg-float").forEach((f, i) => {
              gsap.to(f, {
                y: i % 2 === 0 ? -16 : 16,
                x: i % 2 === 0 ? 8 : -8,
                duration: 5 + i * 1.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              });
            });
          });
        });

        ScrollTrigger.refresh();
      });
    }, root);

    // Keep trigger positions accurate after images load and on resize.
    const imgs = Array.from(root.querySelectorAll("img"));
    const onImg = () => ScrollTrigger.refresh();
    imgs.forEach((img) => {
      if (!(img as HTMLImageElement).complete) img.addEventListener("load", onImg);
    });
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      imgs.forEach((img) => img.removeEventListener("load", onImg));
      ctx.revert();
    };
  }, [isRtl, lang]);

  return (
    <section
      ref={rootRef}
      id="our-projects"
      dir={isRtl ? "rtl" : "ltr"}
      className="pg-section pt-16 sm:pt-24 md:pt-32 pb-12 md:pb-20 relative scroll-mt-48 overflow-x-clip"
    >
      <div className="mx-auto max-w-[90rem] w-full min-w-0 px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mb-8 sm:mb-10 md:mb-12">
          <div className="pg-accent-line h-1 sm:h-1.5 w-16 sm:w-[72px] mb-5 sm:mb-6 rounded-full bg-gradient-to-r from-[var(--accent-soft)] via-[var(--accent)] to-[var(--accent-strong)] shadow-[0_0_16px_var(--accent-glow)]" />

          <h2 className="pg-heading font-black tracking-tight text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 theme-heading [will-change:transform,opacity,filter]">
            {heading}
          </h2>

          <p className="pg-subtitle leading-relaxed font-medium theme-muted text-base sm:text-lg max-w-2xl border-s-2 border-[var(--accent-border)] ps-4 sm:ps-5">
            {subtitle}
          </p>
        </div>

        {/* Single row — 5 columns desktop, smooth horizontal scroll mobile */}
        <div className="relative min-w-0">
          <div
            data-lenis-prevent
            className="pg-projects-track flex w-full min-w-0 gap-4 overflow-x-auto overscroll-x-contain pb-3 snap-x snap-proximity scrollbar-none sm:gap-5 lg:grid lg:grid-cols-5 lg:items-stretch lg:overflow-visible lg:gap-6 lg:snap-none lg:pb-0"
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex h-full w-[85vw] max-w-[300px] shrink-0 snap-center sm:w-[280px] lg:w-auto lg:max-w-none lg:shrink"
              >
                <ProjectCard project={project} lang={lang} isRtl={isRtl} touchDevice={touchDevice} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
