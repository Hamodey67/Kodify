"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/providers";

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

export default function Footer() {
  const { lang } = useApp() as { lang: Lang };
  const c = t[lang ?? "ar"];
  const isRtl = lang === "ar" || lang === "ku";

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[#050B14]">
      {/* Decorative Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
        <div className="absolute -right-24 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 pb-12">
        <div className="grid gap-16 lg:grid-cols-12 items-start">

          {/* Section 1: Brand (Vertical Alignment) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl bg-white/5 p-2 border border-white/10 shadow-2xl">
                  <Image
                    src="/kodify.png"
                    alt="Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase italic">
                  {c.aboutTitle}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-white/40 max-w-sm">
                {c.aboutText}
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                {c.status}
              </span>
            </div>
          </div>

          {/* Section 2: Contact List (Clean Layout) */}
          <div className="lg:col-span-5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 pb-2 border-b border-white/5 inline-block">
              {c.contact}
            </h4>

            <div className="grid gap-4">
              {/* Email */}
              <a
                href={`mailto:${c.email}`}
                className="group flex items-center gap-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] text-white/20 uppercase font-black tracking-widest">Email Address</span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">{c.email}</span>
                </div>
              </a>

              {/* Main Phone */}
              <a
                href={`tel:${c.phone}`}
                className="group flex items-center gap-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] text-white/20 uppercase font-black tracking-widest">Main Line</span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">{c.phone}</span>
                </div>
              </a>

              {/* Office Phone */}
              <a
                href={`tel:${c.phone2}`}
                className="group flex items-center gap-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] text-white/20 uppercase font-black tracking-widest">Office Support</span>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">{c.phone2}</span>
                </div>
              </a>

              {/* Location */}
              <div className="group flex items-center gap-5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
                <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[8px] text-white/20 uppercase font-black tracking-widest">HQ Location</span>
                  <span className="text-sm text-white/70">{c.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Links (Modern Sidebar style) */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 pb-2 border-b border-white/5 inline-block">
              {c.quick}
            </h4>
            <ul className="space-y-3">
              {c.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white/50 hover:text-white hover:bg-white/[0.07] hover:border-white/10 transition-all group"
                  >
                    <span>{link.label}</span>
                    <svg className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-white/5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                Deployment Build: {c.version}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-medium text-white/30 tracking-tight">
            {c.copyright}
          </p>
          <div className="flex items-center gap-8">
            {["System Policy", "Global Terms"].map(item => (
              <span key={item} className="text-[10px] uppercase font-black tracking-widest text-white/10 hover:text-white/30 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
