"use client";

import Footer from "@/components/Footer";
import Section from "@/components/Section";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";
import { blogPosts } from "@/lib/data";

type Lang = "ar" | "en" | "ku";

type BlogPost = {
  slug: string;
  date: string;
  arTitle: string;
  enTitle: string;
  kuTitle?: string;

  arSummary?: string;
  enSummary?: string;
  kuSummary?: string;
};

export default function BlogPage() {
  const { lang } = useApp() as { lang: Lang };
  const tx = t[lang];

  const sectionDesc =
    lang === "ar"
      ? "مقالات تقنية وأمنية تساعدك."
      : lang === "ku"
      ? "وتارەکانی تەکنەلۆجیا و پاراستنی سایبەری."
      : "Tech & security articles.";

  return (
    <div className="min-h-screen">
      <Section title={tx.nav.blog} desc={sectionDesc}>
        <div className="grid md:grid-cols-3 gap-4">
          {(blogPosts as BlogPost[]).map((p, idx) => {
            const title =
              lang === "ar"
                ? p.arTitle
                : lang === "ku"
                ? p.kuTitle ?? p.enTitle
                : p.enTitle;

            const summary =
              lang === "ar"
                ? p.arSummary ?? ""
                : lang === "ku"
                ? p.kuSummary ?? p.enSummary ?? ""
                : p.enSummary ?? "";

            return (
              <Reveal key={p.slug} delayMs={idx * 120}>
                {/* ✅ صار مجرد كارت (بدون Link وبدون صفحات) */}
                <div className="block">
                  <TiltCard
                    className="
                      card card-hover p-6 flex flex-col
                      min-h-[190px] sm:min-h-[210px]
                      cursor-default
                    "
                    maxRotate={12}
                    glare
                  >
                    <div className="text-xs text-white/60">{p.date}</div>

                    <div className="mt-2 font-extrabold text-white line-clamp-2">
                      {title}
                    </div>

                    <div className="mt-auto pt-3 text-sm text-muted line-clamp-2">
                      {summary}
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Footer />
    </div>
  );
}
