import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Section({
  id,
  title,
  desc,
  children,
  className,
}: {
  id?: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("pt-32 pb-16 relative overflow-hidden scroll-mt-48", className)}
    >
      {/* Decorative background blur for the section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mb-16 group">
          {/* Animated Accent Bar */}
          <motion.div 
            initial={{ width: 40, opacity: 0 }}
            whileInView={{ width: 64, opacity: 1 }}
            className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-8 shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
          />
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
            {title}
          </h2>

          {desc && (
            <p className="text-white/40 leading-relaxed text-lg md:text-xl max-w-2xl font-medium">
              {desc}
            </p>
          )}
        </div>

        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
}
