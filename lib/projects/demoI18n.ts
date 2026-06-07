export type DemoLang = "ar" | "en" | "ku";

// ملاحظة: العربية هنا قريبة للهجة العراقية حتى تكون منسجمة ويا الموقع
export const demoT: Record<DemoLang, {
  common: {
    demo: string;
    back: string;
    home: string;
    continue: string;
    total: string;
    items: string;
    add: string;
    clear: string;
  };
  store: {
    title: string;
    subtitle: string;
    welcome: string;
    welcomeText: string;
    hint: string;
    openDetails: string;
    cart: string;
    checkout: string;
    emptyCart: string;
    addToCart: string;
    placeOrder: string;
    subtotal: string;
    tax: string;
    grandTotal: string;
    noPayments: string;
    ordersTab: string;
    profileTab: string;
    storeTab: string;
  };
  menu: {
    title: string;
    subtitle: string;
    table: string;
    categories: {
      main: string;
      drinks: string;
      dessert: string;
    };
    view: string;
    addToOrder: string;
    yourOrder: string;
    emptyOrder: string;
    notes: string;
    send: string;
  };
  pos: {
    title: string;
    subtitle: string;
    invoice: string;
    pay: string;
    cash: string;
    card: string;
    paid: string;
    subtotal: string;
    tax: string;
    grandTotal: string;
    qty: string;
  };
}> = {
  ar: {
    common: {
      demo: "تجريبي",
      back: "رجوع",
      home: "الرئيسية",
      continue: "كمّل",
      total: "الإجمالي",
      items: "قطع",
      add: "إضافة",
      clear: "تفريغ",
    },
    store: {
      title: "متجر KODIFY",
      subtitle: "ستور أونلاين (تجريبي)",
      welcome: "هلا بيك 👋",
      welcomeText: "جرّب ستور حقيقي داخل الموقع",
      hint: "دوس على أي منتج حتى تفتح التفاصيل.",
      openDetails: "تفاصيل →",
      cart: "السلة",
      checkout: "إتمام الطلب",
      emptyCart: "السلة فاضية.",
      addToCart: "أضف للسلة",
      placeOrder: "ثبّت الطلب (تجريبي)",
      subtotal: "المجموع",
      tax: "ضريبة",
      grandTotal: "الإجمالي",
      noPayments: "ماكو دفع حقيقي — هذا مجرد عرض تفاعلي.",
      ordersTab: "طلباتي",
      profileTab: "حسابي",
      storeTab: "الستور",
    },
    menu: {
      title: "مينيو KODIFY",
      subtitle: "مينيو أونلاين (تجريبي)",
      table: "طاولة 12",
      categories: {
        main: "الأطباق",
        drinks: "مشروبات",
        dessert: "حلو",
      },
      view: "عرض",
      addToOrder: "أضف للطلب",
      yourOrder: "طلبك",
      emptyOrder: "ماكو شي بالطلب بعد.",
      notes: "ملاحظات (اختياري)",
      send: "إرسال للمطبخ (تجريبي)",
    },
    pos: {
      title: "نظام مبيعات",
      subtitle: "POS / كاشير (تجريبي)",
      invoice: "فاتورة",
      pay: "دفع",
      cash: "كاش",
      card: "كي كارد",
      paid: "تم الدفع (تجريبي)",
      subtotal: "المجموع",
      tax: "ضريبة",
      grandTotal: "الإجمالي",
      qty: "العدد",
    },
  },
  en: {
    common: {
      demo: "Demo",
      back: "Back",
      home: "Home",
      continue: "Continue",
      total: "Total",
      items: "items",
      add: "Add",
      clear: "Clear",
    },
    store: {
      title: "KODIFY Store",
      subtitle: "Online Store (Demo)",
      welcome: "Welcome",
      welcomeText: "Try a real mini-store",
      hint: "Tap any product to open details.",
      openDetails: "Open details →",
      cart: "Cart",
      checkout: "Checkout",
      emptyCart: "Cart is empty.",
      addToCart: "Add to cart",
      placeOrder: "Place Order (Demo)",
      subtotal: "Subtotal",
      tax: "Tax",
      grandTotal: "Grand total",
      noPayments: "No real payments — interactive preview only.",
      ordersTab: "Orders",
      profileTab: "Profile",
      storeTab: "Store",
    },
    menu: {
      title: "KODIFY Menu",
      subtitle: "Online Menu (Demo)",
      table: "Table 12",
      categories: {
        main: "Main",
        drinks: "Drinks",
        dessert: "Dessert",
      },
      view: "View",
      addToOrder: "Add",
      yourOrder: "Your order",
      emptyOrder: "Nothing yet.",
      notes: "Notes (optional)",
      send: "Send to kitchen (Demo)",
    },
    pos: {
      title: "Sales POS",
      subtitle: "Checkout (Demo)",
      invoice: "Receipt",
      pay: "Pay",
      cash: "Cash",
      card: "Card",
      paid: "Paid (Demo)",
      subtotal: "Subtotal",
      tax: "Tax",
      grandTotal: "Total",
      qty: "Qty",
    },
  },
  ku: {
    common: {
      demo: "دیمۆ",
      back: "گەڕانەوە",
      home: "سەرەکی",
      continue: "بەردەوام بە",
      total: "کۆی گشتی",
      items: "دانە",
      add: "زیادکردن",
      clear: "پاککردنەوە",
    },
    store: {
      title: "فرۆشگای KODIFY",
      subtitle: "فرۆشگای ئۆنلاین (دیمۆ)",
      welcome: "بەخێربێیت 👋",
      welcomeText: "تاقیکردنەوەی فرۆشگایەکی بچووکی ڕاستەقینە",
      hint: "کلیک لەسەر هەر بەرهەمێک بکە بۆ بینینی وردەکارییەکان.",
      openDetails: "کردنەوەی وردەکارییەکان ←",
      cart: "سەبەتەی کڕین",
      checkout: "تەواوکردنی کڕین",
      emptyCart: "سەبەتەی کڕین بەتاڵە.",
      addToCart: "زیادکردن بۆ سەبەتە",
      placeOrder: "تۆمارکردنی داواکاری (دیمۆ)",
      subtotal: "کۆی بەشەکی",
      tax: "باج",
      grandTotal: "کۆی گشتی",
      noPayments: "هیچ پارەدانێکی ڕاستەقینە نییە — تەنها پێشاندانێکی کارلێکەرە.",
      ordersTab: "داواکارییەکانم",
      profileTab: "پڕۆفایلەکەم",
      storeTab: "فرۆشگا",
    },
    menu: {
      title: "مێنیوی KODIFY",
      subtitle: "مێنیوی ئۆنلاین (دیمۆ)",
      table: "مێزی ١٢",
      categories: {
        main: "خواردنە سەرەکییەکان",
        drinks: "خواردنەوەکان",
        dessert: "شیرینییەکان",
      },
      view: "بینین",
      addToOrder: "زیادکردن بۆ داواکاری",
      yourOrder: "داواکارییەکەت",
      emptyOrder: "سەبەتەی داواکارییەکەت هێشتا بەتاڵە.",
      notes: "تێبینییەکان (ئارەزوومەندانە)",
      send: "ناردن بۆ چێشتخانە (دیمۆ)",
    },
    pos: {
      title: "سیستەمی فرۆشتن (POS)",
      subtitle: "ئەژمارکردن و کاشێر (دیمۆ)",
      invoice: "پسوڵە",
      pay: "پارەدان",
      cash: "کاش",
      card: "کارت",
      paid: "سەرکەوتوو بوو (دیمۆ)",
      subtotal: "کۆی بەشەکی",
      tax: "باج",
      grandTotal: "کۆی گشتی",
      qty: "بڕ/ژمارە",
    },
  },
};

export function demoDir(lang: DemoLang) {
  return lang === "en" ? "ltr" : "rtl";
}
