import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Section({
  id,
  title,
  desc,
  children,
  className,
  accentTitle = false,
  layout = "default",
}: {
  id?: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
  className?: string;
  accentTitle?: boolean;
  layout?: "default" | "split";
}) {
  const isSplit = layout === "split";

  const headerBlock = (
    <div
      className={cn(
        "group",
        isSplit
          ? "lg:sticky lg:top-28 lg:self-start max-w-xl"
          : "max-w-3xl mb-8 sm:mb-12 md:mb-16"
      )}
    >
      <motion.div
        initial={{ width: 32, opacity: 0 }}
        whileInView={{ width: isSplit ? 96 : 72, opacity: 1 }}
        viewport={{ once: true }}
        className={cn(
          "h-1 sm:h-1.5 bg-gradient-to-r from-[var(--accent-soft)] via-[var(--accent)] to-[var(--accent-strong)] rounded-full shadow-[0_0_16px_var(--accent-glow)]",
          isSplit ? "mb-8 lg:mb-10" : "mb-5 sm:mb-8"
        )}
      />

      <h2
        className={cn(
          "font-black tracking-tight",
          isSplit
            ? "text-4xl lg:text-5xl xl:text-6xl mb-6 lg:mb-8 leading-[1.1]"
            : "text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6",
              accentTitle ? "hero-gradient" : "theme-heading"
        )}
      >
        {title}
      </h2>

      {desc && (
        <p
          className={cn(
            "leading-relaxed font-medium",
            isSplit
              ? "text-lg lg:text-xl theme-muted border-s-2 border-[var(--accent-border)] ps-5 lg:ps-6"
              : cn(
                  "text-base sm:text-lg md:text-xl max-w-2xl",
                  accentTitle
                    ? "theme-muted border-s-2 border-[var(--accent-border)] ps-4 sm:ps-5"
                    : "theme-muted"
                )
          )}
        >
          {desc}
        </p>
      )}

      {isSplit && accentTitle && (
        <div className="hidden lg:flex mt-10 gap-3 flex-wrap">
          {["SECURE", "FAST", "CLEAN", "24/7"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[10px] font-black tracking-[0.2em] theme-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section
      id={id}
      className={cn(
        "pt-16 sm:pt-24 md:pt-32 pb-12 md:pb-20 relative overflow-hidden scroll-mt-48",
        isSplit && "lg:pb-24",
        className
      )}
    >
      {isSplit && (
        <div
          className="hidden lg:block absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(125,211,252,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.25) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      )}

      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 relative z-10">
        {isSplit ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-20 items-start">
            <div className="lg:col-span-4 mb-8 sm:mb-10 lg:mb-0">{headerBlock}</div>
            <div className="lg:col-span-8 relative">{children}</div>
          </div>
        ) : (
          <>
            {headerBlock}
            <div className="relative">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}
