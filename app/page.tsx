"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import FeatureGrid from "@/components/FeatureGrid";
import ServicesTabs from "@/components/ServicesTabs";
import ProjectsGrid from "@/components/ProjectsGrid";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";
import SecurityLab from "@/components/SecurityLab";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import { useApp } from "./providers";
import { t } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const { lang } = useApp();
  const tx = t[lang];

  return (
    <div className="min-h-screen">
      <Reveal>
        <Hero />
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={60}>
        <Section title={tx.featuresTitle} desc={tx.featuresDesc}>
          <FeatureGrid />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={80}>
        <Section title={tx.servicesTitle} desc={tx.servicesDesc} className="pt-0">
          <ServicesTabs />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={90}>
        <Section 
          title={lang === 'ar' ? "مشاريعنا" : lang === 'ku' ? "پڕۆژەکانمان" : "Our Projects"} 
          desc={lang === 'ar' ? "نظرة على بعض الأعمال والحلول الرقمية التي قمنا بتنفيذها باحترافية عالية." : lang === 'ku' ? "تەماشای هەندێک لەو کارانە بکە کە ئەنجاممان داون." : "A glimpse into some of the digital works and solutions we've executed with high professionalism."}
        >
          <ProjectsGrid />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={100}>
        <Section title={lang === 'ar' ? "مختبر الأمن" : lang === 'ku' ? "تاقیگەی ئاسایش" : "Security Lab"} desc={lang === 'ar' ? "اختبر مهاراتك في كشف التهديدات السيبرانية من خلال أدواتنا التفاعلية." : lang === 'ku' ? "خۆت تاقی بکەرەوە لە دۆزینەوەی مەترسییەکان." : "Test your skills in detecting cyber threats through our interactive simulation tools."}>
          <SecurityLab />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={110}>
        <Section title={tx.casesTitle} desc={tx.casesDesc}>
          <CaseStudiesGrid />
        </Section>
      </Reveal>

      <div className="section-divider" />

      <Reveal delayMs={90}>
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <CTA />
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}
