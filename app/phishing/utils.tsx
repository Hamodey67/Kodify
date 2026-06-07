"use client";

import React from "react";
import { Globe, Link2, ShieldAlert, Zap, type LucideIcon } from "lucide-react";
import type { Lang, Scenario } from "./data/scenarios";

export type ParsedSender = {
  displayName: string;
  email: string;
  domain: string;
  initials: string;
};

export type DomainPart = { text: string; suspicious?: boolean };

export type RedFlagItem = {
  id: string;
  title: string;
  detail: string;
  Icon: LucideIcon;
};

const URGENCY_PATTERNS: RegExp[] = [
  /30\s*(minutes?|min|minute|دقيقة|خولەک|خولەکدا)/gi,
  /24\s*(hours?|hour|ساعة|کاتژمێر)/gi,
  /within\s+\d+/gi,
  /today|اليوم|ئەمڕۆ/gi,
  /automatically|automatic|تعليق|خۆکارانە|suspend/gi,
  /locked|lock|قفل|دادەخرێت|ڕاگیر/gi,
  /urgent|immediately|فورًا|ڕاستەوخۆ/gi,
];

const FLAG_ICONS: LucideIcon[] = [Globe, Zap, Link2, ShieldAlert];

const FLAG_TITLES: Record<Lang, string[]> = {
  ar: ["دومين/مرسل مشبوه", "لغة استعجال", "رابط أو إجراء مشبوه", "علامة إضافية"],
  en: ["Suspicious sender/domain", "Urgency language", "Suspicious link/action", "Extra red flag"],
  ku: ["دۆمەین/نێرەر گوماناوی", "زمانی پەلەکردن", "لینک/کرداری گوماناوی", "نیشانەی زیادە"],
};

export function parseSender(from: string): ParsedSender {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    const displayName = match[1].trim();
    const email = match[2].trim();
    const domain = email.split("@")[1] ?? "";
    const initials = displayName
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return { displayName, email, domain, initials };
  }
  return { displayName: from, email: from, domain: "", initials: "?" };
}

export function highlightDomain(domain: string, isPhishing: boolean): DomainPart[] {
  if (!isPhishing) return [{ text: domain }];

  const markers = new Set<number>();

  for (let i = 0; i < domain.length - 4; i++) {
    if (domain.slice(i, i + 5).toLowerCase() === "micro" && domain[i + 5] === "0") {
      markers.add(i + 5);
    }
  }

  if (/apple-secure|micros0ft|company-payroll|security\.|secure\.|payroll/i.test(domain)) {
    const m = domain.match(/apple-secure|micros0ft|company-payroll|security|secure|payroll/gi);
    if (m) {
      for (const part of m) {
        const idx = domain.toLowerCase().indexOf(part.toLowerCase());
        if (idx >= 0) {
          for (let i = idx; i < idx + part.length; i++) markers.add(i);
        }
      }
    }
  }

  const parts: DomainPart[] = [];
  let buffer = "";
  let suspicious = false;

  for (let i = 0; i < domain.length; i++) {
    const mark = markers.has(i);
    if (buffer && mark !== suspicious) {
      parts.push({ text: buffer, suspicious });
      buffer = "";
    }
    buffer += domain[i];
    suspicious = mark;
  }
  if (buffer) parts.push({ text: buffer, suspicious });
  if (!parts.length) parts.push({ text: domain });

  return parts;
}

export function isSuspiciousSender(domain: string, isPhishing: boolean): boolean {
  if (!isPhishing) return false;
  return /secure|verify|login|payroll|micros0ft|apple-secure|security|company-payroll/i.test(domain);
}

export function highlightUrgency(text: string): React.ReactNode[] {
  const matches: { start: number; end: number }[] = [];

  for (const pattern of URGENCY_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length });
    }
  }

  if (!matches.length) return [text];

  matches.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const m of matches) {
    const last = merged[merged.length - 1];
    if (last && m.start <= last.end) last.end = Math.max(last.end, m.end);
    else merged.push({ ...m });
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  merged.forEach((m, i) => {
    if (cursor < m.start) nodes.push(text.slice(cursor, m.start));
    nodes.push(
      <mark
        key={`u-${i}`}
        className="rounded-sm bg-amber-500/15 px-0.5 font-medium text-amber-900 not-italic"
      >
        {text.slice(m.start, m.end)}
      </mark>
    );
    cursor = m.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

export function buildRedFlags(scenario: Scenario, lang: Lang): RedFlagItem[] {
  const titles = FLAG_TITLES[lang] ?? FLAG_TITLES.en;
  return scenario.reasons[lang].map((detail, i) => ({
    id: `${scenario.id}-${i}`,
    title: titles[i] ?? titles[titles.length - 1],
    detail,
    Icon: FLAG_ICONS[i % FLAG_ICONS.length],
  }));
}
