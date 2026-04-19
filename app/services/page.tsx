"use client";

import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ServicesTabs from "@/components/ServicesTabs";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function ServicesPage() {
  const { lang } = useApp();
  const tx = t[lang];

  return (
    <div className="min-h-screen">

      <Section title={tx.servicesTitle} desc={tx.servicesDesc}>
        <ServicesTabs />
      </Section>

      <Footer />
    </div>
  );
}
