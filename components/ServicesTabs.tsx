"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  type Variants,
} from "framer-motion";
import { useApp } from "@/app/providers";
import { startSlideTransition } from "@/lib/pageTransition";
import {
  Code,
  Cloud,
  ShieldCheck,
  LayoutDashboard,
  Globe,
  Layers,
  Cpu,
  Server,
  Terminal,
  Database,
  Activity,
  Fingerprint,
  FileSearch,
  Users,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TabKey = "dev" | "cloud" | "sec";
type Lang = "ar" | "en" | "ku";

const TAB_ORDER: TabKey[] = ["dev", "cloud", "sec"];

const tabsData: Record<
  TabKey,
  {
    ar: { tabName: string; title: string; desc: string; cards: { name: string; icon: typeof Code }[] };
    en: { tabName: string; title: string; desc: string; cards: { name: string; icon: typeof Code }[] };
    ku: { tabName: string; title: string; desc: string; cards: { name: string; icon: typeof Code }[] };
  }
> = {
  dev: {
    ar: {
      tabName: "تطوير برمجيات",
      title: "تطوير البرمجيات والنظم",
      desc: "حلول متكاملة تشمل تطبيقات الويب، أنظمة ERP، إدارة الموارد، ولوحات التحكم المخصصة.",
      cards: [
        { name: "مواقع وتطبيقات", icon: Globe },
        { name: "لوحات تحكم ذكية", icon: LayoutDashboard },
        { name: "تكامل APIs", icon: Cpu },
        { name: "أنظمة ERP/CRM", icon: Layers },
      ],
    },
    en: {
      tabName: "Software Dev",
      title: "Software & Systems Development",
      desc: "Comprehensive solutions including web applications, ERP systems, resource management, and custom dashboards.",
      cards: [
        { name: "Web & Mobile Apps", icon: Globe },
        { name: "Smart Dashboards", icon: LayoutDashboard },
        { name: "API Integrations", icon: Cpu },
        { name: "ERP/CRM Systems", icon: Layers },
      ],
    },
    ku: {
      tabName: "گەشەپێدانی سۆفتوێر",
      title: "گەشەپێدانی سۆفتوێر و سیستەم",
      desc: "چارەسەری تەواو لە بیرۆکەوە بۆ جێبەجێکردن و پشتگیری سیستەمی کۆمپانیاکان.",
      cards: [
        { name: "ماڵپەڕ و ئەپڵیکەیشن", icon: Globe },
        { name: "داشبۆردی زیرەک", icon: LayoutDashboard },
        { name: "یەکخستنی API", icon: Cpu },
        { name: "سیستەمی ERP/CRM", icon: Layers },
      ],
    },
  },
  cloud: {
    ar: {
      tabName: "تقنية سحابية",
      title: "التقنية السحابية",
      desc: "بنية تحتية سحابية موثوقة، نشر تطبيقات، إدارة خوادم، ونسخ احتياطي آلي.",
      cards: [
        { name: "إدارة خوادم", icon: Server },
        { name: "نشر تطبيقات", icon: Terminal },
        { name: "نسخ احتياطي", icon: Database },
        { name: "مراقبة الأداء", icon: Activity },
      ],
    },
    en: {
      tabName: "Cloud Tech",
      title: "Cloud Infrastructure",
      desc: "Reliable cloud infrastructure, application deployment, server management, and automated backups.",
      cards: [
        { name: "Server Management", icon: Server },
        { name: "App Deployment", icon: Terminal },
        { name: "Automated Backup", icon: Database },
        { name: "Performance Monitor", icon: Activity },
      ],
    },
    ku: {
      tabName: "تەکنەلۆژیای سحابی",
      title: "تەکنەلۆژیای سحابی و کلۆود",
      desc: "ژێرخانی کلۆودی باوەڕپێکراو، بڵاوکردنەوەی ئەپ، بەڕێوەبردنی سێرڤەر، و کۆپی یەدەگ.",
      cards: [
        { name: "بەڕێوەبردنی سێرڤەر", icon: Server },
        { name: "بڵاوکردنەوەی ئەپ", icon: Terminal },
        { name: "کۆپی یەدەگی ئۆتۆماتیکی", icon: Database },
        { name: "چاودێریکردنی کارایی", icon: Activity },
      ],
    },
  },
  sec: {
    ar: {
      tabName: "أمن سيبراني",
      title: "الأمن السيبراني",
      desc: "حماية شاملة لبنيتك الرقمية، اختبار اختراق، وتدريب الفرق على الأمن المعلوماتي.",
      cards: [
        { name: "حماية شبكات", icon: ShieldCheck },
        { name: "اختبار اختراق", icon: Fingerprint },
        { name: "تدقيق أمني", icon: FileSearch },
        { name: "تدريب الفرق", icon: Users },
      ],
    },
    en: {
      tabName: "Cybersecurity",
      title: "Cyber Security Services",
      desc: "Comprehensive protection for your digital infrastructure, penetration testing, and secure training for teams.",
      cards: [
        { name: "Network Security", icon: ShieldCheck },
        { name: "Penetration Testing", icon: Fingerprint },
        { name: "Security Auditing", icon: FileSearch },
        { name: "Team Security Training", icon: Users },
      ],
    },
    ku: {
      tabName: "ئاسایشی سایبەری",
      title: "خزمەتگوزاری ئاسایشی سایبەری",
      desc: "پاراستنی گشتگیر بۆ ژێرخانی دیجیتاڵیت، تاقیکردنەوەی دزەکردن، و ڕاهێنانی تیمەکان لەسەر ئاسایش.",
      cards: [
        { name: "پاراستنی تۆڕەکان", icon: ShieldCheck },
        { name: "تاقیکردنەوەی دزەکردن", icon: Fingerprint },
        { name: "پشکنینی ئەمنی", icon: FileSearch },
        { name: "ڕاهێنانی ئەمنی تیمەکان", icon: Users },
      ],
    },
  },
};

// Deterministic ambient motes (avoids SSR hydration mismatch)
const MOTES = [
  { top: "12%", left: "8%", size: 6, dur: 14, delay: 0, mx: "40px", my: "-60px" },
  { top: "28%", left: "82%", size: 4, dur: 18, delay: 2, mx: "-50px", my: "40px" },
  { top: "62%", left: "16%", size: 5, dur: 16, delay: 1, mx: "60px", my: "-30px" },
  { top: "78%", left: "70%", size: 7, dur: 20, delay: 3, mx: "-40px", my: "-50px" },
  { top: "44%", left: "48%", size: 3, dur: 13, delay: 0.5, mx: "30px", my: "50px" },
  { top: "18%", left: "60%", size: 5, dur: 17, delay: 2.5, mx: "-30px", my: "60px" },
  { top: "70%", left: "40%", size: 4, dur: 15, delay: 1.5, mx: "50px", my: "-40px" },
  { top: "36%", left: "26%", size: 6, dur: 19, delay: 3.5, mx: "-60px", my: "-30px" },
  { top: "54%", left: "88%", size: 3, dur: 12, delay: 1, mx: "40px", my: "40px" },
  { top: "86%", left: "22%", size: 5, dur: 21, delay: 2, mx: "-40px", my: "-60px" },
  { top: "8%", left: "38%", size: 4, dur: 16, delay: 0.8, mx: "50px", my: "50px" },
  { top: "48%", left: "6%", size: 6, dur: 18, delay: 2.8, mx: "60px", my: "-40px" },
];

function CountUp({ to, suffix = "", run }: { to: number; suffix?: string; run: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

const sceneVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.0 } },
};

type Custom = { z: number; delay: number; ry?: number };

const panelVariants: Variants = {
  hidden: (c: Custom) => ({ opacity: 0, z: c.z - 280, y: 46, rotateX: 16, rotateY: c.ry ?? 0 }),
  show: (c: Custom) => ({
    opacity: 1,
    z: c.z,
    y: 0,
    rotateX: 0,
    rotateY: c.ry ?? 0,
    transition: { delay: c.delay, duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  }),
};

const panelVariantsFlat: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (c: Custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: c.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const contentStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesTabs() {
  const { lang } = useApp() as { lang: Lang };
  const router = useRouter();
  const [active, setActive] = useState<TabKey>("dev");
  const isRtl = lang === "ar" || lang === "ku";
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const started = useInView(sectionRef, { once: true, amount: 0.18, margin: "0px 0px -8% 0px" });

  const [lowPower, setLowPower] = useState(false);
  const [scrollPaused, setScrollPaused] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => setLowPower(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const disable3D = reduce || lowPower;

  // Mouse-driven camera parallax
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springCfg = { stiffness: 60, damping: 18, mass: 0.6 };
  const rotY = useSpring(useTransform(mvX, [-0.5, 0.5], [-15, 15]), springCfg);
  const rotX = useSpring(useTransform(mvY, [-0.5, 0.5], [11, -11]), springCfg);

  // Pause mouse parallax while scrolling — prevents jitter at section entry
  useEffect(() => {
    if (disable3D) return;
    let timer: ReturnType<typeof setTimeout>;
    const pause = () => {
      setScrollPaused(true);
      mvX.set(0);
      mvY.set(0);
      clearTimeout(timer);
      timer = setTimeout(() => setScrollPaused(false), 220);
    };
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    return () => {
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      clearTimeout(timer);
    };
  }, [disable3D, mvX, mvY]);

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disable3D || scrollPaused) return;
    const r = e.currentTarget.getBoundingClientRect();
    mvX.set((e.clientX - r.left) / r.width - 0.5);
    mvY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetPointer = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const goToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const slideLabel = {
      ar: "مشاريعنا",
      en: "Our Projects",
      ku: "پڕۆژەکانمان",
    }[lang];
    startSlideTransition(isRtl, () => router.push("/our-projects"), slideLabel);
  };

  const tab = tabsData[active][lang];

  const labelText = { ar: "ما نقدمه", en: "WHAT WE OFFER", ku: "چی پێشکەش دەکەین" }[lang];
  const headerTitle = { ar: "خدماتنا", en: "Our Services", ku: "خزمەتگوزارییەکانمان" }[lang];
  const headerDesc = {
    ar: "حلول متكاملة من الفكرة للتنفيذ والدعم.",
    en: "End-to-end solutions from concept to deployment and support.",
    ku: "چارەسەری تەواو لە بیرۆکەوە بۆ جێبەجێکردن و پشتگیری.",
  }[lang];

  const yearsLabel = { ar: "سنوات خبرة", en: "Years of Experience", ku: "ساڵانی ئەزموون" }[lang];
  const coverageValue = { ar: "كل العراق", en: "All Iraq", ku: "هەموو عێراق" }[lang];
  const coverageLabel = { ar: "تغطية شاملة", en: "Full Coverage", ku: "ڕووماڵی تەواو" }[lang];

  const actionButtons = {
    quote: { ar: "اطلب عرض سعر", en: "Request a Quote", ku: "داواکردنی نرخ" }[lang],
    projects: { ar: "استكشف مشاريعنا", en: "Explore Our Projects", ku: "پڕۆژەکانمان ببینە" }[lang],
  };

  const tabs = [
    { key: "dev" as const, label: tabsData.dev[lang].tabName, icon: Code },
    { key: "cloud" as const, label: tabsData.cloud[lang].tabName, icon: Cloud },
    { key: "sec" as const, label: tabsData.sec[lang].tabName, icon: ShieldCheck },
  ];

  const activeIndex = TAB_ORDER.indexOf(active);
  const goPrevTab = () => {
    const next = (activeIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    setActive(TAB_ORDER[next]);
  };
  const goNextTab = () => {
    const next = (activeIndex + 1) % TAB_ORDER.length;
    setActive(TAB_ORDER[next]);
  };
  const activeTabMeta = tabs.find((t) => t.key === active)!;
  const ActiveTabIcon = activeTabMeta.icon;

  const animateState = started ? "show" : "hidden";
  const idle = started && !disable3D;
  const statTilt = isRtl ? -9 : 9;
  const panelV = disable3D ? panelVariantsFlat : panelVariants;
  const sceneTilt = disable3D || scrollPaused ? undefined : { rotateX: rotX, rotateY: rotY };

  return (
    <section
      ref={sectionRef}
      id="services"
      dir={isRtl ? "rtl" : "ltr"}
      className="services-3d w-full py-12 sm:py-16 md:py-24 lg:py-28 relative"
    >
      {/* Atmospheric depth fog */}
      <div className="svc-fog" aria-hidden />

      {/* Ambient floating motes */}
      {!disable3D && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="svc-mote"
              style={{
                top: m.top,
                left: m.left,
                width: m.size,
                height: m.size,
                // @ts-expect-error custom props
                "--mx": m.mx,
                "--my": m.my,
                animation: `svcMoteDrift ${m.dur}s ${m.delay}s ease-in-out infinite`,
                animationPlayState: idle ? "running" : "paused",
              }}
            />
          ))}
        </div>
      )}

      <div
        className="svc-viewport svc-interactive mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 md:px-12 relative z-10"
        {...(!disable3D
          ? { onPointerMove: handlePointer, onPointerLeave: resetPointer }
          : {})}
      >
        <motion.div
          className="svc-scene w-full max-w-full"
          variants={sceneVariants}
          initial="hidden"
          animate={animateState}
          style={sceneTilt}
        >
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14 items-start">
            {/* Stat panels */}
            <div className="order-2 lg:order-2 lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:flex lg:flex-col lg:gap-5">
              {/* 5+ years */}
              <motion.div
                className="svc-layer min-w-0"
                variants={panelV}
                custom={{ z: -70, delay: 0.12, ry: statTilt }}
                whileHover={disable3D ? undefined : { z: -20, transition: { type: "spring", stiffness: 200, damping: 20 } }}
                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
              >
                <motion.div animate={idle ? { y: [0, -10, 0] } : { y: 0 }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="svc-panel svc-panel-hoverable p-4 sm:p-6 md:p-7 text-start">
                    <div className="text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-none tracking-tight mb-2 text-white">
                      <CountUp to={5} suffix="+" run={started} />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[var(--svc-text-muted)]">{yearsLabel}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* coverage */}
              <motion.div
                className="svc-layer min-w-0"
                variants={panelV}
                custom={{ z: -95, delay: 0.22, ry: statTilt }}
                whileHover={disable3D ? undefined : { z: -30, transition: { type: "spring", stiffness: 200, damping: 20 } }}
                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
              >
                <motion.div animate={idle ? { y: [0, 10, 0] } : { y: 0 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                  <div className="svc-panel svc-panel-hoverable p-4 sm:p-6 md:p-7 text-start">
                    <div className="text-xl sm:text-3xl md:text-4xl font-black leading-none tracking-tight mb-2 text-[var(--svc-accent-bright)]">
                      {coverageValue}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[var(--svc-text-muted)]">{coverageLabel}</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Main column — first on mobile */}
            <div className="order-1 lg:order-1 lg:col-span-8 flex min-w-0 flex-col" style={disable3D ? undefined : { transformStyle: "preserve-3d" }}>
              {/* Header */}
              <motion.header
                className="svc-layer mb-6 sm:mb-8 md:mb-9 text-start space-y-2 sm:space-y-2.5 md:space-y-3"
                variants={panelV}
                custom={{ z: 25, delay: 0 }}
                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
              >
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] sm:tracking-[0.22em] text-[var(--svc-accent-bright)] uppercase block">
                  {labelText}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white leading-[1.15] tracking-tight">
                  {headerTitle}
                </h2>
                <p className="w-full text-[var(--svc-text-muted)] text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl break-words">
                  {headerDesc}
                </p>
              </motion.header>

              {/* Switcher — mobile: prev/next + dots | desktop: full tab row */}
              <motion.div
                className="svc-layer mb-5 sm:mb-7 md:mb-8 w-full min-w-0 max-w-full"
                variants={panelV}
                custom={{ z: 70, delay: 0.3 }}
                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
              >
                {/* Mobile navigation */}
                <div className="space-y-3 md:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrevTab}
                      aria-label={isRtl ? "الخدمة التالية" : "Previous service"}
                      className="svc-tab-nav-btn relative z-10 grid shrink-0 place-items-center touch-manipulation"
                    >
                      {isRtl ? <ChevronRight size={20} strokeWidth={2.5} /> : <ChevronLeft size={20} strokeWidth={2.5} />}
                    </button>

                    <div className="svc-switcher-track flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3">
                      <ActiveTabIcon size={18} strokeWidth={2.5} className="shrink-0 text-[var(--svc-accent-bright)]" />
                      <span className="truncate text-sm font-bold text-white">{activeTabMeta.label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={goNextTab}
                      aria-label={isRtl ? "الخدمة السابقة" : "Next service"}
                      className="svc-tab-nav-btn relative z-10 grid shrink-0 place-items-center touch-manipulation"
                    >
                      {isRtl ? <ChevronLeft size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2" role="tablist" aria-label={headerTitle}>
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        role="tab"
                        aria-selected={active === t.key}
                        aria-label={t.label}
                        onClick={() => setActive(t.key)}
                        className={`relative z-10 h-2 rounded-full transition-all duration-300 touch-manipulation ${
                          active === t.key ? "w-7 bg-[var(--svc-accent-bright)]" : "w-2 bg-white/25 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop tabs */}
                <div
                  className="svc-switcher-track hidden w-full grid-cols-3 gap-1 rounded-2xl p-1.5 md:grid"
                  role="tablist"
                  aria-label={headerTitle}
                >
                  {tabs.map((t) => {
                    const TabIcon = t.icon;
                    const isActive = active === t.key;
                    return (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActive(t.key)}
                        className={`relative flex min-w-0 items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--svc-accent-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001220] ${
                          isActive ? "text-white" : "text-white/45 hover:text-white/70"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="servicesTabIndicator"
                            className="absolute inset-0 rounded-xl bg-[var(--svc-accent)] shadow-[0_0_26px_rgba(43,127,255,0.6)]"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                          />
                        )}
                        <TabIcon size={16} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 shrink-0" />
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Focal detail panel */}
              <motion.div
                className="svc-layer min-w-0 min-h-0 lg:min-h-[400px]"
                variants={panelV}
                custom={{ z: 10, delay: 0.42 }}
                whileHover={disable3D ? undefined : { z: 45, transition: { type: "spring", stiffness: 180, damping: 22 } }}
                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
              >
                <div className="svc-panel relative overflow-hidden p-4 sm:p-8 md:p-10" style={disable3D ? undefined : { transformStyle: "preserve-3d" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={
                        disable3D
                          ? { opacity: 0, y: 14 }
                          : { opacity: 0, rotateY: isRtl ? -22 : 22, z: -70 }
                      }
                      animate={disable3D ? { opacity: 1, y: 0 } : { opacity: 1, rotateY: 0, z: 0 }}
                      exit={
                        disable3D
                          ? { opacity: 0, y: -10 }
                          : { opacity: 0, rotateY: isRtl ? 18 : -18, z: -50 }
                      }
                      transition={{ duration: disable3D ? 0.28 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                      style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
                    >
                      <motion.div variants={contentStagger} initial="hidden" animate="show">
                        <motion.div variants={itemFade} className="mb-7 md:mb-8 text-start">
                          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">{tab.title}</h3>
                          <p className="text-[var(--svc-text-muted)] text-sm sm:text-[15px] font-medium leading-relaxed max-w-2xl">
                            {tab.desc}
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-6 sm:mb-8" style={disable3D ? undefined : { transformStyle: "preserve-3d" }}>
                          {tab.cards.map((card, i) => {
                            const CardIcon = card.icon;
                            return (
                              <motion.div
                                key={i}
                                variants={itemFade}
                                whileHover={disable3D ? undefined : { z: 30, transition: { type: "spring", stiffness: 220, damping: 20 } }}
                                style={disable3D ? undefined : { transformStyle: "preserve-3d" }}
                                className="svc-feature-tile flex min-w-0 flex-col items-start gap-2.5 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5 rounded-2xl border border-[var(--svc-glass-border)] bg-white/[0.02] text-start"
                              >
                                <div className="svc-feature-icon w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center bg-[var(--svc-accent-soft)] text-[var(--svc-accent-bright)] border border-[var(--svc-accent-border)] transition-all duration-300">
                                  <CardIcon size={16} strokeWidth={2} className="sm:hidden" />
                                  <CardIcon size={18} strokeWidth={2} className="hidden sm:block" />
                                </div>
                                <span className="text-white text-xs sm:text-[15px] font-bold leading-snug">{card.name}</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        <motion.div variants={itemFade}>
                          <div className="h-px bg-[var(--svc-glass-border)] mb-6" aria-hidden />
                          <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-4">
                            <a
                              href="/contact"
                              className="svc-btn-primary group/btn relative z-10 w-full sm:w-auto sm:flex-none inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl text-white font-bold text-sm touch-manipulation"
                            >
                              <span>{actionButtons.quote}</span>
                              {isRtl ? (
                                <ArrowLeft size={17} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
                              ) : (
                                <ArrowRight size={17} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                              )}
                            </a>
                            <a
                              href="/our-projects"
                              onClick={goToProjects}
                              className="svc-btn-ghost relative z-10 w-full sm:w-auto sm:flex-none inline-flex items-center justify-center px-6 sm:px-7 py-3.5 rounded-xl text-white/75 font-bold text-sm touch-manipulation"
                            >
                              {actionButtons.projects}
                            </a>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
