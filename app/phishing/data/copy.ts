import type { Lang } from "./scenarios";

export type PhishingCopy = {
  title: string;
  trainingBadge: string;
  desc: string;
  hint: string;
  bannerDismiss: string;
  footerNote: string;
  tipsTitle: string;
  tips: string[];
  whyTitle: string;
  whyLocked: string;
  safeLabel: string;
  phishLabel: string;
  nextLabel: string;
  lastLabel: string;
  restartLabel: string;
  doneTitle: string;
  doneScore: (score: number, total: number) => string;
  doneBestStreak: (n: number) => string;
  rankPro: string;
  rankHunter: string;
  rankRookie: string;
  unverifiedLabel: string;
  ctaTooltip: (url: string) => string;
  scoreLabel: string;
  streakLabel: string;
  roundLabel: string;
  progressLabel: string;
  shareLabel: string;
  copiedLabel: string;
  resultCorrect: string;
  resultWrong: string;
  shareText: (args: { score: number; total: number; streak: number }) => string;
};

const COPY: Record<Lang, PhishingCopy> = {
  ar: {
    title: "محاكي التصيّد",
    trainingBadge: "Training",
    desc: "اقرأ الرسالة واختر: آمنة أو خطر/احتيال — ثم راجع الأدلة.",
    hint: "تدريب فقط — لا تدخل بيانات حقيقية.",
    bannerDismiss: "إغلاق",
    footerNote: "ملاحظة: هذا تدريب فقط — لا تدخل بيانات حقيقية.",
    tipsTitle: "نصيحة سريعة",
    tips: [
      "دوم تحقق من الدومين الحقيقي (مثلاً: microsoft.com).",
      "أي رسالة بيها استعجال أو تهديد غالبًا مشبوهة.",
      "لا تسجل دخول من رابط داخل الرسالة — روح للموقع بنفسك.",
    ],
    whyTitle: "ليش؟ — الأدلة",
    whyLocked: "اختر حكمك على الرسالة لعرض تحليل الأدلة.",
    safeLabel: "آمنة",
    phishLabel: "خطر / احتيال",
    nextLabel: "التالي",
    lastLabel: "شوف النتيجة",
    restartLabel: "ابدأ من جديد",
    doneTitle: "انتهيت من التدريب",
    doneScore: (s, t) => `نتيجتك: ${s} / ${t}`,
    doneBestStreak: (n) => `أفضل سلسلة: ${n}`,
    rankPro: "Security Pro",
    rankHunter: "Phish Hunter",
    rankRookie: "Rookie",
    unverifiedLabel: "غير موثّق",
    ctaTooltip: (url) => `الرابط يوجّه إلى: ${url}`,
    scoreLabel: "النتيجة",
    streakLabel: "Streak",
    roundLabel: "تقدم التدريب",
    progressLabel: "التقدم",
    shareLabel: "شارك نتيجتي",
    copiedLabel: "تم النسخ",
    resultCorrect: "إجابة صحيحة",
    resultWrong: "إجابة غير صحيحة",
    shareText: ({ score, total, streak }) =>
      `اختبرت نفسي في محاكي التصيّد — ${score}/${total} مع streak ${streak}. جرّبه!`,
  },
  en: {
    title: "Phishing Simulator",
    trainingBadge: "Training",
    desc: "Read the message and choose Safe or Risk — then review the evidence.",
    hint: "Training only — never enter real credentials.",
    bannerDismiss: "Dismiss",
    footerNote: "Training only — never enter real credentials.",
    tipsTitle: "Quick tips",
    tips: [
      "Always verify the real domain (e.g., microsoft.com).",
      "Urgency and threats are common phishing tactics.",
      "Don't log in from email links — go to the site yourself.",
    ],
    whyTitle: "Why? — Evidence",
    whyLocked: "Submit your verdict to see the breakdown.",
    safeLabel: "Safe",
    phishLabel: "Risk / Scam",
    nextLabel: "Next",
    lastLabel: "See results",
    restartLabel: "Restart",
    doneTitle: "Training complete",
    doneScore: (s, t) => `Your score: ${s} / ${t}`,
    doneBestStreak: (n) => `Best streak: ${n}`,
    rankPro: "Security Pro",
    rankHunter: "Phish Hunter",
    rankRookie: "Rookie",
    unverifiedLabel: "Unverified",
    ctaTooltip: (url) => `Link goes to: ${url}`,
    scoreLabel: "Score",
    streakLabel: "Streak",
    roundLabel: "Training progress",
    progressLabel: "Progress",
    shareLabel: "Share my score",
    copiedLabel: "Copied",
    resultCorrect: "Correct",
    resultWrong: "Not quite",
    shareText: ({ score, total, streak }) =>
      `I scored ${score}/${total} on the Phishing Simulator (streak ${streak}). Try it!`,
  },
  ku: {
    title: "سیمیولەیتەری Phishing",
    trainingBadge: "Training",
    desc: "نامەکە بخوێنەوە و هەڵبژێرە: ئاسایی یان مەترسی/فێڵ — پاشان بەڵگەکان ببینە.",
    hint: "تەنها فێرکاری — هیچ زانیارییەکی ڕاست مەنووسە.",
    bannerDismiss: "داخستن",
    footerNote: "تێبینی: ئەمە تەنها فێرکارییە — هیچ زانیارییەکی ڕاست مەنووسە.",
    tipsTitle: "ئامۆژگاری خێرا",
    tips: [
      "هەمیشە دۆمەینی ڕاست پشکنە (وەک: microsoft.com).",
      "نامەی پڕ لە فشار یان هەڕەشە زۆرجار گوماناویە.",
      "لە ناو نامەوە چوونەژوورەوە مەکە — خۆت بڕۆ ماڵپەڕەکە.",
    ],
    whyTitle: "بۆچی؟ — بەڵگەکان",
    whyLocked: "بڕیارەکەت بدە بۆ بینینی شیکاری بەڵگەکان.",
    safeLabel: "ئاسایی",
    phishLabel: "مەترسی / فێڵ",
    nextLabel: "دواتر",
    lastLabel: "ئەنجام",
    restartLabel: "دووبارە دەستپێبکە",
    doneTitle: "فێرکاری تەواو بوو",
    doneScore: (s, t) => `ئەنجام: ${s} / ${t}`,
    doneBestStreak: (n) => `باشترین streak: ${n}`,
    rankPro: "Security Pro",
    rankHunter: "Phish Hunter",
    rankRookie: "Rookie",
    unverifiedLabel: "پشتڕاست نەکراو",
    ctaTooltip: (url) => `لینک دەچێتە: ${url}`,
    scoreLabel: "نمرە",
    streakLabel: "Streak",
    roundLabel: "پێشکەوتن",
    progressLabel: "پێشکەوتن",
    shareLabel: "هاوبەشکردنی ئەنجام",
    copiedLabel: "کۆپی کرا",
    resultCorrect: "ڕاستە",
    resultWrong: "هەڵەیە",
    shareText: ({ score, total, streak }) =>
      `نمرەم ${score}/${total} بوو لە سیمیولەیتەری Phishing (streak ${streak}). تۆش تاقی بکەرەوە!`,
  },
};

export function getPhishingCopy(lang: Lang): PhishingCopy {
  return COPY[lang] ?? COPY.en;
}
