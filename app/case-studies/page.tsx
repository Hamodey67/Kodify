"use client";

import Footer from "@/components/Footer";
import Section from "@/components/Section";
import CaseStudiesGrid from "@/components/CaseStudiesGrid";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function CaseStudiesPage() {
  const { lang } = useApp();
  const tx = t[lang];

  return (
    <div className="min-h-screen">
      <Section title={tx.casesTitle} desc={tx.casesDesc}>
        <CaseStudiesGrid />
      </Section>
      <Footer />
    </div>
  );
}
