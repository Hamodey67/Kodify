"use client";

import Link from "next/link";
import { useApp } from "@/app/providers";

type Lang = "ar" | "en" | "ku";

const content = {
  ar: {
    badge: "نبذة سريعة",
    title: "من نحن",
    subtitle:
      "نحن فريق KODIFY — نطوّر حلول ويب حديثة وأمن سيبراني بواجهة فخمة، أداء عالي، وتجربة مستخدم مدروسة.",
    ctaPrimary: "تواصل ويانا",
    ctaSecondary: "شوف مشاريعنا",
    cards: [
      {
        t: "رؤيتنا",
        d: "تقديم حلول تقنية قوية، آمنة، وقابلة للتطوير تخدم المشاريع من أول خطوة إلى الإطلاق.",
      },
      {
        t: "مهمتنا",
        d: "تحويل الأفكار إلى منتجات حقيقية بأفضل الممارسات التقنية والتصميمية.",
      },
      {
        t: "قيمنا",
        d: "الجودة، الأمان، الشفافية، والدعم المستمر بعد تسليم المشروع.",
      },
    ],
    pillarsTitle: "مميزاتنا",
    pillars: [
      {
        t: "أمان من التصميم",
        d: "نطبق أفضل الممارسات + حماية أساسية من البداية حتى يصير المشروع ثابت.",
      },
      {
        t: "أداء وسرعة",
        d: "نحسن التحميل، الصور، وSEO حتى يصير الموقع سريع خصوصًا بالموبايل.",
      },
      {
        t: "تسليم مرتب",
        d: "كود نظيف + تنظيم ملفات + تسليم واضح حتى يصير التطوير بالمستقبل أسهل.",
      },
    ],
    statsTitle: "بالأرقام",
    stats: [
      { k: "مشاريع", v: "10+", d: "مواقع وأنظمة" },
      { k: "تحسين أداء", v: "60%", d: "تقليل عمل يدوي" },
      { k: "دعم", v: "24/7", d: "متابعة بعد التسليم" },
    ],
    howTitle: "شلون نشتغل؟",
    steps: [
      { t: "فهم الفكرة", d: "نحدد هدف المشروع والجمهور والمتطلبات بدقة." },
      { t: "تصميم Premium", d: "واجهة فخمة + تجربة استخدام واضحة ومريحة." },
      { t: "تنفيذ آمن وسريع", d: "أفضل الممارسات + أداء عالي + SEO مرتب." },
      { t: "إطلاق ودعم", d: "نرفع المشروع ونتابع وياك أي تحسينات." },
    ],
  },
  en: {
    badge: "Quick overview",
    title: "About us",
    subtitle:
      "We are KODIFY — premium web & cybersecurity services with high performance, clean UX, and reliable delivery.",
    ctaPrimary: "Contact us",
    ctaSecondary: "View projects",
    cards: [
      { t: "Our vision", d: "Builds strong, secure digital infrastructure" },
      {
        t: "Our mission",
        d: "Turn ideas into real products using best engineering & design practices.",
      },
      {
        t: "Our values",
        d: "Quality, security, transparency, and ongoing post-delivery support.",
      },
    ],
    pillarsTitle: "What you get",
    pillars: [
      { t: "Security by design", d: "Best practices + baseline hardening from day one." },
      { t: "High performance", d: "Optimized loading, images, and SEO — especially on mobile." },
      { t: "Clean delivery", d: "Readable code, solid structure, and smooth handoff." },
    ],
    statsTitle: "By the numbers",
    stats: [
      { k: "Projects", v: "10+", d: "Websites & systems" },
      { k: "Performance", v: "60%", d: "Less manual ops" },
      { k: "Support", v: "24/7", d: "After delivery" },
    ],
    howTitle: "How we work",
    steps: [
      { t: "Discover", d: "Define goals, audience, and requirements clearly." },
      { t: "Premium UI", d: "Elegant design + smooth, focused UX." },
      { t: "Secure build", d: "Best practices + speed + solid SEO." },
      { t: "Launch & support", d: "Deploy, monitor, and iterate with you." },
    ],
  },
  ku: {
    badge: "پوختەی خێرا",
    title: "دەربارەی ئێمە",
    subtitle:
      "ئێمە KODIFY ـین — چارەسەری وێب و ئاسایشی سایبەری پێشکەش دەکەین بە دیزاینێکی جوان و کارایی بەرز.",
    ctaPrimary: "پەیوەندیمان",
    ctaSecondary: "پرۆژەکان ببینە",
    cards: [
      { t: "بینینمان", d: "دروستکردنی چارەسەری بەهێز، پارێزراو و گەشەپێدراو." },
      { t: "ئامانجمان", d: "گۆڕینی بیرۆکە بۆ بەرهەمی ڕاستەقینە بە باشترین ڕێبازەکان." },
      { t: "بەهاکانمان", d: "کوالێتی، ئاسایش، ڕوونی، و پشتگیری بەردەوام." },
    ],
    pillarsTitle: "تایبەتمەندیەکانمان",
    pillars: [
      { t: "ئاسایش لە سەرەتاوە", d: "Best practices + پاراستنی بنچینەیی لە یەکەم ڕۆژ." },
      { t: "کارایی بەرز", d: "بارکردنی خێرا، باشکردنی وێنەکان، و SEO ـی باش." },
      { t: "گەیاندنی ڕێکخراو", d: "کۆدی پاک + ڕێکخستنی فایلەکان + گەیاندنی ڕوون." },
    ],
    statsTitle: "بە ژمارە",
    stats: [
      { k: "پرۆژە", v: "10+", d: "ماڵپەڕ و سیستەم" },
      { k: "کارایی", v: "60%", d: "کەمکردنەوەی کاری دەستی" },
      { k: "پشتگیری", v: "24/7", d: "دوای گەیاندن" },
    ],
    howTitle: "چۆن کار دەکەین؟",
    steps: [
      { t: "ناسین", d: "ئامانج و پێویستیەکان بە ڕوونی دیاری دەکەین." },
      { t: "UI جوان", d: "دیزاینێکی premium + UX نەرم." },
      { t: "دروستکردنی پارێزراو", d: "Best practices + خێرایی + SEO." },
      { t: "لانچ و پشتگیری", d: "Deploy و چاودێری و باشترکردن." },
    ],
  },
} as const;

function cn(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-black text-white">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-white/60">{subtitle}</p> : null}
    </div>
  );
}

export default function AboutPage() {
  const { lang } = useApp() as { lang: Lang };
  const c = content[lang ?? "ar"];

  return (
    <main className="relative overflow-x-clip">
      {/* الخلفية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-40 top-10 h-[560px] w-[560px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/3 -bottom-52 h-[720px] w-[720px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.06),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,.04),transparent_42%)]" />
      </div>

      {/* ✅ مهم: z-10 حتى ما تنغطي المحتويات بالخلفية */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* HERO */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-white/70">{c.badge}</span>
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-black text-white leading-[1.1]">
              {c.title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
              {c.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:opacity-90"
              >
                {c.ctaPrimary}
              </Link>

              <Link
                href="/#projects"
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/80 hover:bg-white/[0.07] hover:text-white"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* بطاقة فخمة يمين */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/15 blur-2xl" />
              <div className="pointer-events-none absolute -left-20 bottom-[-60px] h-60 w-60 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-white/80">KODIFY</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white/70">Premium delivery</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {c.cards.map((x) => (
                  <div
                    key={x.t}
                    className={cn(
                      "rounded-2xl border border-white/10 bg-white/[0.03] p-4",
                      "transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20"
                    )}
                  >
                    <div className="text-sm font-black text-white">{x.t}</div>
                    <div className="mt-1 text-sm text-white/65 leading-relaxed">{x.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* مميزاتنا */}
        <div className="mt-14">
          <SectionTitle title={c.pillarsTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {c.pillars.map((x) => (
              <div
                key={x.t}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7",
                  "shadow-[0_25px_120px_rgba(0,0,0,.35)]",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                )}
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-sky-400/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-2xl" />
                <h3 className="text-lg font-black text-white">{x.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{x.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* بالأرقام */}
        <div className="mt-14">
          <SectionTitle title={c.statsTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {c.stats.map((s) => (
              <div
                key={s.k}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="text-xs font-bold text-white/50">{s.k}</div>
                <div className="mt-3 text-4xl font-black text-white">{s.v}</div>
                <div className="mt-2 text-sm text-white/60">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* شلون نشتغل */}
        <div className="mt-14">
          <SectionTitle title={c.howTitle} />
          <div className="grid gap-6 md:grid-cols-2">
            {c.steps.map((st, i) => (
              <div
                key={st.t}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] font-black text-white/80">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{st.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{st.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:opacity-90"
            >
              {c.ctaPrimary}
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/80 hover:bg-white/[0.07] hover:text-white"
            >
              {lang === "ar"
                ? "رجوع للرئيسية"
                : lang === "ku"
                ? "گەڕانەوە بۆ سەرەکی"
                : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
