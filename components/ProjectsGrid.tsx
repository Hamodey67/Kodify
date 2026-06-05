"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/app/providers";
import { ArrowUpRight, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import TiltCard from "@/components/TiltCard";

const projects = [
  {
    id: 1,
    ar: { title: "مجموعة باريزا", category: "عقارات واستثمار", desc: "منصة متكاملة لعرض المشاريع العقارية والاستثمارية وإدارتها باحترافية." },
    en: { title: "Bareza Group", category: "Real Estate", desc: "A comprehensive platform for showcasing and managing real estate and investment projects." },
    ku: { title: "کۆمەڵەی باریزا", category: "عەقارات", desc: "سەکۆیەکی گشتگیر بۆ پیشاندان و بەڕێوەبردنی پڕۆژە عەقاری و وەبەرهێنانەکان." },
    images: ["/bareza.png", "/barez1.png", "/barez2.png"],
    link: "https://barezagroup.com/en",
    colSpan: "md:col-span-2",
  },
  {
    id: 2,
    ar: { title: "سبينوزا كافيه", category: "ضيافة ومطاعم", desc: "تجربة مستخدم تفاعلية لطلب القهوة والمنتجات بكل سلاسة." },
    en: { title: "Spinoza Cafe", category: "Hospitality", desc: "An interactive user experience for ordering coffee and products seamlessly." },
    ku: { title: "سبینۆزا کافێ", category: "چێشتخانە", desc: "ئەزموونێکی کارلێکەری بەکارهێنەر بۆ داواکردنی قاوە و بەرهەمەکان بە شێوەیەکی ئاسان." },
    images: ["/spinoza.png", "/spinoza2.png", "/spinoza3.png"],
    link: "https://spinozacafe.com/en",
    colSpan: "md:col-span-1",
  },
  {
    id: 3,
    ar: { title: "بابليون جيتس", category: "فن وتصميم", desc: "معرض رقمي يسلط الضوء على الأعمال الفنية بلمسة عصرية." },
    en: { title: "Babylon Gates", category: "Art & Design", desc: "A digital gallery highlighting artworks with a modern touch." },
    ku: { title: "بابلیۆن گەیتس", category: "هونەر و دیزاین", desc: "پێشانگایەکی دیجیتاڵی کە تیشک دەخاتە سەر کارە هونەرییەکان بە شێوازێکی سەردەمیانە." },
    images: ["/1.png", "/2.png", "/3.png"],
    link: "https://babylongates.art/",
    colSpan: "md:col-span-1",
  },
  {
    id: 4,
    ar: { title: "أدم سبورت", category: "متجر رياضي", desc: "منصة تجارة إلكترونية متكاملة لبيع الملابس والمستلزمات الرياضية." },
    en: { title: "ADMSPOORT", category: "Sports Store", desc: "An integrated e-commerce platform for selling sportswear and equipment." },
    ku: { title: "ئەدم سپۆرت", category: "فرۆشگای وەرزشی", desc: "سەکۆیەکی بازرگانی ئەلیکترۆنی بۆ فرۆشتنی جلوبەرگ و پێداویستییە وەرزشییەکان." },
    images: ["/admsop1.png"],
    link: "https://admspoort.com/",
    colSpan: "md:col-span-2",
  }
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
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.12, y: -5 }}
          animate={{ opacity: 1, scale: 1.02, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </AnimatePresence>
      
      {/* Deeper premium dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent opacity-95 group-hover:opacity-85 transition-opacity duration-700" />
      
      {/* Indicator dots */}
      {images.length > 1 && (
        <div className="absolute top-6 right-6 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 rounded-full transition-all duration-500",
                index === i ? "bg-cyan-400 h-4 shadow-[0_0_12px_rgba(34,211,238,1)]" : "bg-white/30 h-1.5"
              )} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsGrid() {
  const { lang } = useApp();
  const isRtl = lang === 'ar' || lang === 'ku';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {projects.map((project, idx) => {
        const content = lang === 'ar' ? project.ar : lang === 'ku' ? project.ku : project.en;
        
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className={cn("group flex", project.colSpan)}
          >
            <TiltCard 
              maxRotate={4} 
              glare={true} 
              className="w-full h-full rounded-[2.5rem] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden cursor-pointer flex flex-col relative"
            >
              {/* Inner wrapper for proper transform context */}
              <div className="relative w-full h-full min-h-[420px] flex flex-col justify-end p-8 md:p-10 z-10 [transform:translateZ(30px)]">
                
                {/* Background Slider */}
                <div className="absolute inset-0 -z-10 rounded-[2.5rem] overflow-hidden [transform:translateZ(-30px)]">
                  <ProjectSlider images={project.images} />
                </div>

                {/* Dot Grid Texture Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:16px_16px] opacity-50 mix-blend-overlay pointer-events-none -z-10" />

                {/* Content Overlay */}
                <div className="relative z-20 flex flex-col h-full justify-between">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    <span className="px-4 py-1.5 rounded-full bg-white/5 dark:bg-slate-900/40 border border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-md text-cyan-300 text-[10px] font-extrabold uppercase tracking-widest hover:border-cyan-500/30 transition-all duration-300">
                      {content.category}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="mt-auto transform transition-all duration-500 group-hover:translate-y-[-8px]">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/75 group-hover:from-white group-hover:to-cyan-300 transition-all duration-700 mb-3 tracking-tight drop-shadow-md">
                      {content.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base font-medium max-w-md leading-relaxed mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {content.desc}
                    </p>

                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white hover:text-slate-950 hover:border-transparent transition-all duration-350 shadow-[0_4px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] group/btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lang === 'ar' ? "استكشف المشروع" : lang === 'ku' ? "پڕۆژەکە ببینە" : "Explore Project"}
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover/btn:rotate-45" />
                    </a>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px] -z-10 rounded-full group-hover:bg-cyan-400/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/10 blur-[100px] -z-10 rounded-full group-hover:bg-sky-400/20 transition-colors duration-700" />
              </div>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}
