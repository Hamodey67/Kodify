export const features = [
  {
    k: "security",
    ar: "أمان من التصميم",
    en: "Security by design",
    ku: "ئاسایش لە بنچینەوە",
    dAr: "نطبق أفضل الممارسات ونبني طبقات حماية.",
    dEn: "Best practices and layered protection.",
    dKu: "جێبەجێکردنی باشترین ڕێکارەکان و دابینکردنی پاراستنی فرەچێن.",
  },
  {
    k: "speed",
    ar: "أداء وسرعة",
    en: "High performance",
    ku: "کارایی و خێرایی بەرز",
    dAr: "تحسين سرعة التحميل وتجربة مستخدم خفيفة.",
    dEn: "Optimized loading and smooth UX.",
    dKu: "خێراکردنی بارکردن و دابینکردنی ئەزموونێکی بەکارهێنەری نەرم و بێخەوش.",
  },
  {
    k: "quality",
    ar: "جودة وتسليم",
    en: "Quality delivery",
    ku: "پێشکەشکردنی کوالێتی بەرز",
    dAr: "كود مرتب + اختبار + تسليم منظم.",
    dEn: "Clean code + testing + structured delivery.",
    dKu: "کۆدی خاوێن + تاقیکردنەوەی ورد + گەیاندنی ڕێکخراو.",
  },
  {
    k: "support",
    ar: "دعم مستمر",
    en: "Ongoing support",
    ku: "پشتگیری بەردەوام",
    dAr: "متابعة وتحديثات بعد الإطلاق.",
    dEn: "Maintenance and updates post-launch.",
    dKu: "چاودێریکردن و نوێکردنەوەی بەردەوام لە دوای دەستپێکردن.",
  },
];

export const services = [
  {
    key: "software",
    ar: { title: "تطوير برمجيات", desc: "مواقع، لوحات تحكم، أنظمة مخصصة، وتطبيقات." },
    en: { title: "Software Development", desc: "Web apps, dashboards, custom systems, and apps." },
    ku: { title: "گەشەپێدانی سۆفتوێر", desc: "وێبسایت، داشبۆرد، سیستەمە تایبەتەکان و ئەپڵیکەیشنەکان." },

    itemsAr: ["مواقع شركات Premium", "أنظمة إدارة (ERP/CRM)", "لوحات تحكم Admin", "تكامل APIs & Payments"],
    itemsEn: ["Premium company websites", "ERP/CRM systems", "Admin dashboards", "APIs & payments integration"],
    itemsKu: ["وێبسایتی نایابی کۆمپانیاکان (Premium)", "سیستەمەکانی بەڕێوەبردن (ERP/CRM)", "داشبۆردی سەرپەرشتیار (Admin Dashboard)", "بەستنەوەی API و دەروازەکانی پارەدان"],
  },
  {
    key: "it",
    ar: { title: "حلول تقنية وبنية تحتية", desc: "شبكات، سيرفرات، مراقبة، نسخ احتياطي." },
    en: { title: "IT & Infrastructure", desc: "Networks, servers, monitoring, backups." },
    ku: { title: "تەکنەلۆژیای زانیاری (IT) و ژێرخان", desc: "تۆڕەکان، سێرڤەرەکان، چاودێریکردن، و پاراستنی زانیارییەکان (Backup)." },

    itemsAr: ["تصميم شبكة", "تهيئة سيرفرات", "مراقبة وأتمتة", "نسخ احتياطي واسترجاع"],
    itemsEn: ["Network design", "Server setup", "Monitoring & automation", "Backup & recovery"],
    itemsKu: ["دیزاین و داڕشتنی تۆڕ", "ڕێکخستن و ڕێخستنی سێرڤەرەکان", "چاودێریکردن و ئۆتۆماتیککردنی کارەکان", "پاراستنی زانیارییەکان (Backup) و گەڕاندنەوەیان"],
  },
  {
    key: "security",
    ar: { title: "الأمن السيبراني", desc: "فحص ثغرات، اختبار اختراق، تقوية الأنظمة." },
    en: { title: "Cybersecurity", desc: "Vulnerability assessment, pentesting, hardening." },
    ku: { title: "ئاسایشی سایبەری", desc: "هەڵسەنگاندنی کەلێنە ئەمنییەکان، تاقیکردنەوەی دزەکردن، و بەهێزکردنی پاراستنی سیستەمەکان (Hardening)." },

    itemsAr: ["Vulnerability Assessment", "Penetration Testing", "Hardening & Policies", "Security Awareness"],
    itemsEn: ["Vulnerability Assessment", "Penetration Testing", "Hardening & policies", "Security awareness"],
    itemsKu: ["هەڵسەنگاندنی کەلێنە ئەمنییەکان (VA)", "تاقیکردنەوەی دزەکردن (PT)", "بەهێزکردنی ئاسایش و داڕشتنی یاساکان", "هۆشیاری ئەمنی بۆ کارمەندان"],
  },
];

export const projects = [
  {
    id: "bareza-group",
    image: "/bareza.png",
    arTitle: "مجموعة باريزة (Bareza Group)",
    enTitle: "Bareza Group Corporate",
    kuTitle: "گرووپی بارێزە (Bareza Group)",
    arDesc: "منصة مؤسسية ضخمة بمواصفات تقنية عالية ونظام إدارة محتوى متقدم.",
    enDesc: "Large-scale corporate portal with high technical specs and advanced CMS.",
    kuDesc: "پلاتفۆرمێکی گەورە و گشتگیر بۆ کۆمپانیا بە تایبەتمەندییە تەکنیکییە بەرزەکان و سیستەمی پێشکەوتووی CMS.",
    stack: ["Next.js", "Enterprise", "Performance"],
    href: "https://barezagroup.com/",
  },
  {
    id: "spinoza-cafe",
    image: "/spinoza.png",
    arTitle: "سبينوزا كافيه (Spinoza Cafe)",
    enTitle: "Spinoza Cafe & Restaurant",
    kuTitle: "کافێ سبینۆزا (Spinoza Cafe)",
    arDesc: "تجربة رقمية فريدة للمطاعم تشمل منيو تفاعلي وتصميم بصري جذاب.",
    enDesc: "Unique digital restaurant experience with interactive menu and visual design.",
    kuDesc: "ئەزموونێکی دیجیتاڵی نایاب بۆ چێشتخانە و کافتریایەک کە مێنیۆی کارلێکەر و دیزاینێکی سەرنجڕاکێش لەخۆدەگرێت.",
    stack: ["UX/UI", "Responsive", "Digital Menu"],
    href: "https://spinozacafe.com/",
  },
  {
    id: "adm-sport",
    image: "/adm-sport.png",
    arTitle: "ADM سبورت (ADM Sport)",
    enTitle: "ADM Sport Platform",
    kuTitle: "ADM سپۆرت (ADM Sport)",
    arDesc: "متجر رياضي متكامل مع نظام إدارة طلبات واشتراكات متطور.",
    enDesc: "Integrated sports store with advanced order and subscription management.",
    kuDesc: "فرۆشگایەکی ئەلیکترۆنی وەرزشیی تەواو لەگەڵ سیستەمی پێشکەوتووی بەڕێوەبردنی داواکاری و بەشدارییەکان.",
    stack: ["E-commerce", "Stripe", "Logistics"],
    href: "https://admspoort.com/",
  },
];

export const testimonials = [
  {
    ar: "تنفيذ سريع وتصميم مرتب… والأهم الأمان.",
    en: "Fast delivery, clean design — and solid security.",
    ku: "پێشکەشکردنی خێرا، دیزاینی پاک و ڕێکخراو — و گرنگتر لەوەش، ئاسایشێکی تۆکمە.",
  },
  {
    ar: "تعامل احترافي ودعم بعد التسليم ممتاز.",
    en: "Professional communication and great post-delivery support.",
    ku: "پەیوەندیکردنی پیشەییانە و پشتگیرییەکی نایاب لە دوای ڕادەستکردنی پڕۆژەکە.",
  },
  {
    ar: "النتائج كانت واضحة بالأرقام.",
    en: "Results were measurable and clear.",
    ku: "ئەنجامەکان زۆر ڕوون و لەسەر بنەمای ئامار و ژمارەی پێوانەیی بوون.",
  },
];

export const whyReturnCards = [
  {
    ar: { title: "سهل تتواصل ويانا", desc: "WhatsApp مباشر" },
    en: { title: "Easy to reach us", desc: "Direct WhatsApp" },
    ku: { title: "پەیوەندیکردنی ئاسان", desc: "WhatsAppی ڕاستەوخۆ" },
    back: {
      ar: "نخلي التواصل سريع وواضح حتى نجاوبك ونحدد المطلوب بدون لف ودوران.",
      en: "Fast, clear communication so we can scope your needs without friction.",
      ku: "پەیوەندییەکی خێرا و ڕوون بۆ ئەوەی بێ ماندووبوون پێداویستییەکانت دیاری بکەین.",
    },
  },
  {
    ar: { title: "تنفيذ مرتب", desc: "Clean UI + كود واضح" },
    en: { title: "Clean delivery", desc: "Clean UI + readable code" },
    ku: { title: "ڕادەستکردنی خاوێن", desc: "ڕووکاری ناوازە + کۆدی خاوێن" },
    back: {
      ar: "واجهة فخمة + تنظيم ملفات + مكونات مرتبة حتى يصير التطوير سهل بالمستقبل.",
      en: "Premium UI + organized structure so future updates stay easy.",
      ku: "ڕووکاری ناوازە + تەلارسازییەکی ڕێکخراو بۆ ئەوەی نوێکردنەوەکانی داهاتوو ئاسان بن.",
    },
  },
  {
    ar: { title: "نصائح حقيقية", desc: "مو بس تنفيذ.. نوجّهك" },
    en: { title: "Real guidance", desc: "Not only build — we advise" },
    ku: { title: "ڕێنمایی ڕاستەقینە", desc: "تەنها دروستکردن نییە... ڕاوێژت پێ دەدەین" },
    back: {
      ar: "ننصحك شنو الأفضل حسب مشروعك (سرعة/أمان/تكلفة) مو قالب ثابت.",
      en: "We recommend what fits your case (speed/security/cost), not a generic template.",
      ku: "پێشنیاری ئەوەت بۆ دەکەین کە لەگەڵ پڕۆژەکەتدا دەگونجێت (خێرایی/ئاسایش/تێچوو)، نەک تەنها قالبێکی ئامادەکراو.",
    },
  },
  {
    ar: { title: "دعم بعد التسليم", desc: "حتى لو تعديل بسيط" },
    en: { title: "Post-delivery support", desc: "Even small tweaks" },
    ku: { title: "پشتگیری دوای ڕادەستکردن", desc: "تەنانەت گۆڕانکارییە بچووکەکانیش" },
    back: {
      ar: "بعد الإطلاق نتابع وياك ونصلّح التفاصيل حتى يظل الموقع ثابت.",
      en: "After launch we stay available for fixes and improvements.",
      ku: "لە دوای دەستپێکردنیش لەگەڵت دەبین بۆ هەر چاکسازی و باشترکردنێک لە داهاتوودا.",
    },
  },
] as const;

export const beforeAfterCards = [
  {
    ar: { before: "قبل: موقع بطيء", after: "بعد: تحميل سريع" },
    en: { before: "Before: slow site", after: "After: fast loading" },
    ku: { before: "پێش: ماڵپەڕێکی خاو", after: "دوای: بارکردنی خێرا" },
    back: {
      ar: "نحسن الصور + الكاش + ترتيب التحميل حتى يقل وقت الانتظار.",
      en: "We optimize images, caching and loading order to reduce waiting time.",
      ku: "وێنەکان، کەش (caching)، و شێوازی بارکردن باشتر دەکەین بۆ کەمکردنەوەی کاتی چاوەڕوانی.",
    },
  },
  {
    ar: { before: "قبل: طلبات مشتتة", after: "بعد: نظام مرتب" },
    en: { before: "Before: scattered requests", after: "After: organized flow" },
    ku: { before: "پێش: داواکارییە پەرشوبڵاوەکان", after: "دوای: ڕەوتی ڕێکخراو" },
    back: {
      ar: "نرتب مسار الطلب/التواصل حتى يصير واضح للعميل ولك.",
      en: "We structure the request/contact flow so it’s clear for everyone.",
      ku: "ڕەوتی داواکاری و پەیوەندییەکان ڕێکدەخەین تا بۆ هەموو لایەک ڕوون بێت.",
    },
  },
  {
    ar: { before: "قبل: بدون حماية", after: "بعد: إعدادات أمان أساسية" },
    en: { before: "Before: no protection", after: "After: baseline security" },
    ku: { before: "پێش: بێ پاراستن", after: "دوای: ئاسایشی بنەڕەتی" },
    back: {
      ar: "نطبق أساسيات الحماية (Headers/Validation/Best practices).",
      en: "We apply baseline hardening (headers, validation, best practices).",
      ku: "بنەماکانی پاراستن و بەهێزکردنی ئاسایش جێبەجێ دەکەین (Headers, Validation, Best practices).",
    },
  },
  {
    ar: { before: "قبل: صيانة صعبة", after: "بعد: كود قابل للتطوير" },
    en: { before: "Before: hard to maintain", after: "After: scalable code" },
    ku: { before: "پێش: چاکسازی و نوێکردنەوەی سەخت", after: "دوای: کۆدی گەشەپێدەر دۆستانە" },
    back: {
      ar: "مكونات نظيفة + تنظيم ملفات حتى التعديل ما يصير متعب.",
      en: "Clean components + structure so changes don’t become painful.",
      ku: "کۆمپۆنێنتی خاوێن + ڕێکخستنی دروستی فایلەکان بۆ ئەوەی گۆڕانکارییەکان ئاسان بن.",
    },
  },
] as const;
