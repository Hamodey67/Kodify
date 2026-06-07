type Lang = "ar" | "en" | "ku";

export type DemoClue = {
  id: string;
  title: string;
  detail: string;
};

export type DemoScenarioKind = "login" | "whatsapp";

export type LoginFormStrings = {
  heading: string;
  email: string;
  password: string;
  forgot: string;
  signIn: string;
  footer: string;
};

export type WhatsAppStrings = {
  header: string; // e.g. WhatsApp
  fromName: string;
  fromMeta: string; // e.g. Verified / Business / number
  message: string;
  cta: string; // button-like link
};

export type DemoScenario = {
  id: string;
  kind: DemoScenarioKind;
  brand: string;
  shownUrl: string;
  isPhishing: boolean;
  // Localized UI pieces
  form?: LoginFormStrings;
  wa?: WhatsAppStrings;
  // Optional per-scenario extra hint shown under verdict
  note?: string;
};

export type LoginDemoCopy = {
  title: string;
  desc: string;
  demoBadge: string;
  hint: string;
  instruction: string;
  bannerDismiss: string;

  tabs: {
    login: string;
    whatsapp: string;
  };

  notSecure: string;
  secure: string;
  fakeTag: string;
  legitTag: string;

  hotspots: {
    domain: string;
    http: string;
    branding: string;
    cta: string;
    pressure: string;
  };

  buttons: {
    phishing: string;
    safe: string;
    inspect: string;
    reset: string;
    next: string;
    share: string;
    copied: string;
  };

  result: {
    correct: string;
    wrong: string;
    scoreLabel: string;
    streakLabel: string;
  };

  roundLabel: string;
  cluesTitle: string;
  cluesLocked: string;
  statusPresent: string;
  statusAbsent: string;

  shareText: (args: { score: number; max: number; streak: number; brand: string; kind: DemoScenarioKind }) => string;

  clues: DemoClue[];
};

const COPY: Record<Lang, LoginDemoCopy> = {
  ar: {
    title: "Fake Login Detector",
    desc: "قرر إذا كان السيناريو آمنًا أو تصيّدًا، ثم راجع الأدلة.",
    demoBadge: "Demo",
    hint: "ديمو تعليمي — لا تدخل بياناتك الحقيقية.",
    instruction: "اختر Safe أو Phishing بناءً على ما تراه.",
    bannerDismiss: "إغلاق",
    tabs: { login: "صفحة تسجيل دخول", whatsapp: "احتيال واتساب" },
    notSecure: "Not secure",
    secure: "Secure",
    fakeTag: "مشبوه",
    legitTag: "يبدو طبيعي",
    hotspots: {
      domain: "الدومين",
      http: "HTTPS",
      branding: "البراند",
      cta: "الزر/الرابط",
      pressure: "الاستعجال",
    },
    buttons: {
      phishing: "Phishing",
      safe: "Safe",
      inspect: "افحص الأدلة",
      reset: "إعادة",
      next: "تالي",
      share: "شارك نتيجتي",
      copied: "تم النسخ ✅",
    },
    result: {
      correct: "إجابة صحيحة",
      wrong: "إجابة غير صحيحة",
      scoreLabel: "النتيجة",
      streakLabel: "Streak",
    },
    roundLabel: "تقدم الجولة",
    cluesTitle: "الأدلة اللي لازم تنتبه إلها",
    cluesLocked: "اختر حكمك أو اضغط «افحص الأدلة» لعرض قائمة الأدلة.",
    statusPresent: "موجود",
    statusAbsent: "غير موجود",
    shareText: ({ score, max, streak, brand, kind }) =>
      `اختبرت نفسي بـ ${kind === "login" ? "فاحص تسجيل الدخول" : "احتيال واتساب"} (${brand}) — نتيجتي ${score}/${max} و Streak ${streak}. جرّبها!`,
    clues: [
      {
        id: "domain",
        title: "الدومين/الرابط مو طبيعي",
        detail: "تأكد من الدومين الحقيقي، وانتبه للحروف المتشابهة أو نطاقات غريبة.",
      },
      {
        id: "http",
        title: "HTTPS مو واضح",
        detail: "غياب HTTPS/القفل مؤشر خطر، خصوصًا بصفحات تسجيل الدخول.",
      },
      {
        id: "pressure",
        title: "لغة استعجال/تهديد",
        detail: "رسائل مثل (حسابك رح ينغلق) تضغط عليك حتى تتصرف بسرعة.",
      },
      {
        id: "branding",
        title: "تفاصيل براند غير دقيقة",
        detail: "اختلاف بسيط بالشعار/الخط/المحاذاة ممكن يكون دليل تزوير.",
      },
      {
        id: "cta",
        title: "زر/رابط مشبوه",
        detail: "انتبه لنص الزر أو الروابط المختصرة أو صفحات تطلب معلومات أكثر من اللازم.",
      },
    ],
  },

  en: {
    title: "Fake Login Detector",
    desc: "Decide if the scenario is safe or phishing, then review the clues.",
    demoBadge: "Demo",
    hint: "Educational demo — don't enter real credentials.",
    instruction: "Choose Safe or Phishing based on what you see.",
    bannerDismiss: "Dismiss",
    tabs: { login: "Login page", whatsapp: "WhatsApp scam" },
    notSecure: "Not secure",
    secure: "Secure",
    fakeTag: "suspicious",
    legitTag: "looks normal",
    hotspots: { domain: "Domain", http: "HTTPS", branding: "Brand", cta: "CTA/Link", pressure: "Pressure" },
    buttons: {
      phishing: "Phishing",
      safe: "Safe",
      inspect: "Inspect clues",
      reset: "Reset",
      next: "Next",
      share: "Share my score",
      copied: "Copied ✅",
    },
    result: {
      correct: "Correct",
      wrong: "Not quite",
      scoreLabel: "Score",
      streakLabel: "Streak",
    },
    roundLabel: "Round progress",
    cluesTitle: "Clues to watch for",
    cluesLocked: "Submit your verdict or tap Reveal clues to see the checklist.",
    statusPresent: "Present",
    statusAbsent: "Not present",
    shareText: ({ score, max, streak, brand, kind }) =>
      `I tried the ${kind === "login" ? "Fake Login Detector" : "WhatsApp Scam"} (${brand}) — scored ${score}/${max} with a streak of ${streak}. Try it!`,
    clues: [
      { id: "domain", title: "URL / domain looks off", detail: "Check the real domain. Watch for look‑alikes and weird TLDs." },
      { id: "http", title: "HTTPS isn’t clear", detail: "Missing HTTPS/lock icon is a big red flag for login pages." },
      { id: "pressure", title: "Urgency / pressure language", detail: "Threats like “account will be locked” push you to act fast." },
      { id: "branding", title: "Brand details are inconsistent", detail: "Small logo/font/layout mismatches can be a sign of spoofing." },
      { id: "cta", title: "Suspicious button / link", detail: "Be careful with shortened links or pages asking for extra info." },
    ],
  },

  ku: {
    title: "ئاشکراکەری چوونەژوورەوەی ساختە",
    desc: "بڕیار بدە ئایا سیناریۆکە سەلامەتە یان فیشینگ، پاشان بەڵگەکان بپشکنە.",
    demoBadge: "Demo",
    hint: "دیمۆی فێرکاری — هیچ زانیارییەکی ڕاستەقینە مەنووسە.",
    instruction: "Safe یان Phishing هەڵبژێرە بەپێی ئەوەی دەبینیت.",
    bannerDismiss: "داخستن",
    tabs: { login: "پەڕەی چوونەژوورەوە", whatsapp: "فێڵی واتساپ" },
    notSecure: "Not secure",
    secure: "Secure",
    fakeTag: "گوماناوی",
    legitTag: "ڕاستەقینە",
    hotspots: { domain: "دۆمەین", http: "HTTPS", branding: "براند (نیشانە)", cta: "لینک/دوگمە", pressure: "فشار" },
    buttons: {
      phishing: "ساختەکاری (Phishing)",
      safe: "سەلامەت (Safe)",
      inspect: "پشکنینی بەڵگەکان",
      reset: "دووبارە",
      next: "دواتر",
      share: "هاوبەشکردنی ئەنجامەکەم",
      copied: "کۆپی کرا ✅",
    },
    result: {
      correct: "ڕاستە",
      wrong: "هەڵەیە",
      scoreLabel: "نمرە",
      streakLabel: "Streak",
    },
    roundLabel: "پێشکەوتنی گۆڕ",
    cluesTitle: "ئەو نیشانە گوماناوییانەی پێویستە ئاگاداریان بیت",
    cluesLocked: "بڕیارەکەت بدە یان «پشکنینی بەڵگەکان» بکە بۆ بینینی لیستەکە.",
    statusPresent: "هەیە",
    statusAbsent: "نییە",
    shareText: ({ score, max, streak, brand, kind }) =>
      `من تاقیکردنەوەم کرد بۆ دۆزینەوەی لایەنە ساختەکان لە پەڕەی (${brand}) لە ڕێگەی ${kind === "login" ? "تاقیکردنەوەی چوونەژوورەوە" : "فێڵی واتساپ"} — نمرەم ${score}/${max} بوو لەگەڵ ڕێژەی سەرکەوتنی ${streak}. تۆش تاقی بکەرەوە!`,
    clues: [
      { id: "domain", title: "دۆمەین/ناونیشانی URL گوماناوییە", detail: "دڵنیابە لە ناونیشانی دۆمەینی فەرمی. ئاگاداری پیتە هاوشێوەکان و کۆتاییە سەیرەکانی دۆمەین بە." },
      { id: "http", title: "پڕۆتۆکۆلی HTTPS بەردەست نییە", detail: "نەبوونی نیشانەی قوفڵ یان HTTPS نیشانەیەکی گوماناوی بەهێزە بۆ لاپەڕەکانی چوونەژوورەوە." },
      { id: "pressure", title: "زمانی فشارخستنەسەر و پەلەکردن", detail: "هەڕەشە و ئاگادارکردنەوەی وەک “حیسابەکەت دادەخرێت” دەیەوێت بە پەلە بڕیار بدەیت." },
      { id: "branding", title: "نەگونجانی نیشانەی بازرگانی (Branding)", detail: "هەر جیاوازییەکی بچووک لە لۆگۆ، فۆنت، یان شێوازی ڕێکخستنی لاپەڕەکە نیشانەی ساختەکارییە." },
      { id: "cta", title: "دوگمە یان لینکی گوماناوی", detail: "ئاگاداری لینکە کورتکراوەکان بە یان ئەو پەڕانەی کە داوای زانیاری زیاتری بێهوودە دەکەن." },
    ],
  },
};

export function getLoginDemoCopy(lang: Lang): LoginDemoCopy {
  return COPY[lang] ?? COPY.en;
}

const LOGIN_SCENARIOS: Record<Lang, DemoScenario[]> = {
  ar: [
    {
      id: "paypal-phish",
      kind: "login",
      brand: "PayPal",
      shownUrl: "http://paypaI.com-security-check.com/login",
      isPhishing: true,
      form: {
        heading: "Sign in to PayPal",
        email: "Email or mobile number",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log In",
        footer: "© 2026 PayPal Inc. — Terms • Privacy",
      },
      note: "لاحظ حرف I الكبير بدل l — وفوق هذا الرابط مو HTTPS.",
    },
    {
      id: "microsoft-safe",
      kind: "login",
      brand: "Microsoft",
      shownUrl: "https://login.microsoftonline.com/",
      isPhishing: false,
      form: {
        heading: "Sign in",
        email: "Email, phone, or Skype",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Next",
        footer: "© Microsoft 2026 — Privacy • Terms",
      },
      note: "الدومين رسمي (microsoftonline.com) و HTTPS موجود.",
    },
    {
      id: "instagram-phish",
      kind: "login",
      brand: "Instagram",
      shownUrl: "https://instagram-security.support/login",
      isPhishing: true,
      form: {
        heading: "Log in to Instagram",
        email: "Phone number, username, or email",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log in",
        footer: "© 2026 Instagram from Meta",
      },
      note: "النطاق (security.support) مو نطاق انستغرام الرسمي.",
    },
  ],
  en: [
    {
      id: "paypal-phish",
      kind: "login",
      brand: "PayPal",
      shownUrl: "http://paypaI.com-security-check.com/login",
      isPhishing: true,
      form: {
        heading: "Sign in to PayPal",
        email: "Email or mobile number",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log In",
        footer: "© 2026 PayPal Inc. — Terms • Privacy",
      },
      note: "Look closely: capital I in paypaI, plus it’s not HTTPS.",
    },
    {
      id: "microsoft-safe",
      kind: "login",
      brand: "Microsoft",
      shownUrl: "https://login.microsoftonline.com/",
      isPhishing: false,
      form: {
        heading: "Sign in",
        email: "Email, phone, or Skype",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Next",
        footer: "© Microsoft 2026 — Privacy • Terms",
      },
      note: "Official domain + HTTPS.",
    },
    {
      id: "instagram-phish",
      kind: "login",
      brand: "Instagram",
      shownUrl: "https://instagram-security.support/login",
      isPhishing: true,
      form: {
        heading: "Log in to Instagram",
        email: "Phone number, username, or email",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log in",
        footer: "© 2026 Instagram from Meta",
      },
      note: "“security.support” isn’t an official Instagram domain.",
    },
  ],
  ku: [
    {
      id: "paypal-phish",
      kind: "login",
      brand: "PayPal",
      shownUrl: "http://paypaI.com-security-check.com/login",
      isPhishing: true,
      form: {
        heading: "Sign in to PayPal",
        email: "Email or mobile number",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log In",
        footer: "© 2026 PayPal Inc. — Terms • Privacy",
      },
      note: "تەماشای پیتەکان بکە: I بە شوێنی l — وەکەش HTTPS نییە.",
    },
    {
      id: "microsoft-safe",
      kind: "login",
      brand: "Microsoft",
      shownUrl: "https://login.microsoftonline.com/",
      isPhishing: false,
      form: {
        heading: "Sign in",
        email: "Email, phone, or Skype",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Next",
        footer: "© Microsoft 2026 — Privacy • Terms",
      },
      note: "دۆمەینی فەرمی + HTTPS.",
    },
    {
      id: "instagram-phish",
      kind: "login",
      brand: "Instagram",
      shownUrl: "https://instagram-security.support/login",
      isPhishing: true,
      form: {
        heading: "Log in to Instagram",
        email: "Phone number, username, or email",
        password: "Password",
        forgot: "Forgot password?",
        signIn: "Log in",
        footer: "© 2026 Instagram from Meta",
      },
      note: "“security.support” دۆمەینی فەرمیی Instagram نییە.",
    },
  ],
};

const WHATSAPP_SCENARIOS: Record<Lang, DemoScenario[]> = {
  ar: [
    {
      id: "wa-phish-verify",
      kind: "whatsapp",
      brand: "WhatsApp",
      shownUrl: "https://wa.me/verify?redirect=http://wa-support-login.net",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp Support",
        fromMeta: "Business Account",
        message: "تم رصد محاولة دخول غير معتادة. لتأكيد هويتك وتجنب قفل الحساب، اضغط الرابط.",
        cta: "تأكيد الحساب",
      },
      note: "واتساب عادةً ما يطلب منك تسجيل دخول عبر رابط خارجي.",
    },
    {
      id: "wa-safe-device",
      kind: "whatsapp",
      brand: "web.whatsapp.com",
      shownUrl: "https://web.whatsapp.com/",
      isPhishing: false,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp",
        fromMeta: "Notification",
        message: "إذا تريد تربط جهاز جديد، استخدم WhatsApp Web من الرابط الرسمي.",
        cta: "فتح WhatsApp Web",
      },
      note: "الرابط رسمي (web.whatsapp.com) ومباشر بدون تحويلات.",
    },
    {
      id: "wa-phish-bank",
      kind: "whatsapp",
      brand: "Bank Alert",
      shownUrl: "https://bit.ly/3SecureLoginNow",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "Bank Security",
        fromMeta: "+964 7xx xxx xxxx",
        message: "تحذير: تم إيقاف بطاقتك مؤقتًا. حدّث معلوماتك فورًا لإعادة التفعيل.",
        cta: "تحديث المعلومات",
      },
      note: "الروابط المختصرة + الاستعجال غالبًا فخ.",
    },
  ],
  en: [
    {
      id: "wa-phish-verify",
      kind: "whatsapp",
      brand: "WhatsApp",
      shownUrl: "https://wa.me/verify?redirect=http://wa-support-login.net",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp Support",
        fromMeta: "Business Account",
        message: "Unusual sign-in detected. Confirm your identity to avoid account lock.",
        cta: "Verify account",
      },
      note: "WhatsApp rarely asks you to log in via an external link.",
    },
    {
      id: "wa-safe-device",
      kind: "whatsapp",
      brand: "web.whatsapp.com",
      shownUrl: "https://web.whatsapp.com/",
      isPhishing: false,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp",
        fromMeta: "Notification",
        message: "To link a new device, use the official WhatsApp Web page.",
        cta: "Open WhatsApp Web",
      },
      note: "Official domain (web.whatsapp.com) with no weird redirects.",
    },
    {
      id: "wa-phish-bank",
      kind: "whatsapp",
      brand: "Bank Alert",
      shownUrl: "https://bit.ly/3SecureLoginNow",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "Bank Security",
        fromMeta: "+964 7xx xxx xxxx",
        message: "Alert: your card is temporarily suspended. Update details now to restore access.",
        cta: "Update details",
      },
      note: "Short links + urgency is a common trap.",
    },
  ],
  ku: [
    {
      id: "wa-phish-verify",
      kind: "whatsapp",
      brand: "WhatsApp",
      shownUrl: "https://wa.me/verify?redirect=http://wa-support-login.net",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp Support",
        fromMeta: "Business Account",
        message: "هەوڵی چوونەژوورەوەی نەناسراو دۆزرایەوە. بۆ دڵنیابوونەوە لە ناسنامەکەت کلیک بکە.",
        cta: "پشتڕاستکردنەوە",
      },
      note: "واتساپ زۆرجار داوای چوونەژوورەوە لەسەر لینکی دەرەکی ناکات.",
    },
    {
      id: "wa-safe-device",
      kind: "whatsapp",
      brand: "web.whatsapp.com",
      shownUrl: "https://web.whatsapp.com/",
      isPhishing: false,
      wa: {
        header: "WhatsApp",
        fromName: "WhatsApp",
        fromMeta: "Notification",
        message: "بۆ پەیوەستکردنی ئامێری نوێ، تەنیا لە WhatsApp Web فەرمی بەکارهێنە.",
        cta: "کردنەوەی WhatsApp Web",
      },
      note: "دۆمەینی فەرمی (web.whatsapp.com) و بەبێ گواستنەوە.",
    },
    {
      id: "wa-phish-bank",
      kind: "whatsapp",
      brand: "Bank Alert",
      shownUrl: "https://bit.ly/3SecureLoginNow",
      isPhishing: true,
      wa: {
        header: "WhatsApp",
        fromName: "Bank Security",
        fromMeta: "+964 7xx xxx xxxx",
        message: "ئاگاداری: کارتەکەت کاتیانە وەستاوە. زانیاری نوێ بکەرەوە بۆ چالاککردنەوە.",
        cta: "نوێکردنەوەی زانیاری",
      },
      note: "لینکی کورتکراوە + فشار زۆرجار فێڵە.",
    },
  ],
};

export function getDemoScenarios(lang: Lang, kind: DemoScenarioKind): DemoScenario[] {
  const l = COPY[lang] ? lang : "en";
  return (kind === "login" ? LOGIN_SCENARIOS[l] : WHATSAPP_SCENARIOS[l]) ?? [];
}
