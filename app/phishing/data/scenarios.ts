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
      ku: "ئەکاونتی Apple ID لە 30 خولەکدا قوفڵ دەبێت",
    },
    body: {
      ar: [
        "اكتشفنا نشاطًا غير معتاد على حسابك.",
        "لمنع الإيقاف، يرجى التحقق من هويتك خلال 30 دقيقة.",
        "إذا لم تتخذ إجراءً، سيتم تعليق الحساب تلقائيًا.",
      ],
      en: [
        "We detected unusual activity on your account.",
        "To prevent suspension, verify your identity within 30 minutes.",
        "If no action is taken, your account will be suspended automatically.",
      ],
      ku: [
        "چالاکییەکی ناوازەمان لەسەر ئەکاونتەکەت بینیوە.",
        "بۆ ڕێگری لە ڕاگرتن، لە 30 خولەکدا ناسنامەت پشتڕاست بکە.",
        "ئەگەر هیچ کارێک نەکەیت، ئەکاونتەکەت خۆکارانە ڕادەگیرێت.",
      ],
    },
    ctaText: { ar: "تحقق من الحساب", en: "Verify Account", ku: "پشتڕاستکردنەوەی ئەکاونت" },
    ctaUrl: "http://apple-secure.co/login",
    isPhishing: true,
    reasons: {
      ar: ["الدومين مو رسمي (مو apple.com)", "أسلوب استعجال وتهديد", "الرابط http وليس https"],
      en: ["Domain is not official (not apple.com)", "Urgency + threat language", "Link uses http not https"],
      ku: ["دۆمەینەکە فەرمی نییە (apple.com نییە)", "لەکاتی زۆر + هەڕەشە", "لینکی http ـە نەک https"],
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
      ku: "چوونەژوورەوە ڕاگرترا — چالاکییەکان پشکنە",
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
        "چوونەژوورەوە ڕاگرترا بەھۆی هەوڵێکی نەناسراو.",
        "بە لینکی خوارەوە چالاکی پشکنە بۆ گەڕاندنەوەی دەستڕاگەیشتن.",
        "تێبینی: ئەگەر لە 24 کاتژمێردا پشکنین نەکەیت، سێشنەکان دەسڕدرێنەوە.",
      ],
    },
    ctaText: { ar: "مراجعة النشاط", en: "Review activity", ku: "پشکنینی چالاکی" },
    ctaUrl: "https://micros0ft-security.com/login",
    isPhishing: true,
    reasons: {
      ar: ["حرف 0 بدل o في الدومين (micros0ft)", "الرابط خارج microsoft.com", "تهديد بحذف الجلسات"],
      en: ["Domain uses 0 instead of o (micros0ft)", "Link is outside microsoft.com", "Threat to remove sessions"],
      ku: ["0 لە جێی o لە دۆمەین (micros0ft)", "لینکەکە microsoft.com نییە", "هەڕەشە بە سڕینەوەی سێشن"],
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
        "إذا كان هذا غير صحيح، افتح صفحة التتبع الرسمية من موقع DHL.",
        "رقم التتبع: 1234567890 (مثال)",
      ],
      en: [
        "Your delivery time was changed based on your request.",
        "If this is incorrect, open the official tracking page from the DHL website.",
        "Tracking number: 1234567890 (example)",
      ],
      ku: [
        "کاتی گەیاندن گۆڕدرا بەپێی داواکاریی تۆ.",
        "ئەگەر ئەمە ڕاست نییە، لە ماڵپەڕی فەرمی DHL پەڕەی تراکینگ بکەوە.",
        "ژمارەی تراکینگ: 1234567890 (نمونە)",
      ],
    },
    ctaText: { ar: "فتح تتبع DHL", en: "Open DHL tracking", ku: "کردنەوەی تراکینگ DHL" },
    ctaUrl: "https://www.dhl.com/",
    isPhishing: false,
    reasons: {
      ar: ["الدومين رسمي dhl.com", "ماكو استعجال/تهديد", "يوجهك للموقع الرسمي مو رابط تسجيل دخول"],
      en: ["Official domain dhl.com", "No urgency/threat", "Directs to official site (not a login link)"],
      ku: ["دۆمەین فەرمی dhl.com ـە", "هەستیارکردن/هەڕەشە نییە", "بەرەو ماڵپەڕی فەرمی دەبات نەک چوونەژوورەوە"],
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
      ku: "بەڵگەنامەی مووچە — پێویستە زانیاری نوێ بکەیت ئەمڕۆ",
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
        "تکایە داگرتن/پشکنین بکە و ئەمڕۆ بینێرەوە.",
        "وشەی نهێنی فایل: 1234",
      ],
    },
    ctaText: { ar: "تنزيل المستند", en: "Download document", ku: "داگرتنی بەڵگەنامە" },
    ctaUrl: "https://company-payroll.com/payroll-update.pdf",
    isPhishing: true,
    reasons: {
      ar: ["دومين غير معروف وغير تابع لشركتك", "ضغط زمني: (اليوم)", "مشاركة كلمة مرور داخل الرسالة علامة خطر"],
      en: ["Unknown domain not tied to your org", "Time pressure: today", "Sharing passwords in email is a red flag"],
      ku: ["دۆمەینی نەناسراو و نە بەسەر بە کۆمپانیاکەت", "فشار لەسەر کات: ئەمڕۆ", "دانانی وشەی نهێنی لە ناو نامە نیشانەی مەترسییە"],
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
      ku: "کلیلی SSH ی نوێ زیادکرا بۆ ئەکاونتەکەت",
    },
    body: {
      ar: [
        "تم إضافة مفتاح SSH جديد إلى حسابك.",
        "إذا لم تكن أنت، راجع إعدادات الأمان فورًا من داخل GitHub.",
      ],
      en: [
        "A new SSH key was added to your account.",
        "If this wasn't you, review your security settings directly in GitHub immediately.",
      ],
      ku: [
        "کلیلی SSH ی نوێ زیادکرا بۆ ئەکاونتەکەت.",
        "ئەگەر تۆ نەبوویت، ڕاستەوخۆ لە GitHub ڕێکخستنەکانی پاراستن پشکنە.",
      ],
    },
    ctaText: { ar: "فتح GitHub", en: "Open GitHub", ku: "کردنەوەی GitHub" },
    ctaUrl: "https://github.com/settings/keys",
    isPhishing: false,
    reasons: {
      ar: ["الدومين رسمي github.com", "يرشدك لإعدادات داخل GitHub", "محتوى واضح بدون روابط غريبة"],
      en: ["Official domain github.com", "Points to GitHub settings", "Clear content without odd links"],
      ku: ["دۆمەینی فەرمی github.com ـە", "بەرەو ڕێکخستنەکانی GitHub دەبات", "ناوەڕۆک ڕوون و بێ لینکە سەیر"],
    },
  },
];

export function getScenarios() {
  return SCENARIOS;
}
