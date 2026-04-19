"use client";

import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { useApp } from "@/app/providers";

const services = [
  {
    key: "dev",
    icon: "💻",
    en: {
      title: "Software Development",
      desc: "Web apps, dashboards, admin panels, ERP/CRM, APIs & payments.",
      bullets: ["Company websites", "Dashboards & Admin", "ERP/CRM systems", "APIs & payments"],
      cta: "Request a Quote",
    },
    ar: {
      title: "تطوير برمجيات",
      desc: "مواقع وأنظمة ولوحات تحكم وتكاملات ودفع إلكتروني.",
      bullets: ["مواقع شركات", "لوحات تحكم و Admin", "أنظمة ERP/CRM", "تكامل APIs والدفع"],
      cta: "اطلب عرض سعر",
    },
  },
  {
    key: "it",
    icon: "☁️",
    en: {
      title: "IT & Cloud",
      desc: "Infrastructure, deployment, monitoring, backups, and scaling.",
      bullets: ["Server setup", "Deployments", "Monitoring", "Backup strategy"],
      cta: "Talk to us",
    },
    ar: {
      title: "حلول تقنية وسحابة",
      desc: "تهيئة السيرفرات، نشر المشاريع، مراقبة، نسخ احتياطي وتوسعة.",
      bullets: ["إعداد سيرفر", "نشر المشاريع", "مراقبة", "نسخ احتياطي"],
      cta: "تواصل معنا",
    },
  },
  {
    key: "sec",
    icon: "🔒",
    en: {
      title: "Cybersecurity",
      desc: "Security reviews, hardening, and secure architecture guidance.",
      bullets: ["Security audit", "Hardening", "Secure auth", "Threat modeling"],
      cta: "Secure my project",
    },
    ar: {
      title: "الأمن السيبراني",
      desc: "تدقيق أمني، تقوية النظام، وتوجيهات بنية آمنة.",
      bullets: ["تدقيق أمني", "Hardening", "مصادقة آمنة", "تحليل مخاطر"],
      cta: "أمّن مشروعي",
    },
  },
];

export default function ServicesGrid() {
  const { lang } = useApp();

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {services.map((s, idx) => {
        const x = lang === "ar" ? s.ar : s.en;

        return (
          <Reveal key={s.key} delayMs={idx * 90}>
            <TiltCard className="card card-hover p-6 h-full" maxRotate={10} glare>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-2xl">{s.icon}</div>
                  <div className="mt-2 text-lg font-extrabold text-white">{x.title}</div>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{x.desc}</p>
                </div>

                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-muted">
                  {lang === "ar" ? "Premium" : "Premium"}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {x.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/85">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex w-full justify-center px-5 py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-extrabold"
                >
                  {x.cta}
                </a>
              </div>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
