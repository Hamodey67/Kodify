export const features = [
  {
    k: "security",
    ar: "أمان من التصميم",
    en: "Security by design",
    ku: "ئاسایش لە سەرەتاوە",
    dAr: "نطبق أفضل الممارسات ونبني طبقات حماية.",
    dEn: "Best practices and layered protection.",
    dKu: "باشترین ڕێنماییەکان و پاراستن بە چەند قەبارە.",
  },
  {
    k: "speed",
    ar: "أداء وسرعة",
    en: "High performance",
    ku: "ئادای بەرز",
    dAr: "تحسين سرعة التحميل وتجربة مستخدم خفيفة.",
    dEn: "Optimized loading and smooth UX.",
    dKu: "بارکردنی خێرا و ئەزموونی بەکارهێنەرێکی نەرم.",
  },
  {
    k: "quality",
    ar: "جودة وتسليم",
    en: "Quality delivery",
    ku: "گەیاندنی کوالێتی",
    dAr: "كود مرتب + اختبار + تسليم منظم.",
    dEn: "Clean code + testing + structured delivery.",
    dKu: "کۆدی ڕێکخراو + تاقیکردنەوە + گەیاندنی ڕێکخراو.",
  },
  {
    k: "support",
    ar: "دعم مستمر",
    en: "Ongoing support",
    ku: "پشتگیری بەردەوام",
    dAr: "متابعة وتحديثات بعد الإطلاق.",
    dEn: "Maintenance and updates post-launch.",
    dKu: "چاودێری و نوێکردنەوە دوای بڵاوکردنەوە.",
  },
];

export const services = [
  {
    key: "software",
    ar: { title: "تطوير برمجيات", desc: "مواقع، لوحات تحكم، أنظمة مخصصة، وتطبيقات." },
    en: { title: "Software Development", desc: "Web apps, dashboards, custom systems, and apps." },
    ku: { title: "گەشەپێدانی سۆفتوێر", desc: "ماڵپەڕ، داشبۆرد، سیستەمە تایبەتەکان و ئەپلیکەیشن." },

    itemsAr: ["مواقع شركات Premium", "أنظمة إدارة (ERP/CRM)", "لوحات تحكم Admin", "تكامل APIs & Payments"],
    itemsEn: ["Premium company websites", "ERP/CRM systems", "Admin dashboards", "APIs & payments integration"],
    itemsKu: ["ماڵپەڕی کۆمپانیا (Premium)", "سیستەمی ERP/CRM", "داشبۆردی Admin", "یەکخستنەوەی API & پارەدان"],
  },
  {
    key: "it",
    ar: { title: "حلول تقنية وبنية تحتية", desc: "شبكات، سيرفرات، مراقبة، نسخ احتياطي." },
    en: { title: "IT & Infrastructure", desc: "Networks, servers, monitoring, backups." },
    ku: { title: "IT و ژێرخانە", desc: "تۆڕ، سێرڤەر، چاودێری، باکاپ." },

    itemsAr: ["تصميم شبكة", "تهيئة سيرفرات", "مراقبة وأتمتة", "نسخ احتياطي واسترجاع"],
    itemsEn: ["Network design", "Server setup", "Monitoring & automation", "Backup & recovery"],
    itemsKu: ["دیزاینی تۆڕ", "ڕێکخستنی سێرڤەر", "چاودێری و ئۆتۆماتیککردن", "Backup و گەڕاندنەوە"],
  },
  {
    key: "security",
    ar: { title: "الأمن السيبراني", desc: "فحص ثغرات، اختبار اختراق، تقوية الأنظمة." },
    en: { title: "Cybersecurity", desc: "Vulnerability assessment, pentesting, hardening." },
    ku: { title: "پاراستنی سایبەری", desc: "پشكنینی کەلەكان، تاقیکردنەوەی پێنێترەیشن، Hardening." },

    itemsAr: ["Vulnerability Assessment", "Penetration Testing", "Hardening & Policies", "Security Awareness"],
    itemsEn: ["Vulnerability Assessment", "Penetration Testing", "Hardening & policies", "Security awareness"],
    itemsKu: ["Vulnerability Assessment", "Penetration Testing", "Hardening & Policies", "Security Awareness"],
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
    kuDesc: "پلاتفۆرمێکی گەورەی کۆمپانیا بە تایبەتمەندی تەکنیکی بەرز و سیستەمی بەڕێوەبردنی پێشكەوتوو.",
    stack: ["Next.js", "Enterprise", "Performance"],
    href: "https://barezagroup.com/",
  },
  {
    id: "spinoza-cafe",
    image: "/spinoza.png",
    arTitle: "سبينوزا كافيه (Spinoza Cafe)",
    enTitle: "Spinoza Cafe & Restaurant",
    kuTitle: "کافێ سپینۆزا (Spinoza Cafe)",
    arDesc: "تجربة رقمية فريدة للمطاعم تشمل منيو تفاعلي وتصميم بصري جذاب.",
    enDesc: "Unique digital restaurant experience with interactive menu and visual design.",
    kuDesc: "ئەزموونێکی دیجیتاڵی بێوێنە بۆ چێشتخانە کە مینیۆی ئینتەرئەکتیڤ و دیزاینی بینراو لەخۆدەگرێت.",
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
    kuDesc: "فرۆشگایەکی وەرزشی تەواو لەگەڵ سیستەمی بەڕێوەبردنی داواکاری و ئیشتراکاتی پێشكەوتوو.",
    stack: ["E-commerce", "Stripe", "Logistics"],
    href: "https://admspoort.com/",
  },
];



// export const caseStudies = [
//   {
//     arTitle: "منصة اشتراكات رياضية",
//     enTitle: "Sports subscription platform",
//     kuTitle: "پلاتفۆرمی ئیشتراكە وەرزشی",
//     arRes: "تقليل وقت إدارة الطلبات 60% وتحسين التحويل.",
//     enRes: "60% less manual ops time and better conversions.",
//     kuRes: "کەمکردنەوەی کاری دەستی بە %60 و باشترکردنی گۆڕانکاری (Conversions).",
//     stack: ["Next.js", "Dashboard", "WhatsApp CTA"],
//   },
//   {
//     arTitle: "نظام إدارة مخزون ومبيعات",
//     enTitle: "Inventory & sales system",
//     kuTitle: "سیستەمی کۆگا و فرۆشتن",
//     arRes: "تقارير فورية وتقليل أخطاء الإدخال.",
//     enRes: "Realtime reports and fewer data-entry errors.",
//     kuRes: "ڕاپۆرتی کاتی ڕاستەوخۆ و کەمکردنەوەی هەڵەی داخلکردنی داتا.",
//     stack: ["Admin Panel", "Role-based access", "Audit logs"],
//   },
//   {
//     arTitle: "تقييم أمني لشبكة شركة",
//     enTitle: "Company network security assessment",
//     kuTitle: "هەڵسەنگاندنی ئاسایشی تۆڕی کۆمپانیا",
//     arRes: "إغلاق ثغرات حرجة ورفع مستوى الحماية.",
//     enRes: "Closed critical gaps and increased resilience.",
//     kuRes: "داخستنی کەلە گرنگەکان و زیادکردنی توانای پاراستن.",
//     stack: ["VA/PT", "Hardening", "Reporting"],
//   },
// ];


export const testimonials = [
  {
    ar: "تنفيذ سريع وتصميم مرتب… والأهم الأمان.",
    en: "Fast delivery, clean design — and solid security.",
    ku: "جێبەجێکردنی خێرا و دیزاینێکی ڕێکخراو — و گرنگتر لە هەموو شتێک ئاسایشە.",
  },
  {
    ar: "تعامل احترافي ودعم بعد التسليم ممتاز.",
    en: "Professional communication and great post-delivery support.",
    ku: "مامەڵەی پیشەیی و پشتگیری دوای گەیاندن زۆر باش بوو.",
  },
  {
    ar: "النتائج كانت واضحة بالأرقام.",
    en: "Results were measurable and clear.",
    ku: "ئەنجامەکان بە ژمارە ڕوون و دیار بوون.",
  },
];


export const blogPosts = [
  {
    slug: "security-by-design",
    date: "2026-01-10",

    arTitle: "شنو يعني Security by Design؟",
    enTitle: "What is Security by Design?",
    kuTitle: "ئاسایش بە دیزاین چییە؟",

    arSummary: "يعني نخلي الأمان أساس من أول يوم بالكود، مو نضيفه بعدين.",
    enSummary: "Security built into the product from the first line of code.",
    kuSummary: "ئاسایش لە سەرەتاوە دەبێتە بەشێک لە بیناسازی پرۆژە.",

    arContent: `
Security by Design يعني الأمان يصير جزء من تصميم المشروع من البداية، مو نضيفه بعد ما يطلع الموقع ويصير بيه مشاكل.

✅ أهم النقاط:
- فحص مدخلات المستخدم (Validation)
- صلاحيات واضحة (Roles)
- تشفير البيانات الحساسة (Hashing/Encryption)
- حماية الجلسات وتسجيل الدخول
- عدم عرض تفاصيل الأخطاء للزائر

📌 الخلاصة:
إذا تبني مشروعك بأمان من البداية، راح توفر فلوس وتعب كبير بالمستقبل.
    `.trim(),

    enContent: `
Security by Design means building security into your product from day one — not adding it later after issues happen.

✅ Key principles:
- Validate all input
- Clear permissions & roles
- Encrypt sensitive data
- Secure authentication & sessions
- Hide technical errors from users

📌 Conclusion:
Security-by-design systems are stronger, safer, and cheaper long-term.
    `.trim(),

    kuContent: `
ئاسایش بە دیزاین واتە لە سەرەتاوە ئاسایش بخەیتە ناو بیناسازی پرۆژەکەت، نەک دوای بڵاوکردنەوە.

✅ گرنگترین خاڵەکان:
- دڵنیابوون لە داتای بەکارهێنەر (Validation)
- ڕۆڵ و دەسەڵات بۆ هەر کەس
- پاراستنی داتای گرنگ
- پاراستنی Login و Session
- نیشاندان نەکردنی هەڵەکان بە وردی

📌 کورتە:
ئاسایش لە سەرەتاوە = کەمتر هەڵە + کەمتر خەرجی + سیستەمێکی بەهێزتر.
    `.trim(),
  },

  {
    slug: "performance-mistakes",
    date: "2026-01-07",

    arTitle: "أخطاء شائعة تقلل سرعة الموقع",
    enTitle: "Common website performance mistakes",
    kuTitle: "هەڵە باوەکان لە کارایی وێبسایتدا",

    arSummary: "أخطاء بسيطة مثل الصور الثقيلة والأنيميشن ممكن تبطئ الموقع.",
    enSummary: "Small issues like heavy images and scripts can slow down your site.",
    kuSummary: "هەڵە سادە وێبسایت خاو دەکات، بەتایبەتی لە مۆبایل.",

    arContent: `
أكو أخطاء بسيطة بس تأثر هواي على سرعة الموقع، خصوصًا بالموبايل.

✅ أشهر الأخطاء:
- صور حجمها كبير بدون ضغط
- ملفات JS/CSS كثيرة بدون تنظيم
- تحميل كلشي مرة وحدة (بدون Lazy Loading)
- خطوط كثيرة وثقيلة
- أنيميشنات قوية على كل الصفحة

✅ شلون تسرّع موقعك؟
- ضغط الصور وتحويلها WebP
- Lazy loading للصور
- تقليل مكتبات JS الثقيلة
- تفعيل caching
- تحسين طلبات الـ API

📌 كل ثانية تأخير تقلل تفاعل الزائر وتضر تجربة المستخدم.
    `.trim(),

    enContent: `
Many websites become slow because of simple mistakes — especially on mobile.

✅ Common mistakes:
- Large images without compression
- Too many JS/CSS files
- No lazy loading
- Heavy fonts
- Overusing animations

✅ How to speed it up:
- Use WebP + compress images
- Lazy-load media
- Reduce heavy JS libraries
- Enable caching
- Optimize API requests

📌 Every second matters for UX and conversions.
    `.trim(),

    kuContent: `
زۆرێک لە ماڵپەڕەکان خاو دەبن بەهۆی هەڵە سادەکان، بەتایبەتی لە مۆبایل.

✅ هەڵە باوەکان:
- وێنە قەبارە گەورەکان
- زۆر JS/CSS
- Lazy Loading نەبوونی
- فۆنتي قورس
- زۆر Animation

✅ باشتركردني خێرایي:
- وێنەكان WebP بكە
- Lazy-load بەكاربهێنە
- Library قورسەكان كەم بكە
- Caching
- API باشتر بكە

📌 خێرایي یەكێكە لە گرنگترین هۆكارەكاني سەركەوتن.
    `.trim(),
  },

  {
    slug: "when-to-pentest",
    date: "2026-01-03",

    arTitle: "متى تحتاج اختبار اختراق؟",
    enTitle: "When do you need a penetration test?",
    kuTitle: "کەی پێویستت دەبێت تاقیکردنەوەی پێنێترەیشن؟",

    arSummary: "أي موقع بيه تسجيل دخول أو بيانات، يحتاج فحص أمني قبل الإطلاق.",
    enSummary: "If you have login or user data, security testing is important before launch.",
    kuSummary: "پێش Launch پشکنینی ئاسایش زۆر گرنگە بۆ پرۆژەکان.",

    arContent: `
اختبار الاختراق مو بس للشركات الكبيرة… أي مشروع بيه تسجيل دخول أو بيانات مستخدمين يحتاج مراجعة أمنية.

✅ تحتاج Pentest إذا:
- عندك Login / Register
- موقعك بيه دفع إلكتروني
- تخزن بيانات حساسة (إيميلات، أرقام، ملفات)
- عندك لوحة تحكم Admin
- قبل ما تطلع المشروع للناس

✅ شنو يطلع لك؟
- كشف الثغرات
- تقرير واضح بالمشاكل
- حلول عملية للإصلاح
- رفع مستوى الحماية

📌 الأفضل تسويه قبل وقوع المشكلة مو بعدها.
    `.trim(),

    enContent: `
Penetration testing isn’t only for big companies.
Any system with login, user data, or admin access should be tested.

✅ You need a pentest if:
- You have login/register
- You process payments
- You store sensitive data
- You have an admin dashboard
- Before a public launch

✅ What you get:
- Vulnerability detection
- Clear report
- Practical fixes
- Stronger overall security

📌 Always test before attackers do.
    `.trim(),

    kuContent: `
تاقیکردنەوەی پێنێترەیشن تەنها بۆ کۆمپانیا گەورەکان نییە.
هەر پرۆژەیەک کە Login و داتای بەکارهێنەر هەبێت پێویستی بە پشکنین هەیە.

✅ کەی پێویست دەبێت؟
- Login/Register هەبێت
- پارەدان هەبێت
- داتای گرنگ هەبێت
- Admin Panel هەبێت
- پێش Launch

✅ ئەنجامەکە:
- دۆزینەوەی کەلەکان
- ڕاپۆرتی ڕوون
- ڕێکار بۆ چاککردن
- پاراستنی بەرزتر

📌 باشترە پێش کێشە بیکەیت نەک دوای کێشە.
    `.trim(),
  },
];

export const whyReturnCards = [
  {
    ar: { title: "سهل تتواصل ويانا", desc: "WhatsApp مباشر" },
    en: { title: "Easy to reach us", desc: "Direct WhatsApp" },
    ku: { title: "پەیوەندی ئاسان", desc: "WhatsApp ڕاستەوخۆ" },
    back: {
      ar: "نخلي التواصل سريع وواضح حتى نجاوبك ونحدد المطلوب بدون لف ودوران.",
      en: "Fast, clear communication so we can scope your needs without friction.",
      ku: "پەیوەندی خێرا و ڕوون بۆ ئەوەی پێویستەکانت زوو دیاری بکەین.",
    },
  },
  {
    ar: { title: "تنفيذ مرتب", desc: "Clean UI + كود واضح" },
    en: { title: "Clean delivery", desc: "Clean UI + readable code" },
    ku: { title: "جێبەجێکردنی ڕێکخراو", desc: "Clean UI + کۆدی ڕوون" },
    back: {
      ar: "واجهة فخمة + تنظيم ملفات + مكونات مرتبة حتى يصير التطوير سهل بالمستقبل.",
      en: "Premium UI + organized structure so future updates stay easy.",
      ku: "UI جوان + ڕێکخستنی فایلەکان بۆ ئەوەی پەرەپێدان دوایین ئاسان بێت.",
    },
  },
  {
    ar: { title: "نصائح حقيقية", desc: "مو بس تنفيذ.. نوجّهك" },
    en: { title: "Real guidance", desc: "Not only build — we advise" },
    ku: { title: "ڕاوێژی ڕاستەقینە", desc: "تەنها دروستکردن نییە… ڕێنماییت دەکەین" },
    back: {
      ar: "ننصحك شنو الأفضل حسب مشروعك (سرعة/أمان/تكلفة) مو قالب ثابت.",
      en: "We recommend what fits your case (speed/security/cost), not a generic template.",
      ku: "بەپێی پڕۆژەکەت ڕێنمایی دەکەین (خێرایی/ئاسایش/تێچوو) نەک قالەبی یەکسان.",
    },
  },
  {
    ar: { title: "دعم بعد التسليم", desc: "حتى لو تعديل بسيط" },
    en: { title: "Post-delivery support", desc: "Even small tweaks" },
    ku: { title: "پشتگیری دوای گەیاندن", desc: "هەتا گۆڕانکارییە بچووکەکان" },
    back: {
      ar: "بعد الإطلاق نتابع وياك ونصلّح التفاصيل حتى يظل الموقع ثابت.",
      en: "After launch we stay available for fixes and improvements.",
      ku: "دوای بڵاوکردنەوە لەگەڵت دەبین بۆ چاککردن و باشترکردن.",
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
      ku: "وێنەکان و کەش و شێوازی بارکردن باش دەکەین بۆ کەمکردنەوەی چاوەڕوانی.",
    },
  },
  {
    ar: { before: "قبل: طلبات مشتتة", after: "بعد: نظام مرتب" },
    en: { before: "Before: scattered requests", after: "After: organized flow" },
    ku: { before: "پێش: داواکاری پاشاوە", after: "دوای: سیستەمێکی ڕێکخراو" },
    back: {
      ar: "نرتب مسار الطلب/التواصل حتى يصير واضح للعميل ولك.",
      en: "We structure the request/contact flow so it’s clear for everyone.",
      ku: "ڕێڕەوی داوا/پەیوەندی ڕێک دەخەین بۆ ڕوونبوونەوە بۆ هەمووان.",
    },
  },
  {
    ar: { before: "قبل: بدون حماية", after: "بعد: إعدادات أمان أساسية" },
    en: { before: "Before: no protection", after: "After: baseline security" },
    ku: { before: "پێش: بێ پاراستن", after: "دوای: ئاسایشی بنچینەیی" },
    back: {
      ar: "نطبق أساسيات الحماية (Headers/Validation/Best practices).",
      en: "We apply baseline hardening (headers, validation, best practices).",
      ku: "بنچینەی پاراستن جێبەجێ دەکەین (Headers/Validation/Best practices).",
    },
  },
  {
    ar: { before: "قبل: صيانة صعبة", after: "بعد: كود قابل للتطوير" },
    en: { before: "Before: hard to maintain", after: "After: scalable code" },
    ku: { before: "پێش: چاکسازی سەخت", after: "دوای: کۆدی ئاسان بۆ پەرەپێدان" },
    back: {
      ar: "مكونات نظيفة + تنظيم ملفات حتى التعديل ما يصير متعب.",
      en: "Clean components + structure so changes don’t become painful.",
      ku: "کۆمپۆنەنتی پاک + ڕێکخستنی فایلەکان بۆ ئاسانکردنی گۆڕانکاری.",
    },
  },
] as const;
