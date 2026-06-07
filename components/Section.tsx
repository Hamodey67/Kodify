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
  headerAlign = "start",
  dir,
}: {
  id?: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
  className?: string;
  accentTitle?: boolean;
  layout?: "default" | "split";
  headerAlign?: "start" | "center";
  dir?: "rtl" | "ltr";
}) {
  const isSplit = layout === "split";
  const centered = headerAlign === "center";

  const headerBlock = (
    <div
      className={cn(
        "group",
        isSplit ? "max-w-xl" : "max-w-3xl mb-8 sm:mb-10 md:mb-12",
        centered && "mx-auto text-center"
      )}
    >
      <motion.div
        initial={{ width: 32, opacity: 0 }}
        whileInView={{ width: isSplit ? 96 : 72, opacity: 1 }}
        viewport={{ once: true }}
        className={cn(
          "h-1 sm:h-1.5 bg-gradient-to-r from-[var(--accent-soft)] via-[var(--accent)] to-[var(--accent-strong)] rounded-full shadow-[0_0_16px_var(--accent-glow)]",
          isSplit ? "mb-8 lg:mb-10" : "mb-5 sm:mb-6",
          centered && "mx-auto"
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
            "leading-relaxed font-medium theme-muted",
            isSplit
              ? "text-lg lg:text-xl border-s-2 border-[var(--accent-border)] ps-5 lg:ps-6"
              : cn(
                  "text-base sm:text-lg max-w-2xl",
                  centered
                    ? "mx-auto"
                    : "border-s-2 border-[var(--accent-border)] ps-4 sm:ps-5"
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
      dir={dir}
      className={cn(
        "pt-16 sm:pt-24 md:pt-32 pb-12 md:pb-20 relative scroll-mt-48",
        isSplit && "lg:pb-24",
        className
      )}
    >
      {isSplit && (
        <div
          className="hidden lg:block absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(125,211,252,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.25) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {isSplit ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-16 items-center">
            <div className="lg:col-span-5 xl:col-span-4 mb-8 sm:mb-10 lg:mb-0 min-w-0">{headerBlock}</div>
            <div className="lg:col-span-7 xl:col-span-8 relative min-w-0">{children}</div>
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
