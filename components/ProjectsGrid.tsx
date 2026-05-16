"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/app/providers";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

const projects = [
  {
    id: 1,
    ar: { title: "مجموعة باريزا", category: "عقارات واستثمار" },
    en: { title: "Bareza Group", category: "Real Estate" },
    ku: { title: "کۆمەڵەی باریزا", category: "عەقارات" },
    images: ["/bareza.png", "/barez1.png", "/barez2.png"],
    link: "https://barezagroup.com/en"
  },
  {
    id: 2,
    ar: { title: "سبينوزا كافيه", category: "ضيافة ومطاعم" },
    en: { title: "Spinoza Cafe", category: "Hospitality" },
    ku: { title: "سبینۆزا کافێ", category: "چێشتخانە" },
    images: ["/spinoza.png", "/spinoza2.png", "/spinoza3.png"],
    link: "https://spinozacafe.com/en"
  },
  {
    id: 3,
    ar: { title: "بابليون جيتس", category: "فن وتصميم" },
    en: { title: "Babylon Gates", category: "Art & Design" },
    ku: { title: "بابلیۆن گەیتس", category: "هونەر و دیزاین" },
    images: ["/1.png", "/2.png", "/3.png"],
    link: "https://babylongates.art/"
  },
  {
    id: 4,
    ar: { title: "أدم سبورت", category: "متجر رياضي" },
    en: { title: "ADMSPOORT", category: "Sports Store" },
    ku: { title: "ئەدم سپۆرت", category: "فرۆشگای وەرزشی" },
    images: ["/admsop1.png"],
    link: "https://admspoort.com/"
  }
];

function ProjectSlider({ images }: { images: string[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === i ? "bg-white w-4" : "bg-white/30"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
      {projects.map((project, idx) => {
        const content = lang === 'ar' ? project.ar : lang === 'ku' ? project.ku : project.en;
        
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-card border border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-accent/20">
              <ProjectSlider images={project.images} />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl shadow-black/40"
                  >
                    {lang === 'ar' ? "زيارة الموقع" : lang === 'ku' ? "سەردانی ماڵپەڕ" : "Visit Website"}
                    <ArrowUpRight size={16} />
                  </a>
              </div>

              {/* Category Badge */}
              <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none z-20">
                 <span className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    {content.category}
                 </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="mt-8 px-4">
               <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors">
                    {content.title}
                  </h3>
                  <div className="h-px flex-1 bg-border group-hover:bg-accent/20 transition-colors" />
               </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
