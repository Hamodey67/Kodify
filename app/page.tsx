"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import FeatureGrid from "@/components/FeatureGrid";
import ServicesTabs from "@/components/ServicesTabs";

import SecurityLab from "@/components/SecurityLab";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { useApp } from "./providers";
import { t } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const { lang } = useApp();
  const tx = t[lang];
  const isRtl = lang === "ar" || lang === "ku";

  return (
    <div className="min-h-screen">
      <Reveal>
        <Hero />
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={60}>
        <Section
          id="why-us"
          accentTitle
          headerAlign="start"
          title={tx.featuresTitle}
          desc={tx.featuresDesc}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <FeatureGrid />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={80}>
        <ServicesTabs />
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={100}>
        <Section title={lang === 'ar' ? "مختبر الأمن" : lang === 'ku' ? "تاقیگەی ئاسایش" : "Security Lab"} desc={lang === 'ar' ? "اختبر مهاراتك في كشف التهديدات السيبرانية من خلال أدواتنا التفاعلية." : lang === 'ku' ? "خۆت تاقی بکەرەوە لە دۆزینەوەی مەترسییەکان." : "Test your skills in detecting cyber threats through our interactive simulation tools."}>
          <SecurityLab />
        </Section>
      </Reveal>



      <Reveal delayMs={90}>
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <CTA />
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}
