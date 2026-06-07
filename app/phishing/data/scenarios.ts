export type Lang = "ar" | "en" | "ku";

export type Scenario = {
  id: number;
  channel: "email";
  // localized content
  from: Record<Lang, string>;
  to: Record<Lang, string>;
  subject: Record<Lang, string>;
  body: Record<Lang, string[]>;
  ctaText: Record<Lang, string>;
  ctaUrl: string;
  isPhishing: boolean;
  reasons: Record<Lang, string[]>;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    channel: "email",
    from: {
      ar: "Apple Support <support@apple-secure.co>",
      en: "Apple Support <support@apple-secure.co>",
      ku: "Apple Support <support@apple-secure.co>",
    },
    to: { ar: "إليك <you@example.com>", en: "You <you@example.com>", ku: "تۆ <you@example.com>" },
    subject: {
      ar: "سيتم قفل Apple ID الخاص بك خلال 30 دقيقة",
      en: "Your Apple ID will be locked in 30 minutes",
      ku: "ئەکاونتی Apple ID لە ماوەی ٣٠ خولەکدا دادەخرێت",
    },
    body: {
      ar: [
        "اكتشفنا نشاطًا غير معتاد على حسابك.",
        "لمنع الإيقاف, يرجى التحقق من هويتك خلال 30 دقيقة.",
        "إذا لم تتخذ إجراءً, سيتم تعليق الحساب تلقائيًا.",
      ],
      en: [
        "We detected unusual activity on your account.",
        "To prevent suspension, verify your identity within 30 minutes.",
        "If no action is taken, your account will be suspended automatically.",
      ],
      ku: [
        "چالاکییەکی نامۆمان لەسەر ئەکاونتەکەت بەدی کردووە.",
        "بۆ ڕێگری لە ڕاگرتنی کاتی، لە ماوەی ٣٠ خولەکدا ناسنامەکەت پشتڕاست بکەرەوە.",
        "ئەگەر هیچ کارێک نەکەیت، ئەکاونتەکەت بە شێوەیەکی خۆکارانە ڕادەگیرێت.",
      ],
    },
    ctaText: { ar: "تحقق من الحساب", en: "Verify Account", ku: "پشتڕاستکردنەوەی ئەکاونت" },
    ctaUrl: "http://apple-secure.co/login",
    isPhishing: true,
    reasons: {
      ar: ["الدومين مو رسمي (مو apple.com)", "أسلوب استعجال وتهديد", "الرابط http وليس https"],
      en: ["Domain is not official (not apple.com)", "Urgency + threat language", "Link uses http not https"],
      ku: ["دۆمەینەکە فەرمی نییە (apple.com نییە)", "فشاری کات + زمانی هەڕەشەکردن", "لینکی پڕۆتۆکۆلی http بەکاردێنێت نەک https"],
    },
  },
  {
    id: 2,
    channel: "email",
    from: {
      ar: "Microsoft 365 <no-reply@micros0ft-security.com>",
      en: "Microsoft 365 <no-reply@micros0ft-security.com>",
      ku: "Microsoft 365 <no-reply@micros0ft-security.com>",
    },
    to: { ar: "إليك <you@example.com>", en: "You <you@example.com>", ku: "تۆ <you@example.com>" },
    subject: {
      ar: "تم إيقاف تسجيل الدخول — راجع نشاطك الآن",
      en: "Sign-in suspended — review activity now",
      ku: "چوونەژوورەوە ڕاگیرا — ئێستا چالاکییەکانت بپشکنە",
    },
    body: {
      ar: [
        "تم إيقاف تسجيل الدخول بسبب محاولة غير معروفة.",
        "راجع النشاط من خلال الرابط أدناه لاستعادة الوصول.",
        "ملاحظة: إذا لم تراجع خلال 24 ساعة سيتم حذف جلساتك.",
      ],
      en: [
        "Sign-in has been suspended due to an unknown attempt.",
        "Review the activity using the link below to restore access.",
        "Note: If not reviewed within 24 hours, sessions will be removed.",
      ],
      ku: [
        "چوونەژوورەوە ڕاگیرا بەهۆی هەوڵێکی نەناسراوەوە.",
        "لە ڕێگەی لینکی خوارەوە چالاکییەکە بپشکنە بۆ گەڕاندنەوەی دەستڕاگەیشتن.",
        "تێبینی: ئەگەر لە ماوەی ٢٤ کاتژمێردا پشکنین نەکەیت، سەرجەم چوونەژوورەوەکانت (سێشنەکان) دەسڕدرێنەوە.",
      ],
    },
    ctaText: { ar: "مراجعة النشاط", en: "Review activity", ku: "بەسەرکردنەوەی چالاکی" },
    ctaUrl: "https://micros0ft-security.com/login",
    isPhishing: true,
    reasons: {
      ar: ["حرف 0 بدل o في الدومين (micros0ft)", "الرابط خارج microsoft.com", "تهديد بحذف الجلسات"],
      en: ["Domain uses 0 instead of o (micros0ft)", "Link is outside microsoft.com", "Threat to remove sessions"],
      ku: ["بەکارهێنانی ژمارە 0 لەبری پیتی o لە دۆمەینەکەدا (micros0ft)", "لینکەکە فەرمی نییە و ناچێتەوە سەر microsoft.com", "زمانی هەڕەشەکردن بە سڕینەوەی سەرجەم سێشنەکان"],
    },
  },
  {
    id: 3,
    channel: "email",
    from: {
      ar: "DHL Delivery <tracking@dhl.com>",
      en: "DHL Delivery <tracking@dhl.com>",
      ku: "DHL Delivery <tracking@dhl.com>",
    },
    to: { ar: "إليك <you@example.com>", en: "You <you@example.com>", ku: "تۆ <you@example.com>" },
    subject: {
      ar: "تحديث حالة الشحنة: تم تغيير موعد التسليم",
      en: "Shipment status update: delivery rescheduled",
      ku: "نوێکردنەوەی بارکەش: کاتی گەیاندن گۆڕدرا",
    },
    body: {
      ar: [
        "تم تغيير موعد تسليم شحنتك بناءً على طلبك.",
        "إذا كان هذا غير صحيح, افتح صفحة التتبع الرسمية من موقع DHL.",
        "رقم التتبع: 1234567890 (مثال)",
      ],
      en: [
        "Your delivery time was changed based on your request.",
        "If this is incorrect, open the official tracking page from the DHL website.",
        "Tracking number: 1234567890 (example)",
      ],
      ku: [
        "کاتی گەیاندنی بارەکەت گۆڕدراوە بەپێی داواکاری خۆت.",
        "ئەگەر ئەمە هەڵەیە، تکایە پەڕەی فەرمی بەدواداچوون لە ماڵپەڕی DHL بکەرەوە.",
        "ژمارەی بەدواداچوون (Tracking): 1234567890 (نموونە)",
      ],
    },
    ctaText: { ar: "فتح تتبع DHL", en: "Open DHL tracking", ku: "بینینی بەدواداچوونی DHL" },
    ctaUrl: "https://www.dhl.com/",
    isPhishing: false,
    reasons: {
      ar: ["الدومين رسمي dhl.com", "ماكو استعجال/تهديد", "يوجهك للموقع الرسمي مو رابط تسجيل دخول"],
      en: ["Official domain dhl.com", "No urgency/threat", "Directs to official site (not a login link)"],
      ku: ["دۆمەینەکە فەرمییە dhl.com", "هیچ زمانێکی پەلەکردن یان هەڕەشەی تێدا نییە", "بەرەو ماڵپەڕی فەرمی دەبات نەک لاپەڕەی چوونەژوورەوەی گوماناوی"],
    },
  },
  {
    id: 4,
    channel: "email",
    from: {
      ar: "HR Team <hr@company-payroll.com>",
      en: "HR Team <hr@company-payroll.com>",
      ku: "HR Team <hr@company-payroll.com>",
    },
    to: { ar: "إليك <you@example.com>", en: "You <you@example.com>", ku: "تۆ <you@example.com>" },
    subject: {
      ar: "مستند الرواتب — مطلوب تحديث المعلومات اليوم",
      en: "Payroll document — info update required today",
      ku: "پسوڵەی مووچە — پێویستە ئەمڕۆ زانیارییەکانت نوێ بکەیتەوە",
    },
    body: {
      ar: [
        "تم تحديث نموذج الرواتب لهذا الشهر.",
        "يرجى تنزيل المستند ومراجعة المعلومات وإرساله خلال اليوم.",
        "الملف محمي بكلمة مرور: 1234",
      ],
      en: [
        "The payroll form has been updated for this month.",
        "Please download, review, and send it back today.",
        "File password: 1234",
      ],
      ku: [
        "فۆرمی مووچەی ئەم مانگە نوێکراوەتەوە.",
        "تکایە دایبگرە، بەسەری بکەرەوە و هەر ئەمڕۆ بینێرەوە.",
        "وشەی نهێنی فایلەکە: 1234",
      ],
    },
    ctaText: { ar: "تنزيل المستند", en: "Download document", ku: "داگرتنی بەڵگەنامەکە" },
    ctaUrl: "https://company-payroll.com/payroll-update.pdf",
    isPhishing: true,
    reasons: {
      ar: ["دومين غير معروف وغير تابع لشركتك", "ضغط زمني: (اليوم)", "مشاركة كلمة مرور داخل الرسالة علامة خطر"],
      en: ["Unknown domain not tied to your org", "Time pressure: today", "Sharing passwords in email is a red flag"],
      ku: ["دۆمەینێکی نەناسراوە و سەر بە کۆمپانیاکەت نییە", "فشاری کات: پێویستە هەر ئەمڕۆ ئەنجام بدرێت", "ناردنی وشەی نهێنی فایل لە ناو خودی ئیمەیڵەکەدا نیشانەیەکی گوماناوی بەهێزە"],
    },
  },
  {
    id: 5,
    channel: "email",
    from: {
      ar: "GitHub <noreply@github.com>",
      en: "GitHub <noreply@github.com>",
      ku: "GitHub <noreply@github.com>",
    },
    to: { ar: "إليك <you@example.com>", en: "You <you@example.com>", ku: "تۆ <you@example.com>" },
    subject: {
      ar: "تم إنشاء مفتاح SSH جديد على حسابك",
      en: "A new SSH key was added to your account",
      ku: "کلیلی نوێی SSH بۆ ئەکاونتەکەت زیادکرا",
    },
    body: {
      ar: [
        "تم إضافة مفتاح SSH جديد إلى حسابك.",
        "إذا لم تكن أنت, راجع إعدادات الأمان فورًا من داخل GitHub.",
      ],
      en: [
        "A new SSH key was added to your account.",
        "If this wasn't you, review your security settings directly in GitHub immediately.",
      ],
      ku: [
        "کلیلی نوێی SSH بۆ ئەکاونتەکەت زیادکراوە.",
        "ئەگەر ئەمە کار و چالاکی تۆ نییە، تکایە ڕاستەوخۆ لە GitHub ڕێکخستنەکانی ئاسایش بپشکنە.",
      ],
    },
    ctaText: { ar: "فتح GitHub", en: "Open GitHub", ku: "کردنەوەی GitHub" },
    ctaUrl: "https://github.com/settings/keys",
    isPhishing: false,
    reasons: {
      ar: ["الدومين رسمي github.com", "يرشدك لإعدادات داخل GitHub", "محتوى واضح بدون روابط غريبة"],
      en: ["Official domain github.com", "Points to GitHub settings", "Clear content without odd links"],
      ku: ["دۆمەینی فەرمی github.com ـە", "بەرەو بەشی ڕێکخستنەکانی خودی GitHub دەچێت", "ناوەڕۆکەکەی ڕوونە و هیچ لینکێکی دەرەکی گوماناوی تێدا نییە"],
    },
  },
];

export function getScenarios() {
  return SCENARIOS;
}
