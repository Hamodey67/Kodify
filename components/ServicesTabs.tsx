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
} from "lucide-react";

type TabKey = "dev" | "cloud" | "sec";
type Lang = "ar" | "en" | "ku";

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
  const inView = useInView(sectionRef, { once: false, amount: 0.25 });
  const started = useInView(sectionRef, { once: true, amount: 0.3 });

  const [lowPower, setLowPower] = useState(false);
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

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disable3D) return;
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
    startSlideTransition(isRtl, () => router.push("/our-projects"));
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

  const animateState = started ? "show" : "hidden";
  const idle = inView && !disable3D;
  const statTilt = isRtl ? -9 : 9;

  return (
    <section
      ref={sectionRef}
      id="services"
      dir={isRtl ? "rtl" : "ltr"}
      className="services-3d w-full py-16 md:py-24 lg:py-28 relative overflow-hidden"
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
        className="svc-viewport max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10"
        onPointerMove={handlePointer}
        onPointerLeave={resetPointer}
      >
        <motion.div
          className="svc-scene"
          variants={sceneVariants}
          initial="hidden"
          animate={animateState}
          style={disable3D ? undefined : { rotateX: rotX, rotateY: rotY }}
        >
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
            {/* Stat panels — floating to the side, deeper + tilted */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-5">
              {/* 5+ years */}
              <motion.div
                className="svc-layer"
                variants={panelVariants}
                custom={{ z: -70, delay: 0.12, ry: statTilt }}
                whileHover={disable3D ? undefined : { z: -20, transition: { type: "spring", stiffness: 200, damping: 20 } }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div animate={idle ? { y: [0, -10, 0] } : { y: 0 }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="svc-panel svc-panel-hoverable p-6 md:p-7 text-start">
                    <div className="text-4xl md:text-[2.75rem] font-black leading-none tracking-tight mb-2.5 text-white">
                      <CountUp to={5} suffix="+" run={started} />
                    </div>
                    <div className="text-sm font-semibold text-[var(--svc-text-muted)]">{yearsLabel}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* coverage */}
              <motion.div
                className="svc-layer"
                variants={panelVariants}
                custom={{ z: -95, delay: 0.22, ry: statTilt }}
                whileHover={disable3D ? undefined : { z: -30, transition: { type: "spring", stiffness: 200, damping: 20 } }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div animate={idle ? { y: [0, 10, 0] } : { y: 0 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                  <div className="svc-panel svc-panel-hoverable p-6 md:p-7 text-start">
                    <div className="text-3xl md:text-4xl font-black leading-none tracking-tight mb-2.5 text-[var(--svc-accent-bright)]">
                      {coverageValue}
                    </div>
                    <div className="text-sm font-semibold text-[var(--svc-text-muted)]">{coverageLabel}</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Main column */}
            <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col" style={{ transformStyle: "preserve-3d" }}>
              {/* Header */}
              <motion.header
                className="svc-layer mb-8 md:mb-9 text-start space-y-2.5 md:space-y-3"
                variants={panelVariants}
                custom={{ z: 25, delay: 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="text-[11px] font-bold tracking-[0.22em] text-[var(--svc-accent-bright)] uppercase block">
                  {labelText}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
                  {headerTitle}
                </h2>
                <p className="text-[var(--svc-text-muted)] text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl">
                  {headerDesc}
                </p>
              </motion.header>

              {/* Switcher — floats slightly forward */}
              <motion.div
                className="svc-layer -mx-5 px-5 sm:mx-0 sm:px-0 mb-7 md:mb-8 overflow-x-auto scrollbar-none"
                variants={panelVariants}
                custom={{ z: 70, delay: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="svc-switcher-track inline-flex min-w-max sm:min-w-0 sm:w-full sm:flex-wrap gap-1 p-1.5 rounded-2xl" role="tablist" aria-label={headerTitle}>
                  {tabs.map((t) => {
                    const TabIcon = t.icon;
                    const isActive = active === t.key;
                    return (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActive(t.key)}
                        className={`relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--svc-accent-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001220] ${
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
                className="svc-layer min-h-[360px] sm:min-h-[400px]"
                variants={panelVariants}
                custom={{ z: 10, delay: 0.42 }}
                whileHover={disable3D ? undefined : { z: 45, transition: { type: "spring", stiffness: 180, damping: 22 } }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="svc-panel p-6 sm:p-8 md:p-10 relative overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, rotateY: isRtl ? -22 : 22, z: -70 }}
                      animate={{ opacity: 1, rotateY: 0, z: 0 }}
                      exit={{ opacity: 0, rotateY: isRtl ? 18 : -18, z: -50 }}
                      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div variants={contentStagger} initial="hidden" animate="show">
                        <motion.div variants={itemFade} className="mb-7 md:mb-8 text-start">
                          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">{tab.title}</h3>
                          <p className="text-[var(--svc-text-muted)] text-sm sm:text-[15px] font-medium leading-relaxed max-w-2xl">
                            {tab.desc}
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8" style={{ transformStyle: "preserve-3d" }}>
                          {tab.cards.map((card, i) => {
                            const CardIcon = card.icon;
                            return (
                              <motion.div
                                key={i}
                                variants={itemFade}
                                whileHover={disable3D ? undefined : { z: 30, transition: { type: "spring", stiffness: 220, damping: 20 } }}
                                style={{ transformStyle: "preserve-3d" }}
                                className="svc-feature-tile flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-[var(--svc-glass-border)] bg-white/[0.02] text-start"
                              >
                                <div className="svc-feature-icon w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-[var(--svc-accent-soft)] text-[var(--svc-accent-bright)] border border-[var(--svc-accent-border)] transition-all duration-300">
                                  <CardIcon size={18} strokeWidth={2} />
                                </div>
                                <span className="text-white text-sm sm:text-[15px] font-bold leading-snug">{card.name}</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        <motion.div variants={itemFade}>
                          <div className="h-px bg-[var(--svc-glass-border)] mb-6" aria-hidden />
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <a
                              href="/contact"
                              className="svc-btn-primary group/btn flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-bold text-sm"
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
                              className="svc-btn-ghost flex-1 sm:flex-none inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-white/75 font-bold text-sm"
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
