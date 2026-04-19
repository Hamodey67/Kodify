"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Cloud, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ArrowRight,
  Monitor,
  Database,
  Lock,
  Zap,
  X
} from "lucide-react";
import { useApp } from "@/app/providers";

type TabKey = "dev" | "it" | "sec";
type Lang = "ar" | "en" | "ku";

const data: Record<
  TabKey,
  {
    icon: any;
    color: string;
    ar: { title: string; desc: string; bullets: { title: string; icon: any }[] };
    en: { title: string; desc: string; bullets: { title: string; icon: any }[] };
    ku: { title: string; desc: string; bullets: { title: string; icon: any }[] };
  }
> = {
  dev: {
    icon: Code2,
    color: "cyan",
    en: {
      title: "Software Development",
      desc: "Comprehensive solutions including web applications, ERP/CRM systems, and custom admin panels.",
      bullets: [
        { title: "Enterprise Web Apps", icon: Monitor },
        { title: "Advanced Admin Panels", icon: Zap },
        { title: "ERP/CRM Integration", icon: Database },
        { title: "High-level APIs", icon: ExternalLink }
      ],
    },
    ar: {
      title: "تطوير البرمجيات والنظم",
      desc: "حلول متكاملة تشمل تطبيقات الويب، أنظمة إدارة الموارد ERP، ولوحات التحكم المخصصة.",
      bullets: [
        { title: "مواقع وتطبيقات شركات", icon: Monitor },
        { title: "لوحات تحكم ذكية", icon: Zap },
        { title: "أنظمة ERP/CRM", icon: Database },
        { title: "تكامل أنظمة و APIs", icon: ExternalLink }
      ],
    },
    ku: {
      title: "گەشەپێدانی سۆفتوێر",
      desc: "چارەسەری گشتگیر لەوانە وێب ئەپ، سیستەمەکانی ERP/CRM، و پانێڵی بەڕێوەبردن.",
      bullets: [
        { title: "ماڵپەڕی کۆمپانیا", icon: Monitor },
        { title: "داشبۆرد و Admin", icon: Zap },
        { title: "سیستەمی ERP/CRM", icon: Database },
        { title: "یەکخستنەوەی API", icon: ExternalLink }
      ],
    },
  },

  it: {
    icon: Cloud,
    color: "blue",
    en: {
      title: "Cloud & Infrastructure",
      desc: "Robust cloud architecture, high-performance server deployments, and 24/7 system monitoring.",
      bullets: [
        { title: "Cloud Infrastructure", icon: Cloud },
        { title: "CI/CD & Deployments", icon: Zap },
        { title: "Performance Tuning", icon: Monitor },
        { title: "Disaster Recovery", icon: Lock }
      ],
    },
    ar: {
      title: "السحابة والبنية التحتية",
      desc: "بنية تحتية سحابية متينة، نشر سيرفرات عالية الأداء، ومراقبة الأنظمة على مدار الساعة.",
      bullets: [
        { title: "معمارية سحابية", icon: Cloud },
        { title: "نشر وأتمتة (CI/CD)", icon: Zap },
        { title: "تحسين الأداء", icon: Monitor },
        { title: "حلول النسخ والتعافي", icon: Lock }
      ],
    },
    ku: {
      title: "IT & کلۆود",
      desc: "ژێرخانی بەهێز، بڵاوکردنەوەی سێرڤەر، و چاودێریکردنی بەردەوامی سیستەم.",
      bullets: [
        { title: "ژێرخانی کلۆود", icon: Cloud },
        { title: "Deploy و ئۆتۆماتیک", icon: Zap },
        { title: "باشترکردنی ئەدا", icon: Monitor },
        { title: "پاراستنی داتاکان", icon: Lock }
      ],
    },
  },

  sec: {
    icon: ShieldCheck,
    color: "indigo",
    en: {
      title: "Cybersecurity Services",
      desc: "Advanced security shielding, vulnerability analysis, and zero-trust security architecture.",
      bullets: [
        { title: "Security Auditing", icon: ShieldCheck },
        { title: "System Hardening", icon: Lock },
        { title: "Identity Protection", icon: Database },
        { title: "Threat Intelligence", icon: Zap }
      ],
    },
    ar: {
      title: "حلول الأمن السيبراني",
      desc: "حماية أمنية متقدمة، تحليل للثغرات، وبناء معمارية أمنية قائمة على مبدأ الثقة الصفرية.",
      bullets: [
        { title: "تدقيق أمني متكامل", icon: ShieldCheck },
        { title: "تحصين الأنظمة", icon: Lock },
        { title: "حماية الهوية", icon: Database },
        { title: "ذكاء التهديدات", icon: Zap }
      ],
    },
    ku: {
      title: "پاراستنی سایبەری",
      desc: "پاراستنی پێشکەوتوو، پێداچوونەوەی ئاسایش، و ڕێنمایی بۆ بنیاتنانی سیستەمی پارێزراو.",
      bullets: [
        { title: "پێداچوونەوەی ئاسایش", icon: ShieldCheck },
        { title: "بەهێزکردنی سیستەم", icon: Lock },
        { title: "پاراستنی شوناس", icon: Database },
        { title: "هەواڵگری هەڕەشەکان", icon: Zap }
      ],
    },
  },
};

export default function ServicesTabs() {
  const { lang } = useApp() as { lang: Lang };
  const [active, setActive] = useState<TabKey>("dev");
  const [selectedDetail, setSelectedDetail] = useState<null | { title: string, icon: any }>(null);
  const isRtl = lang === "ar";

  const tab = data[active][lang];
  const activeIcon = data[active].icon;

  const tabs = [
    { key: "dev" as const, label: lang === "ar" ? "تطوير برمجيات" : lang === "ku" ? "گەشەپێدانی سۆفتوێر" : "Development", icon: Code2 },
    { key: "it" as const, label: lang === "ar" ? "تقنية وسحابة" : lang === "ku" ? "IT & کلۆود" : "Cloud Solutions", icon: Cloud },
    { key: "sec" as const, label: lang === "ar" ? "أمن سيبراني" : lang === "ku" ? "پاراستنی سایبەری" : "Cyber Security", icon: ShieldCheck },
  ];

  const translations = {
    quote: lang === "ar" ? "اطلب عرض سعر" : lang === "ku" ? "داواکردنی نرخ" : "Get a Proposal",
    work: lang === "ar" ? "تصفح المشاريع" : lang === "ku" ? "بینینی کارەکانمان" : "Explore Case Studies",
    more: lang === "ar" ? "معلومات تقنية متقدمة" : lang === "ku" ? "زانیاری تەکنییکی پێشکەوتوو" : "Advanced Technical Insights",
    close: lang === "ar" ? "إغلاق" : lang === "ku" ? "داخستن" : "Close",
    detailDesc: lang === "ar" 
      ? "تتضمن هذه الخدمة معايير هندسة برمجية عالمية، مع التركيز على الأداء العالي والأمن السيبراني لضمان أفضل تجربة مستخدم ممكنة وتوسعية لا محدودة."
      : lang === "ku"
      ? "ئەم خزمەتگوزارییە ستانداردە جیهانییەکانی ئەندازیاری سۆفتوێر لەخۆ دەگرێت، بە جەختکردنەوە لەسەر ئەدای بەرز و ئاسایشی سایبەری."
      : "This service incorporates world-class software engineering standards, focusing on high performance and cybersecurity to ensure the best UX and scalability."
  };

  return (
    <div className="relative">
      {/* Decorative Background Elements for the Section */}
      <div className="absolute -inset-20 pointer-events-none overflow-hidden">
        {/* Subtle Tech Grid */}
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34,211,238,0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} 
        />
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-10 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-10 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" 
        />
        
        {/* Floating Code Fragments */}
        <div className="absolute inset-0 opacity-[0.03] font-mono text-[10px] text-cyan-400 select-none hidden lg:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100%", x: `${10 + i * 15}%` }}
              animate={{ y: "-100%" }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
              className="absolute whitespace-nowrap"
              style={{ writingMode: 'vertical-rl' }}
            >
              {"<coding_logic> initialize_system(); push_to_cloud(); verify_security(); secure_access_granted; </coding_logic>".repeat(3)}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 space-y-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`
              w-full group relative flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-bold transition-all duration-500
              ${active === t.key 
                ? "text-white" 
                : "text-white/40 hover:text-white/90 bg-white/5 hover:bg-white/[0.08]"
              }
            `}
          >
            {active === t.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-white/20 rounded-[2rem] shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className={`
              z-10 p-2.5 rounded-xl transition-colors duration-300
              ${active === t.key ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/30 group-hover:text-white/60"}
            `}>
              <t.icon size={20} strokeWidth={2.5} />
            </span>

            <span className="z-10 text-base tracking-wide flex-1 text-start">
              {t.label}
            </span>

            <div className="z-10">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${active === t.key ? "bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]" : "bg-white/10"}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: isRtl ? -20 : 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner group-hover:shadow-cyan-500/10 transition-shadow duration-500">
                  {(() => {
                    const ActiveIcon = data[active].icon;
                    return <ActiveIcon size={32} strokeWidth={1.5} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    {tab.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed max-w-xl font-medium">
                    {tab.desc}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {tab.bullets.map((b, i) => {
                  const BulletIcon = b.icon;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDetail(b)}
                      className="group/item relative rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-5 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      {/* Click Ripple Effect */}
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: 4, 
                          opacity: [0, 0.4, 0],
                          transition: { duration: 0.6 }
                        }}
                        className="absolute inset-0 pointer-events-none bg-cyan-400/20 rounded-full blur-xl"
                      />

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover/item:text-cyan-400 group-hover/item:bg-cyan-500/10 transition-colors duration-300">
                          <BulletIcon size={18} />
                        </div>
                        <span className="text-sm font-bold text-white/80 group-hover/item:text-white transition-colors duration-300 leading-tight">
                          {b.title}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center border-t border-white/5 pt-10">
                <a
                  href="/contact"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-sm flex items-center justify-center gap-2 group/btn transition-all active:scale-95 shadow-xl shadow-cyan-950/20"
                >
                  {translations.quote}
                  <ArrowRight size={18} className={`transition-transform duration-300 ${isRtl ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`} />
                </a>
                <a
                  href="/case-studies"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-sm text-white/80 hover:text-white text-center transition-all active:scale-95"
                >
                  {translations.work}
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>

      {/* Modern Pop-up Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDetail(null)}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <X size={20} />
              </button>
              {/* Background Accent inside Modal */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center pb-12">
                <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-8 shadow-inner shadow-cyan-500/20">
                  {(() => {
                    const ModalIcon = selectedDetail.icon;
                    return <ModalIcon size={40} strokeWidth={1.5} />;
                  })()}
                </div>
                
                <div className="mb-2 text-cyan-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                  {translations.more}
                </div>
                
                <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                  {selectedDetail.title}
                </h2>
                
                <p className="text-white/60 text-lg leading-relaxed mb-10 font-medium">
                  {translations.detailDesc}
                </p>
                
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-12 py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all active:scale-95 shadow-xl"
                >
                  {translations.close}
                </button>
              </div>

              {/* Decorative Tech Elements in Modal */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-4 px-12 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <div className="flex items-center gap-2 font-mono text-[7px] text-cyan-400 uppercase tracking-[0.4em] whitespace-nowrap">
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(34,211,238,0.5)]" 
                  />
                  Protocol.Auth_Secure
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-cyan-500/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
