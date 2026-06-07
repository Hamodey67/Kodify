"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/providers";
import { useEffect, useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";
import { Mail, Phone, Building2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

type Lang = "ar" | "en" | "ku";

const t = {
  ar: {
    contact: "تواصل معنا",
    quick: "روابط سريعة",
    aboutTitle: "KODIFY",
    aboutText:
      "نقدّم حلول ويب وأمن سيبراني بواجهة فخمة وأداء عالي. شغلنا مو مجرد كود—نرتّب تجربة كاملة.",
    email: "kodifyy0@gmail.com",
    phone: "07710342727",
    phone2: "07510342727",
    location: "العراق ، بغداد ، أربيل",
    links: [
      { label: "اتصل بنا", href: "/contact" },
      { label: "من نحن", href: "/about" },
    ],
    copyright: "© 2026 KODIFY. جميع الحقوق محفوظة.",
    version: "الإصدار 1.00",
    status: "متصل",
  },
  en: {
    contact: "Contact",
    quick: "Quick links",
    aboutTitle: "KODIFY",
    aboutText:
      "Premium web & cybersecurity services with high performance and clean delivery.",
    email: "kodifyy0@gmail.com",
    phone: "07710342727",
    phone2: "07510342727",
    location: "Erbil, Baghdad, Iraq",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "About", href: "/about" },
    ],
    copyright: "© 2026 KODIFY. All rights reserved.",
    version: "v1.00",
    status: "Online",
  },
  ku: {
    contact: "پەیوەندی",
    quick: "بەستەری خێرا",
    aboutTitle: "KODIFY",
    aboutText:
      "خزمەتگوزاری وێب و ئاسایشی سایبەری بە دیزاینێکی جوان و کارایی بەرز.",
    email: "kodifyy0@gmail.com",
    phone: "07710342727",
    phone2: "07510342727",
    location: "بەغدا، ھەولێر، عێراق",
    links: [
      { label: "پەیوەندیمان", href: "/contact" },
      { label: "دەربارە", href: "/about" },
    ],
    copyright: "© 2026 KODIFY. مافەکان پارێزراون.",
    version: "وەشان 1.0.0",
    status: "سەرهێڵ",
  },
} as const;

type ContactItem = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
};

function ContactCard({ icon, label, value, href }: ContactItem) {
  const inner = (
    <>
      <div className="footer-contact-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-[var(--accent-bright)]">
        {icon}
      </div>
      <div className="min-w-0 space-y-1">
        <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
          {label}
        </span>
        <span className="block text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
          {value}
        </span>
      </div>
    </>
  );

  const className =
    "footer-glass-card group flex items-center gap-4 rounded-2xl p-3.5 sm:p-4";

  if (href) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }

  return <div className={cn(className, "cursor-default")}>{inner}</div>;
}

export default function Footer() {
  const { lang, theme } = useApp() as { lang: Lang; theme: string };
  const c = t[lang ?? "ar"];
  const isRtl = lang === "ar" || lang === "ku";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && theme === "light" ? "/logo1.png" : "/kodify.png";
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const arrowHoverClass = isRtl
    ? "group-hover:-translate-x-1"
    : "group-hover:translate-x-1";

  const contactItems: ContactItem[] = [
    {
      icon: <Mail size={18} strokeWidth={1.75} />,
      label: "Email Address",
      value: c.email,
      href: `mailto:${c.email}`,
    },
    {
      icon: <Phone size={18} strokeWidth={1.75} />,
      label: "Main Line",
      value: c.phone,
      href: `tel:${c.phone}`,
    },
    {
      icon: <Building2 size={18} strokeWidth={1.75} />,
      label: "Office Support",
      value: c.phone2,
      href: `tel:${c.phone2}`,
    },
    {
      icon: <MapPin size={18} strokeWidth={1.75} />,
      label: "HQ Location",
      value: c.location,
    },
  ];

  return (
    <footer className="footer-premium relative mt-20 overflow-hidden transition-colors duration-300">
      {/* Top glowing divider */}
      <div className="footer-top-glow absolute inset-x-0 top-0 z-20" />

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 footer-grid-texture opacity-80" />
      <div className="pointer-events-none absolute inset-0 footer-mesh-glow" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-[var(--accent-primary)]/[0.05] blur-[90px]" />
        <div className="absolute -right-24 top-0 h-[280px] w-[280px] rounded-full bg-[var(--accent-glow)]/[0.04] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 py-12 md:py-14 pb-8">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand block */}
          <Reveal delayMs={0} className="lg:col-span-4">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-[0_0_28px_rgba(43,127,255,0.18)]">
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    fill
                    className="object-contain p-1.5 transition-opacity duration-300"
                  />
                </div>
                <h2 className="footer-logo-glow text-3xl font-black uppercase italic tracking-widest text-white">
                  {c.aboutTitle}
                </h2>
              </div>

              <p
                className={cn(
                  "max-w-sm text-sm font-medium leading-[1.85] text-white/78",
                  isRtl && "font-[family-name:var(--font-cairo)]"
                )}
              >
                {c.aboutText}
              </p>

              <div className="footer-status-pill inline-flex items-center gap-3 rounded-2xl px-4 py-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="footer-status-dot absolute inline-flex h-full w-full rounded-full bg-[var(--accent-bright)]" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/75">
                  {c.status}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delayMs={90} className="lg:col-span-5">
            <div className="space-y-5">
              <h4 className="footer-section-title">{c.contact}</h4>
              <div className="grid gap-3">
                {contactItems.map((item) => (
                  <ContactCard key={item.label} {...item} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal delayMs={180} className="lg:col-span-3">
            <div className="space-y-5">
              <h4 className="footer-section-title">{c.quick}</h4>
              <ul className="space-y-2.5">
                {c.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "footer-quick-link group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/65",
                        isRtl && "font-[family-name:var(--font-cairo)]"
                      )}
                    >
                      <span>{link.label}</span>
                      <ArrowIcon
                        size={15}
                        strokeWidth={2.5}
                        className={cn(
                          "shrink-0 text-white/30 transition-all duration-200 group-hover:text-[var(--accent-bright)]",
                          arrowHoverClass
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/8 pt-5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Deployment Build: {c.version}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <Reveal delayMs={240}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/8 pt-7 md:flex-row">
            <p
              className={cn(
                "text-[11px] font-medium tracking-tight text-white/50",
                isRtl && "font-[family-name:var(--font-cairo)]"
              )}
            >
              {c.copyright}
            </p>
            <div className="flex items-center gap-6 sm:gap-8">
              {["System Policy", "Global Terms"].map((item) => (
                <span
                  key={item}
                  className="footer-bottom-link cursor-pointer text-[10px] font-black uppercase tracking-widest text-white/25"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
