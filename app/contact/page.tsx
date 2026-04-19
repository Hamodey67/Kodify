"use client";

import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import { useApp } from "@/app/providers";
import { t } from "@/lib/i18n";

export default function ContactPage() {
  const { lang } = useApp();
  const tx = t[lang];

  return (
    <div className="min-h-screen">
      <Section title={tx.contactTitle} desc={tx.contactDesc}>
        <ContactForm />
      </Section>
      <Footer />
    </div>
  );
}
