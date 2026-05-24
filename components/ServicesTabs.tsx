"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/app/providers";
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
  X
} from "lucide-react";

type TabKey = "dev" | "cloud" | "sec";
type Lang = "ar" | "en" | "ku";

const tabsData: Record<
  TabKey,
  {
    icon: any;
    ar: {
      tabName: string;
      title: string;
      desc: string;
      cards: { name: string; icon: any; color: "cyan" | "blue" | "purple" | "coral" }[];
    };
    en: {
      tabName: string;
      title: string;
      desc: string;
      cards: { name: string; icon: any; color: "cyan" | "blue" | "purple" | "coral" }[];
    };
    ku: {
      tabName: string;
      title: string;
      desc: string;
      cards: { name: string; icon: any; color: "cyan" | "blue" | "purple" | "coral" }[];
    };
  }
> = {
  dev: {
    icon: Code,
    ar: {
      tabName: "تطوير برمجيات",
      title: "تطوير البرمجيات والنظم",
      desc: "حلول متكاملة تشمل تطبيقات الويب، أنظمة ERP، إدارة الموارد، ولوحات التحكم المخصصة.",
      cards: [
        { name: "لوحات تحكم ذكية", icon: LayoutDashboard, color: "cyan" },
        { name: "مواقع وتطبيقات", icon: Globe, color: "blue" },
        { name: "أنظمة ERP/CRM", icon: Layers, color: "purple" },
        { name: "تكامل APIs", icon: Cpu, color: "coral" }
      ]
    },
    en: {
      tabName: "Software Dev",
      title: "Software & Systems Development",
      desc: "Comprehensive solutions including web applications, ERP systems, resource management, and custom dashboards.",
      cards: [
        { name: "Smart Dashboards", icon: LayoutDashboard, color: "cyan" },
        { name: "Web & Mobile Apps", icon: Globe, color: "blue" },
        { name: "ERP/CRM Systems", icon: Layers, color: "purple" },
        { name: "API Integrations", icon: Cpu, color: "coral" }
      ]
    },
    ku: {
      tabName: "گەشەپێدانی سۆفتوێر",
      title: "گەشەپێدانی سۆفتوێر و سیستەم",
      desc: "چارەسەری تەواو لە بیرۆکەوە بۆ جێبەجێکردن و پشتگیری سیستەمی کۆمپانیاکان.",
      cards: [
        { name: "داشبۆردی زیرەک", icon: LayoutDashboard, color: "cyan" },
        { name: "ماڵپەڕ و ئەپڵیکەیشن", icon: Globe, color: "blue" },
        { name: "سیستەمی ERP/CRM", icon: Layers, color: "purple" },
        { name: "یەکخستنی API", icon: Cpu, color: "coral" }
      ]
    }
  },
  cloud: {
    icon: Cloud,
    ar: {
      tabName: "تقنية سحابية",
      title: "التقنية السحابية",
      desc: "بنية تحتية سحابية موثوقة، نشر تطبيقات، إدارة خوادم، ونسخ احتياطي آلي.",
      cards: [
        { name: "إدارة خوادم", icon: Server, color: "cyan" },
        { name: "نشر تطبيقات", icon: Terminal, color: "blue" },
        { name: "نسخ احتياطي", icon: Database, color: "purple" },
        { name: "مراقبة الأداء", icon: Activity, color: "coral" }
      ]
    },
    en: {
      tabName: "Cloud Tech",
      title: "Cloud Infrastructure",
      desc: "Reliable cloud infrastructure, application deployment, server management, and automated backups.",
      cards: [
        { name: "Server Management", icon: Server, color: "cyan" },
        { name: "App Deployment", icon: Terminal, color: "blue" },
        { name: "Automated Backup", icon: Database, color: "purple" },
        { name: "Performance Monitor", icon: Activity, color: "coral" }
      ]
    },
    ku: {
      tabName: "تەکنەلۆژیای سحابی",
      title: "تەکنەلۆژیای سحابی و کلۆود",
      desc: "ژێرخانی کلۆودی باوەڕپێکراو، بڵاوکردنەوەی ئەپ، بەڕێوەبردنی سێرڤەر، و کۆپی یەدەگ.",
      cards: [
        { name: "بەڕێوەبردنی سێرڤەر", icon: Server, color: "cyan" },
        { name: "بڵاوکردنەوەی ئەپ", icon: Terminal, color: "blue" },
        { name: "کۆپی یەدەگی ئۆتۆماتیکی", icon: Database, color: "purple" },
        { name: "چاودێری کردنی ئەدا", icon: Activity, color: "coral" }
      ]
    }
  },
  sec: {
    icon: ShieldCheck,
    ar: {
      tabName: "أمن سيبراني",
      title: "الأمن السيبراني",
      desc: "حماية شاملة لبنيتك الرقمية، اختبار اختراق، وتدريب الفرق على الأمن المعلوماتي.",
      cards: [
        { name: "حماية شبكات", icon: ShieldCheck, color: "cyan" },
        { name: "اختبار اختراق", icon: Fingerprint, color: "blue" },
        { name: "تدقيق أمني", icon: FileSearch, color: "purple" },
        { name: "تدريب الفرق", icon: Users, color: "coral" }
      ]
    },
    en: {
      tabName: "Cybersecurity",
      title: "Cyber Security Services",
      desc: "Comprehensive protection for your digital infrastructure, penetration testing, and secure training for teams.",
      cards: [
        { name: "Network Security", icon: ShieldCheck, color: "cyan" },
        { name: "Penetration Testing", icon: Fingerprint, color: "blue" },
        { name: "Security Auditing", icon: FileSearch, color: "purple" },
        { name: "Team Security Training", icon: Users, color: "coral" }
      ]
    },
    ku: {
      tabName: "ئاسایشی سایبەری",
      title: "خزمەتگوزاری ئاسایشی سایبەری",
      desc: "پاراستنی گشتگیر بۆ ژێرخانی دیجیتاڵیت، تاقیکردنەوەی دزەکردن، و ڕاهێنانی تیمەکان لەسەر ئاسایش.",
      cards: [
        { name: "پاراستنی تۆڕەکان", icon: ShieldCheck, color: "cyan" },
        { name: "تاقیکردنەوەی دزەکردن", icon: Fingerprint, color: "blue" },
        { name: "پشکنینی ئەمنی", icon: FileSearch, color: "purple" },
        { name: "ڕاهێنانی ئەمنی تیمەکان", icon: Users, color: "coral" }
      ]
    }
  }
};

const cardColors = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  blue: { text: "text-sky-300", bg: "bg-sky-400/10", border: "border-sky-400/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  coral: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" }
};

export default function ServicesTabs() {
  const { lang } = useApp() as { lang: Lang };
  const [active, setActive] = useState<TabKey>("dev");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const isRtl = lang === "ar" || lang === "ku";

  const tab = tabsData[active][lang];

  // Translation helpers
  const labelText = {
    ar: "ما نقدمه",
    en: "WHAT WE OFFER",
    ku: "چی پێشکەش دەکەین"
  }[lang];

  const headerTitle = {
    ar: "خدماتنا",
    en: "Our Services",
    ku: "خزمەتگوزارییەکانمان"
  }[lang];

  const headerDesc = {
    ar: "حلول متكاملة من الفكرة للتنفيذ والدعم.",
    en: "End-to-end solutions from concept to deployment and support.",
    ku: "چارەسەری تەواو لە بیرۆکەوە بۆ جێبەجێکردن و پشتگیری."
  }[lang];

  const stats = [
    {
      value: "+5",
      label: {
        ar: "سنوات خبرة",
        en: "Years of Experience",
        ku: "ساڵانی ئەزموون"
      }[lang]
    },
    {
      value: { ar: "كل العراق", en: "All Iraq", ku: "هەموو عێراق" }[lang],
      label: {
        ar: "تغطية شاملة",
        en: "Full Coverage",
        ku: "ڕووماڵی تەواو"
      }[lang],
      isBlue: true
    }
  ];

  const actionButtons = {
    quote: { ar: "اطلب عرض سعر", en: "Request a Quote", ku: "داواکردنی نرخ" }[lang],
    projects: { ar: "تصفح المشاريع", en: "Browse Projects", ku: "بینینی پڕۆژەکان" }[lang]
  };

  const tabs = [
    { key: "dev" as const, label: tab.tabName, icon: Code },
    { key: "cloud" as const, label: tabsData.cloud[lang].tabName, icon: Cloud },
    { key: "sec" as const, label: tabsData.sec[lang].tabName, icon: ShieldCheck }
  ];

  return (
    <section 
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full py-16 relative overflow-hidden"
    >
      {/* Premium background grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Decorative colored glow orbs */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Two-column main layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Main Content Column (Right on RTL, Left on LTR) */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            
            {/* Header section (aligned to right in RTL, left in LTR) */}
            <div className="mb-10 text-start">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase block mb-3">
                {labelText}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                {headerTitle}
              </h2>
              <p className="text-white/40 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                {headerDesc}
              </p>
            </div>

            {/* Horizontal pill tabs with icons */}
            <div className="flex flex-wrap gap-3 mb-8 border-b border-white/5 pb-6">
              {tabs.map((t) => {
                const TabIcon = t.icon;
                const isActive = active === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className={`
                      flex items-center gap-3 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 border
                      ${isActive 
                        ? "bg-sky-500 border-sky-500 text-white shadow-[0_10px_25px_-5px_rgba(125,211,252,0.25)]" 
                        : "bg-brand-soft border-[var(--border)] text-brand-logo-muted hover:text-brand-logo hover:border-[var(--border-strong)]"
                      }
                    `}
                  >
                    <TabIcon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{tabsData[t.key][lang].tabName}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Display */}
            <div className="min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-10 shadow-[var(--card-shadow)] relative overflow-hidden backdrop-blur-md"
                >
                  {/* Subtle top-inset gloss reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                  {/* Panel Title & Description */}
                  <div className="mb-8 text-start">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {tab.title}
                    </h3>
                    <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                      {tab.desc}
                    </p>
                  </div>

                  {/* 2x2 Services Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {tab.cards.map((card, i) => {
                      const CardIcon = card.icon;
                      const color = cardColors[card.color];
                      return (
                        <div 
                          key={i}
                          onClick={() => setSelectedCard(card)}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-brand-soft border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-300 group cursor-pointer"
                        >
                          {/* 36x36 Icon Container */}
                          <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 ${color.bg} ${color.text} ${color.border} border`}>
                            <CardIcon size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <span className="text-white text-[13px] font-bold tracking-wide leading-none">
                            {card.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                    <a
                      href="/contact"
                      className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs md:text-sm transition-all duration-300 text-center shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>{actionButtons.quote}</span>
                      {isRtl ? (
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
                      ) : (
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      )}
                    </a>
                    <a
                      href="/projects"
                      className="px-8 py-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] bg-brand-soft text-brand-logo hover:text-brand-cyan font-bold text-xs md:text-sm transition-all duration-300 text-center"
                    >
                      {actionButtons.projects}
                    </a>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Stats Sidebar Column (Left on RTL, Right on LTR) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-4 h-full">
            {stats.map((s, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] backdrop-blur-md hover:border-[var(--border-strong)] transition-all duration-300 text-start group"
              >
                <div className={`text-4xl md:text-5xl font-black mb-2 transition-transform duration-500 group-hover:scale-105 inline-block ${
                  s.isBlue ? "text-brand-cyan" : "text-white"
                }`}>
                  {s.value}
                </div>
                <div className="text-white/40 text-xs md:text-sm font-bold tracking-wide uppercase leading-none">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-[var(--card-shadow)] overflow-hidden"
            >
              <button 
                onClick={() => setSelectedCard(null)}
                className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} p-2 text-brand-logo-muted hover:text-brand-logo bg-brand-soft hover:bg-brand-cyan-soft rounded-full transition-colors`}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border
                  ${cardColors[selectedCard.color as keyof typeof cardColors].bg} 
                  ${cardColors[selectedCard.color as keyof typeof cardColors].text} 
                  ${cardColors[selectedCard.color as keyof typeof cardColors].border}
                `}>
                  <selectedCard.icon size={36} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{selectedCard.name}</h3>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  {lang === "ar" 
                    ? `نقدم في هذه الخدمة حلولاً متقدمة لـ ${selectedCard.name} بأعلى معايير الجودة والأمان لضمان نجاح أعمالك.`
                    : lang === "ku"
                    ? `لە کاتی پێشکەشکردنی ئەم خزمەتگوزارییەدا، باشترین چارەسەرەکان بۆ ${selectedCard.name} دابین دەکەین بە بەرزترین کوالێتی.`
                    : `We provide advanced solutions for ${selectedCard.name} with the highest standards of quality and security to ensure your business success.`}
                </p>

                <a
                  href="/contact"
                  className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-sky-500/20"
                >
                  {actionButtons.quote}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
