"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  BarChart3,
  Terminal,
  ShieldAlert,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Play,
  ShoppingCart,
  Database,
  Calendar as CalendarIcon,
  MessageSquare,
  Info,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Camera,
  Square,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Smartphone,
} from "lucide-react";

export default function InteractiveSimulator() {
  const { lang } = useApp();
  const [activeEmulator, setActiveEmulator] = useState<number | null>(null);

  useEffect(() => {
    if (activeEmulator !== null) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if ((window as any).lenis) (window as any).lenis.start();
    };
  }, [activeEmulator]);

  const cards = [
    {
      icon: Laptop,
      title: lang === "ar" ? "متجر إلكتروني متكامل" : lang === "ku" ? "فرۆشگای ئەلیکترۆنی" : "E-Commerce Store",
      desc:
        lang === "ar"
          ? "متجر إلكتروني متكامل لإدارة المنتجات، الطلبات، والبيع المباشر عبر الإنترنت بأحدث الأطر مثل Next.js 15."
          : lang === "ku"
          ? "فرۆشگایەکی ئەلیکترۆنی تەواو بۆ بەڕێوەبردنی بەرهەمەکان، سەبەتەی کڕین و داواکارییەکان بە Next.js 15."
          : "A complete e-commerce store to manage products, shopping cart, and orders built with Next.js 15.",
      badge: "Next.js 15",
      color: "from-blue-600 to-sky-400",
      glow: "rgba(37, 99, 235, 0.15)",
      image: "/1.png"
    },
    {
      icon: ShoppingCart,
      title: lang === "ar" ? "أنظمة المبيعات و POS" : lang === "ku" ? "سیستەمی مبيعات و POS" : "Smart POS Systems",
      desc:
        lang === "ar"
          ? "نظام نقاط بيع سحابي متكامل لإدارة الطلبات، الحسابات، والفواتير بكفاءة."
          : lang === "ku"
          ? "سیستەمێکی فرۆشتنی پێشکەوتوو بۆ بەڕێوەبردنی داواکاری و حسابات."
          : "Cloud-based POS systems to manage orders, transactions, and print receipts.",
      badge: "Smart POS",
      color: "from-emerald-600 to-teal-400",
      glow: "rgba(5, 150, 105, 0.15)",
      image: "/inventory.webp"
    },
    {
      icon: Terminal,
      title: lang === "ar" ? "البنية التحتية والسحاب" : lang === "ku" ? "ژێرخانی کلەود" : "Cloud & Infrastructure",
      desc:
        lang === "ar"
          ? "إدارة الخوادم، بيئات الحاويات (Docker)، وأنظمة النشر التلقائي."
          : lang === "ku"
          ? "بەڕێوەبردنی سێرڤەر و کۆنتێنەر (Docker) و سیستەمی دیپلۆیکردن."
          : "Secure server management, containerization, and automation.",
      badge: "DevOps & Cloud",
      color: "from-indigo-600 to-purple-400",
      glow: "rgba(79, 70, 229, 0.15)",
      image: "/bareza.png"
    },
    {
      icon: ShoppingBag,
      title: lang === "ar" ? "متجر رياضي متكامل" : lang === "ku" ? "فرۆشگای وەرزشی ئەدم" : "ADMSPOORT Sports Store",
      desc:
        lang === "ar"
          ? "منصة تجارة إلكترونية متكاملة لبيع الملابس والمستلزمات الرياضية بأعلى كفاءة."
          : lang === "ku"
          ? "سەکۆیەکی بازرگانی ئەلیکترۆنی بۆ فرۆشتنی جلوبەرگ و پێداویستییە وەرزشییەکان."
          : "An integrated e-commerce platform for selling sportswear and premium gym equipment.",
      badge: "E-Commerce",
      color: "from-rose-600 to-orange-400",
      glow: "rgba(225, 29, 72, 0.15)",
      image: "/admsop1.png"
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" id="interactive-labs">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand bg-brand-soft mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-bright)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-bright)]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan">
              {lang === "ar" ? "معمل محاكاة الأنظمة" : lang === "ku" ? "تاقیگەی ئەزموونی" : "Interactive Systems Sandbox"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight"
          >
            {lang === "ar" ? (
              <>
                استكشف حلولنا <span className="text-brand-cyan">التفاعلية</span>
              </>
            ) : lang === "ku" ? (
              <>
                سیستەمەکانمان <span className="text-brand-cyan">تاقیبکەرەوە</span>
              </>
            ) : (
              <>
                Explore Our <span className="text-brand-cyan">Interactive Solutions</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="theme-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
          >
            {lang === "ar"
              ? "اضغط على أي قسم أدناه لتشغيل المحاكي التفاعلي الحي وتجربة جودة وسرعة أنظمتنا بنفسك."
              : lang === "ku"
              ? "کلیک لەسەر هەر بەشێکی خوارەوە بکە بۆ کارپێکردنی سیمیولەیتەری ڕاستەوخۆ."
              : "Click any section below to launch the live simulator and experience the quality and speed of our systems."}
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setActiveEmulator(i)}
              className="group relative cursor-pointer rounded-3xl border border-[var(--border-strong)] bg-slate-900/30 backdrop-blur-xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-cyan-soft hover:shadow-[0_20px_50px_rgba(43,127,255,0.06)]"
              style={{
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
              }}
            >
              {/* Inner card glow on hover */}
              <div
                className="absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: c.glow }}
              />

              <div>
                {/* Image Header */}
                {c.image && (
                  <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/5 relative bg-slate-950/50">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  </div>
                )}

                {/* Icon & Badge Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full rounded-[11px] bg-[#030712] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                      <c.icon size={18} strokeWidth={1.5} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-brand-soft border border-brand px-2.5 py-0.5 rounded-full text-brand-cyan tracking-wider">
                    {c.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-black text-white mb-2 group-hover:text-brand-cyan transition-colors text-start">
                  {c.title}
                </h3>
                <p className="text-[11px] theme-muted leading-relaxed mb-6 text-start">
                  {c.desc}
                </p>
              </div>

              {/* Footer action trigger */}
              <div className="flex items-center gap-2 text-xs font-black text-brand-cyan group-hover:text-white transition-colors pt-3 border-t border-white/5">
                <Play size={12} className="fill-current" />
                <span>{lang === "ar" ? "شغّل المحاكي" : lang === "ku" ? "دەستپێکردنی دیمۆ" : "Launch Simulator"}</span>
                <ArrowRight
                  size={14}
                  className="ms-auto transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emulator Modal */}
      <AnimatePresence>
        {activeEmulator !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            dir={lang === "ar" || lang === "ku" ? "rtl" : "ltr"}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEmulator(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-[95vw] lg:w-[90vw] max-w-6xl bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              style={{ height: "85vh", maxHeight: "850px" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 me-4" dir="ltr">
                    <button
                      onClick={() => setActiveEmulator(null)}
                      className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono font-medium text-white/40 select-none uppercase tracking-widest">
                    {activeEmulator === 0
                      ? (lang === "ar" ? "متجر إلكتروني - Next.js" : lang === "ku" ? "فرۆشگای ئەلیکترۆنی - Next.js" : "e-commerce store - next.js")
                      : activeEmulator === 1
                      ? (lang === "ar" ? "لوحة التحكم - POS" : lang === "ku" ? "کۆنترۆڵ - POS" : "dashboard - pos")
                      : activeEmulator === 2
                      ? (lang === "ar" ? "متصفح الويب - Bareza" : lang === "ku" ? "وێبگەڕ - Bareza" : "browser - barezagroup")
                      : (lang === "ar" ? "متجر أدم سبورت - ADMSPOORT" : lang === "ku" ? "فرۆشگای ئەدم سپۆرت - ADMSPOORT" : "sports store - admspoort")}
                  </span>
                </div>
                <button
                  onClick={() => setActiveEmulator(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden relative bg-[#0a0f1c]" dir="ltr">
                {activeEmulator === 0 && <WebEmulator />}
                {activeEmulator === 1 && <DashboardEmulator onClose={() => setActiveEmulator(null)} />}
                {activeEmulator === 2 && <WebEmulator url="https://barezagroup.com/" title="Bareza Group" />}
                {activeEmulator === 3 && <WebEmulator url="https://admspoort.com/" title="ADMSPOORT" />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function WebEmulator({ url = "https://babylongates.art/", title = "Babylon Gates" }: { url?: string, title?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 1440, height: 900, scale: 1 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth === 0 || offsetHeight === 0) return;
      
      const virtualWidth = 1440;
      const scale = offsetWidth / virtualWidth;
      const virtualHeight = offsetHeight / scale;
      
      setDimensions({
        width: virtualWidth,
        height: virtualHeight,
        scale: scale
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    
    const timer = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden font-sans min-h-0">
      <div className="h-10 border-b border-slate-200 flex items-center px-4 justify-between shrink-0 bg-slate-50">
        <div className="flex gap-1.5" dir="ltr">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 max-w-md mx-4 bg-white border border-slate-200 rounded px-3 py-0.5 text-[10px] text-slate-400 text-center truncate select-none">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </div>
        <div className="w-4" />
      </div>
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#0a0f1c]">
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformOrigin: "top left",
            transform: `scale(${dimensions.scale})`
          }}
        >
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            scrolling="yes"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardEmulator({ onClose }: { onClose: () => void }) {
  const { lang } = useApp();
  const [activeTab, setActiveTab] = useState("pos");
  
  // Persistence States
  const [products, setProducts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_products");
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 1, nameAr: "إسبريسو", nameKu: "ئێسپریسۆ", nameEn: "Espresso", price: 4000, cost: 1500, stock: 12, category: "coffee", barcode: "500123", color: "#6366f1" },
      { id: 2, nameAr: "كابوتشينو", nameKu: "کاپوچینۆ", nameEn: "Cappuccino", price: 5000, cost: 2000, stock: 8, category: "coffee", barcode: "500124", color: "#6366f1" },
      { id: 3, nameAr: "لاتيه مثلج", nameKu: "لاتێی سارد", nameEn: "Iced Latte", price: 6000, cost: 2500, stock: 3, category: "coffee", barcode: "500125", color: "#6366f1" },
      { id: 4, nameAr: "كرواسون زبدة", nameKu: "کرۆسانی کەرە", nameEn: "Butter Croissant", price: 3500, cost: 1200, stock: 15, category: "bakery", barcode: "600123", color: "#ec4899" },
      { id: 5, nameAr: "مافن شوكولاتة", nameKu: "مافینی شوکولاتە", nameEn: "Chocolate Muffin", price: 4000, cost: 1500, stock: 0, category: "bakery", barcode: "600124", color: "#ec4899" },
      { id: 6, nameAr: "عصير برتقال طازج", nameKu: "شەربەتی پرتەقاڵ", nameEn: "Fresh Orange Juice", price: 4500, cost: 1800, stock: 20, category: "drinks", barcode: "700123", color: "#f59e0b" },
      { id: 7, nameAr: "قهوة تركية", nameKu: "قاوەی تورکی", nameEn: "Turkish Coffee", price: 3000, cost: 1000, stock: 25, category: "coffee", barcode: "500126", color: "#6366f1" },
      { id: 8, nameAr: "ماء فوار", nameKu: "ئاوی گازدار", nameEn: "Sparkling Water", price: 1500, cost: 400, stock: 40, category: "drinks", barcode: "700124", color: "#f59e0b" }
    ];
  });

  const [sales, setSales] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_sales");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "sale-1",
        invoiceNumber: "1001",
        createdAt: "2028-06-01T10:15:30.000Z",
        totalAmount: 240000,
        paymentMethod: "cash",
        customerName: "عميل سفري",
        status: "completed",
        items: [
          { name: "Espresso", qty: 30, price: 4000, total: 120000 },
          { name: "Iced Latte", qty: 20, price: 6000, total: 120000 }
        ]
      },
      {
        id: "sale-2",
        invoiceNumber: "1002",
        createdAt: "2028-06-01T14:45:00.000Z",
        totalAmount: 200000,
        paymentMethod: "card",
        customerName: "عميل سفري",
        status: "completed",
        items: [
          { name: "Cappuccino", qty: 40, price: 5000, total: 200000 }
        ]
      },
      {
        id: "sale-3",
        invoiceNumber: "1003",
        createdAt: "2028-06-02T09:30:15.000Z",
        totalAmount: 20000,
        paymentMethod: "cash",
        customerName: "عميل سفري",
        status: "completed",
        items: [
          { name: "Espresso", qty: 5, price: 4000, total: 20000 }
        ]
      }
    ];
  });

  // Settings persistence
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("pos_sim_store_name");
      if (savedName) {
        setStoreName(savedName);
      } else {
        setStoreName(lang === "ar" ? "نظام كوديفاي" : lang === "ku" ? "سیستەمی کۆدیفای" : "Kodify System");
      }

      const savedPhone = localStorage.getItem("pos_sim_store_phone");
      if (savedPhone) {
        setStorePhone(savedPhone);
      } else {
        const randDigits = Math.floor(1000000 + Math.random() * 9000000);
        setStorePhone(`+964 750 ${randDigits.toString().slice(0, 3)} ${randDigits.toString().slice(3)}`);
      }

      const savedAddress = localStorage.getItem("pos_sim_store_address");
      if (savedAddress) {
        setStoreAddress(savedAddress);
      } else {
        setStoreAddress(lang === "ar" ? "العراق، أربيل" : lang === "ku" ? "عێراق، هەولێر" : "Erbil, Iraq");
      }
    }
  }, [lang]);

  const [printerIP, setPrinterIP] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_printer_ip");
      if (saved) return saved;
    }
    return "192.168.1.100";
  });

  const [mockHardware, setMockHardware] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_mock_hardware");
      if (saved) return saved;
    }
    return "true";
  });

  const [tunnelEnabled, setTunnelEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_tunnel_enabled");
      if (saved) return saved;
    }
    return "true";
  });

  const [tunnelPort, setTunnelPort] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pos_sim_tunnel_port");
      if (saved) return saved;
    }
    return "8787";
  });

  const [tunnelRunning, setTunnelRunning] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_sim_products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos_sim_sales", JSON.stringify(sales));
    }
  }, [sales]);

  // POS State
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout & Modals State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  
  // Discounts
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [globalDiscountType, setGlobalDiscountType] = useState<"percent" | "flat">("percent");
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("0");
  const [discountTypeInput, setDiscountTypeInput] = useState<"percent" | "flat">("percent");

  // Inventory Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    nameAr: "", nameKu: "", nameEn: "", price: 0, cost: 0, stock: 0, category: "coffee", barcode: ""
  });

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed 5)
  const [currentYear, setCurrentYear] = useState(2028);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Chat Support Mock
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");

  // Translations Map
  const t = {
    ar: {
      register: "كاشير (POS)",
      inventory: "المخازن والمستودع",
      calendar: "تقويم المبيعات",
      chat: "الرسائل والمحادثات",
      about: "حول النظام",
      settings: "إعدادات النظام",
      logout: "إغلاق المحاكي",
      scanBarcode: "امسح الباركود أو ابحث هنا...",
      allCategories: "الكل",
      available: "متوفر",
      lowStock: "مخزون منخفض",
      outOfStock: "نفذ المخزون",
      cart: "السلة",
      cartEmpty: "السلة فارغة",
      noItemsYet: "لا توجد مواد بعد",
      subtotal: "المجموع قبل الخصم",
      discount: "الخصم العام",
      total: "المجموع النهائي",
      clearCart: "تفريغ السلة",
      checkout: "دفع وإنهاء الفاتورة",
      currency: "د.ع",
      cost: "سعر الكلفة",
      price: "سعر البيع",
      profit: "الربح الصافي",
      stock: "الكمية",
      actions: "الإجراءات",
      addProduct: "إضافة منتج",
      storeName: "اسم المتجر",
      phone: "رقم الهاتف",
      mockMode: "وضع المحاكاة الافتراضي",
      printerIp: "عنوان IP للطابعة",
      broadcast: "البث اللاسلكي للتطبيق (موبايل)",
      statusActive: "البث نشط",
      statusStopped: "البث متوقف",
      stopBroadcast: "إيقاف البث",
      startBroadcast: "بدء البث",
      scanQr: "امسح الكود بهاتفك",
      copied: "تم النسخ!",
      aboutSystem: "حول نظام كوديفاي POS",
      systemVersion: "نسخة النظام v1.0.0 (إصدار الحاسبة)",
      devDescription: "نظام نقاط بيع متكامل لإدارة المبيعات، المخزون، والتقويم المالي بجودة عالية وسرعة فائقة.",
      chatTitle: "محادثات الدعم الفني",
      noMessages: "لا توجد رسائل دعم فني نشطة حالياً.",
      save: "حفظ الإعدادات"
    },
    ku: {
      register: "کاشێر (POS)",
      inventory: "کۆگا و کاڵاکان",
      calendar: "ڕۆژژمێری فرۆشتن",
      chat: "نامەکان / چات",
      about: "دەربارەی سیستەم",
      settings: "ڕێکخستنی فرۆشگا",
      logout: "داخستنی سیمیولەیتەر",
      scanBarcode: "بارکۆد سکان بکە یان لێرە بگەڕێ...",
      allCategories: "سەرجەم هاوپۆلەکان",
      available: "بەردەستە",
      lowStock: "کۆگای کەم ماوە",
      outOfStock: "تەواو بووە",
      cart: "سەبەتەی فرۆشتن",
      cartEmpty: "سەبەتەکە بەتاڵە",
      noItemsYet: "هیچ کاڵایەک لە سەبەتەدا نییە",
      subtotal: "کۆی بەشەکی (پێش داشکاندن)",
      discount: "داشکاندنی گشتی",
      total: "کۆی کۆتایی",
      clearCart: "پاککردنەوەی سەبەتە",
      checkout: "تەواوکردنی کڕین و پسوڵە",
      currency: "د.ع",
      cost: "نرخی کڕین",
      price: "نرخی فرۆشتن",
      profit: "قازانجی خالص",
      stock: "بڕ",
      actions: "کردارەکان",
      addProduct: "زیادکردنی بەرهەم",
      storeName: "ناوی فرۆشگا",
      phone: "ژمارەی مۆبایل/تەلەفۆن",
      mockMode: "دۆخی سیمیولەیتەر",
      printerIp: "ناونیشانی IP ی پرینتەر",
      broadcast: "پەخشکردن بۆ ئەپی مۆبایل",
      statusActive: "پەخش چالاکە",
      statusStopped: "پەخش ناچالاکە",
      stopBroadcast: "وەستاندنی پەخش",
      startBroadcast: "دەستپێکردنی پەخش",
      scanQr: "کۆدەکە بە مۆبایلەکەت سکان بکە",
      copied: "کۆپی کرا!",
      aboutSystem: "دەربارەی سیستەمی کۆدیفای POS",
      systemVersion: "وەشانی سیستەم v1.0.0 (دیسکتۆپ)",
      devDescription: "سیستەمێکی پێشکەوتووی فرۆشتن و حسابات بۆ بەڕێوەبردنی فرۆشتن، کۆگا و دارایی بە کاراییەکی زۆر خێرا.",
      chatTitle: "چاتی پشتیوانیی تەکنیکی",
      noMessages: "هیچ نامەیەکی پشتیوانی چالاک نییە.",
      save: "پاشەکەوتکردنی ڕێکخستنەکان"
    },
    en: {
      register: "Register (POS)",
      inventory: "Inventory & Stock",
      calendar: "Sales Calendar",
      chat: "Chat / Messages",
      about: "About System",
      settings: "Store Settings",
      logout: "Close Simulator",
      scanBarcode: "Scan barcode or search here...",
      allCategories: "All Categories",
      available: "Available",
      lowStock: "Low Stock",
      outOfStock: "Out of Stock",
      cart: "Cart",
      cartEmpty: "Cart is empty",
      noItemsYet: "No items yet",
      subtotal: "Subtotal Before Discount",
      discount: "General Discount",
      total: "Total",
      clearCart: "Clear Cart",
      checkout: "Checkout & Print",
      currency: "IQD",
      cost: "Cost Price",
      price: "Retail Price",
      profit: "Net Profit",
      stock: "Stock",
      actions: "Actions",
      addProduct: "Add Product",
      storeName: "Store Name",
      phone: "Phone Number",
      mockMode: "Virtual Mock Mode",
      printerIp: "Printer IP Address",
      broadcast: "Mobile App Access",
      statusActive: "Broadcast Active",
      statusStopped: "Broadcast Stopped",
      stopBroadcast: "Stop Broadcast",
      startBroadcast: "Start Broadcast",
      scanQr: "Scan QR Code on your phone",
      copied: "Copied!",
      aboutSystem: "About Kodify POS",
      systemVersion: "System Version v1.0.0 (Desktop Edition)",
      devDescription: "Point of Sale system for managing sales, stock, and financial calendars with high performance.",
      chatTitle: "Support Chat",
      noMessages: "No support messages are active.",
      save: "Save Settings"
    }
  };

  const currT = t[lang as "ar" | "ku" | "en"] || t.en;

  // Add to Cart
  const addToCart = (product: any) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.min(prod.stock, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount =
    globalDiscountType === "percent" ? subtotal * (globalDiscount / 100) : globalDiscount;
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products for catalog
  const filteredProducts = products.filter((p) => {
    const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
    const matchesQuery =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery)) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  // Checkout submit
  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;
    const invoiceNum = Math.floor(1000 + Math.random() * 9000).toString();
    const newInvoice = {
      id: `sale-${Date.now()}`,
      invoiceNumber: invoiceNum,
      createdAt: new Date().toISOString(),
      totalAmount: grandTotal,
      paymentMethod,
      customerName: lang === "ar" ? "عميل سفري" : lang === "ku" ? "کڕیاری گشتی" : "Walk-in Customer",
      status: "completed",
      items: cart.map((item) => ({
        name: lang === "ar" ? item.nameAr : lang === "ku" ? item.nameKu : item.nameEn,
        qty: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }))
    };

    // Update stocks
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setSales((prev) => [newInvoice, ...prev]);
    setLastInvoice(newInvoice);
    setCheckoutSuccess(true);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  // Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = {
      ...productForm,
      id: Date.now(),
      color: productForm.category === "coffee" ? "#6366f1" : productForm.category === "bakery" ? "#ec4899" : "#f59e0b"
    };
    setProducts((prev) => [...prev, newProd]);
    setIsAddProductOpen(false);
    setProductForm({ nameAr: "", nameKu: "", nameEn: "", price: 0, cost: 0, stock: 0, category: "coffee", barcode: "" });
  };

  // Edit Product Submit
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm } : p))
    );
    setIsEditProductOpen(false);
    setEditingProduct(null);
    setProductForm({ nameAr: "", nameKu: "", nameEn: "", price: 0, cost: 0, stock: 0, category: "coffee", barcode: "" });
  };

  // Delete Product
  const handleDeleteProduct = (id: number) => {
    if (confirm(lang === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Calendar helpers
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (month: number, year: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIdx = getFirstDayIndex(currentMonth, currentYear);

  const daysGrid = Array.from({ length: 35 }, (_, idx) => {
    const dayNum = idx - firstDayIdx + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return dayNum;
    }
    return null;
  });

  const getDailyRevenue = (day: number) => {
    return sales
      .filter((s) => {
        const d = new Date(s.createdAt);
        return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, s) => sum + s.totalAmount, 0);
  };

  const monthlyTotal = sales
    .filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Settings Save
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pos_sim_store_name", storeName);
    localStorage.setItem("pos_sim_store_phone", storePhone);
    localStorage.setItem("pos_sim_store_address", storeAddress);
    localStorage.setItem("pos_sim_printer_ip", printerIP);
    localStorage.setItem("pos_sim_mock_hardware", mockHardware);
    localStorage.setItem("pos_sim_tunnel_enabled", tunnelEnabled);
    localStorage.setItem("pos_sim_tunnel_port", tunnelPort);
    alert(lang === "ar" ? "تم حفظ الإعدادات بنجاح!" : lang === "ku" ? "ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران!" : "Settings saved successfully!");
  };

  // Quick reply texts mapped by key and language
  const quickReplies: Record<string, Record<string, { button: string; userMsg: string; reply: string }>> = {
    details: {
      ar: {
        button: "📋 تفاصيل النظام",
        userMsg: "مرحباً، أود معرفة تفاصيل هذا النظام ومكوناته الأساسية.",
        reply: `تفاصيل نظام كوديفاي POS المتكامل (إصدار الحاسبة):

• واجهة البيع السريعة (Register): عرض شبكة المواد مع تصنيف ذكي، وبحث سريع بالباركود، وسلة مشتريات ديناميكية تدعم الخصومات وحساب الضرائب وطباعة الفواتير.
• إدارة المخازن (Inventory): جدول تفصيلي للمواد مع إظهار سعر التكلفة، البيع، الأرباح، وكميات المخزن، مع إشعار بالمواد التي نفذ مخزونها وإمكانية الإضافة والتعديل والحذف.
• تقويم المبيعات المالي (Sales Calendar): يعرض مجاميع المبيعات اليومية والشهرية بالدينار العراقي (IQD) مع سجل الفواتير لكل يوم لمعاينة الأرباح وتفاصيل الحسابات.
• البث والربط المحمول (Mobile Linkage): تقنية تتيح مشاركة النظام ليرتبط بالهاتف عبر شبكة Wi-Fi ومسح الـ QR.
• تقنيات النظام الأساسية: مبني بالكامل على إطار العمل Electron + React لقوة الأداء والسرعة، وقاعدة بيانات SQLite للحفظ المحلي الآمن.`
      },
      ku: {
        button: "📋 وردەکارییەکانی سیستەم",
        userMsg: "سڵاو، دەمەوێت وردەکاری ئەم سیستەمە و پێکهاتە سەرەکییەکانی بزانم.",
        reply: `وردەکارییەکانی سیستەمی کۆدیفای POS (وەشانی دیسکتۆپ):
 
• ڕووکاری فرۆشتنی خێرا (Register): پیشاندانی کاڵاکان بەپێی پۆلێنەکان، گەڕانی خێرا بە بارکۆد، سەبەتەی کڕین کە پشتگیری داشکاندن، باج و پرینتکردنی پسوڵە دەکات.
• بەڕێوەبردنی کۆگا (Inventory): خشتەی وردی کاڵاکان کە نرخی کڕین، فرۆشتن، قازانج، و بڕی کاڵاکان پیشان دەدات لەگەڵ توانای زیادکردن و سڕینەوە و دەستکاریکردن.
• ڕۆژژمێری فرۆشتنی دارایی (Sales Calendar): پیشاندانی کۆی فرۆشی ڕۆژانە و مانگانە بە دیناری عێراقی (IQD) لەگەڵ لیستی پسوڵەکانی هەر ڕۆژێک.
• پەخشی مۆبایل (Mobile Linkage): بەستنەوەی سیستەمەکە بە مۆبایل لە ڕێگەی هێڵی Wi-Fi و سکانکردنی کۆدی QR.
• تەکنەلۆژیای بنەڕەتی: دروستکراوە بە Electron + React بۆ خێرایی و هێز، لەگەڵ بنکەی داتای SQLite بۆ پاراستنی داتا بە شێوازی ناوخۆیی و ئۆفلاین.`
      },
      en: {
        button: "📋 System Details",
        userMsg: "Hello, I would like to know the details of this system and its core components.",
        reply: `System Details for Kodify POS (Desktop Edition):

• Quick Register (POS): Catalog grid by category, fast barcode search, shopping cart with tax/discount calculation, and custom printed receipts.
• Inventory Manager: Detailed table showing cost, retail price, net profit, stock counts, low stock alerts, and full item management.
• Financial Sales Calendar: View daily and monthly sales totals in IQD with full invoice audit history per day.
• Mobile Linkage: Share system access, enabling local pairing via Wi-Fi by scanning a dynamic QR code.
• Core Architecture: Powered by React + Electron wrapper for performance, with secure local storage via SQLite.`
      }
    },
    features: {
      ar: {
        button: "✨ مميزات النظام",
        userMsg: "مرحباً، ما هي مميزات ربط النظام بالهاتف والتواصل المباشر؟",
        reply: `توضيح ميزة ربط نظام الـ POS بالهاتف والتواصل المباشر مع الكاشير:

1. كيف تعمل الميزة؟
• تفعيل البث (Broadcast Mode) من شاشة إعدادات المتجر في النظام.
• توليد رمز QR ورابط محلي فريد (مثل: https://192.168.0.102:8787).
• يقوم الكاشير أو مدير الصالة بمسح رمز الـ QR بكاميرا الهاتف للربط الفوري دون الحاجة لتنصيب أي تطبيق إضافي.

2. ما هي الفوائد والميزات؟
• إضافة الطلبات (للويتر/النادل): تسجيل الطلبات مباشرة من الهاتف وتظهر فوراً عند الكاشير وتُرسل لطابعة المطبخ.
• التقارير والمتابعة المباشرة: متابعة المبيعات، الصندوق، والتقارير المالية لحظة بلحظة من هاتف صاحب العمل.
• التواصل المباشر مع الكاشير: محادثة داخلية مدمجة للتنبيهات السريعة.
• إدارة المخزن والمستودع: جرد وتعديل المواد عبر فحص باركود المنتجات بكاميرا الهاتف.`
      },
      ku: {
        button: "✨ تایبەتمەندییەکانی سیستەم",
        userMsg: "سڵاو، تایبەتمەندییەکانی بەستنەوەی سیستەمەکە بە مۆبایل و پەیوەندی ڕاستەوخۆ چییە؟",
        reply: `ڕوونکردنەوەی تایبەتمەندی بەستنەوەی سیستەمی POS بە مۆبایل و پەیوەندی ڕاستەوخۆ لەگەڵ کاشێر:

١. ئەم تایبەتمەندییە چۆن کار دەکات؟
• چالاککردنی پەخش (Broadcast Mode) لە ڕێگەی شاشەی ڕێکخستنەکانی دوکان لە سیستەمەکەدا.
• دروستکردنی کۆدی QR و لینکێکی ناوخۆیی تایبەت (بۆ نموونە: https://192.168.0.102:8787).
• کاشێر یان بەڕێوەبەری هۆڵەکە کۆدی QR بە کامێرای مۆبایلەکە سکان دەکات بۆ بەستنەوەی ڕاستەوخۆ بەبێ پێویستی بە دابەزاندنی هیچ ئەپێک.

٢. سوود و تایبەتمەندییەکان چین؟
• زیادکردنی داواکارییەکان (بۆ وایتەر/گارسۆن): تۆمارکردنی داواکارییەکان ڕاستەوخۆ لە مۆبایلەوە و دەرکەوتنی دەستبەجێ لای کاشێر و ناردنی بۆ پرینتەری چێشتخانە.
• ڕاپۆرتەکان و بەدواداچوونی ڕاستەوخۆ: بەدواداچوونی فرۆشتن، سندوق، و ڕاپۆرتە داراییەکان سات بە سات لە مۆبایلی خاوەن کارەوە.
• پەیوەندی ڕاستەوخۆ لەگەڵ کاشێر: چاتی ناوخۆیی بۆ ئاگادارکردنەوەی خێرا.
• بەڕێوەبردنی کۆگا و عەمبار: جەردکردن و دەستکاریکردنی بڕی کاڵاکان لە ڕێگەی سکانکردنی بارکۆد بە کامێرای مۆبایل.`
      },
      en: {
        button: "✨ System Features",
        userMsg: "Hello, what are the features of linking the system to mobile and direct communication?",
        reply: `Explanation of the Mobile POS Linkage & Direct Cashier Communication:

1. How does it work?
• Enable Broadcast Mode from the Store Settings in the system.
• Generate a QR code and a unique local URL (e.g., https://192.168.0.102:8787).
• Scan the QR code using a phone camera to pair instantly without installing any app.

2. Benefits & Key Features:
• Add Orders (for Waiters): Take orders table-side on mobile; they appear instantly on the cashier screen and print to the kitchen.
• Live Reports & Tracking: Monitor sales, drawer cash, and financial analytics in real-time from the owner's phone.
• Direct Chat & Alerts: Built-in internal messaging for quick cashier alerts.
• Inventory & Stock Audit: Update stock levels and scan barcodes using the mobile phone camera.`
      }
    }
  };

  // Handle click on quick reply buttons
  const handleQuickReply = (type: "details" | "features") => {
    const activeLang = (lang === "ar" || lang === "ku" || lang === "en") ? lang : "ar";
    const data = quickReplies[type][activeLang];

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgObj = { id: Date.now(), sender: "cashier", text: data.userMsg, time: userTime };
    
    setChatMessages((prev) => [...prev, userMsgObj]);

    setTimeout(() => {
      const supportTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "support", text: data.reply, time: supportTime }
      ]);
    }, 1000);
  };

  // Send message mock
  const sendSupportMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: Date.now(), sender: "cashier", text: newMsg, time: userTime };
    setChatMessages((prev) => [...prev, msg]);
    setNewMsg("");
    // Automatic simulated response
    setTimeout(() => {
      const supportTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let autoReply = "تم استلام رسالتك. جاري مراجعة طلبك من قبل الدعم الفني.";
      if (lang === "ku") {
        autoReply = "نامەکەت گەیشت. لەلایەن پشتیوانیی تەکنیکییەوە بەدواداچوونی بۆ دەکرێت.";
      } else if (lang === "en") {
        autoReply = "Your message has been received. It is being reviewed by technical support.";
      }
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "support", text: autoReply, time: supportTime }
      ]);
    }, 1200);
  };

  // Receipt Preview
  const handlePreviewInvoice = (sale: any) => {
    setLastInvoice(sale);
  };

  return (
    <div className="w-full h-full flex bg-[#080b13] text-slate-100 overflow-hidden font-sans relative select-none" dir={lang === "ar" || lang === "ku" ? "rtl" : "ltr"}>
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <div className="w-60 border-r border-white/5 bg-[#0b0f19] flex flex-col justify-between shrink-0 h-full">
        <div>
          {/* Circular Initials Cashier Info */}
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#141a2e] border border-white/5 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.08)] shrink-0">
              <img
                src="/5.png"
                alt="Kodify Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className={`flex flex-col ${lang === "ar" || lang === "ku" ? "text-right" : "text-left"}`}>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "مرحباً" : lang === "ku" ? "بەخێربێیت" : "WELCOME"}</span>
              <span className="text-xs font-black text-white">{lang === "ar" ? "الكاشير" : lang === "ku" ? "کاشێر" : "Cashier"}</span>
            </div>
            <span className="ms-auto bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border border-emerald-500/20 shrink-0">
              {lang === "ar" ? "كاشير" : lang === "ku" ? "کاشێر" : "CASHIER"}
            </span>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1.5 mt-2">
            {[
              { id: "pos", label: currT.register, icon: ShoppingCart },
              { id: "inventory", label: currT.inventory, icon: Database },
              { id: "calendar", label: currT.calendar, icon: CalendarIcon },
              { id: "chat", label: currT.chat, icon: MessageSquare },
              { id: "settings", label: currT.settings, icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedDay(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    lang === "ar" || lang === "ku" ? "text-right" : "text-left"
                  } ${
                    isActive
                      ? "bg-indigo-500/15 border border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/3"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400"} />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isActive && <div className="w-1 h-3 rounded-full bg-indigo-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout at bottom */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 hover:text-white transition-all ${
              lang === "ar" || lang === "ku" ? "text-right" : "text-left"
            }`}
          >
            <LogOut size={16} />
            <span>{currT.logout}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#080b13]">
        
        {/* VIEW 1: POS REGISTER VIEW */}
        {activeTab === "pos" && (
          <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden min-h-0">
            {/* Topbar: Search, Refresh, Cart Trigger */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4 shrink-0">
              <div className="relative flex-1 w-full max-w-lg">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-500">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder={currT.scanBarcode}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 ps-10 pe-4 bg-[#141a2e] border border-white/5 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCart([]);
                  }}
                  className="p-2.5 rounded-xl border border-white/5 bg-[#141a2e] text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
                  title={lang === "ar" ? "إعادة تعيين الكاشير" : lang === "ku" ? "سەرلەنوێ ڕێکخستنەوەی کاشێر" : "Reset POS"}
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative px-4 py-2.5 rounded-xl border border-indigo-400/20 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 transition-all font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.1)] shrink-0"
                >
                  <ShoppingBag size={16} />
                  <span>{currT.cart}</span>
                  {totalItemCount > 0 && (
                    <span className="bg-pink-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-[#080b13]">
                      {totalItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Scrolling categories tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 shrink-0 scrollbar-none">
              {[
                { id: "all", label: currT.allCategories },
                { id: "coffee", label: lang === "ar" ? "قهوة" : lang === "ku" ? "قاوە" : "Coffee" },
                { id: "bakery", label: lang === "ar" ? "مخبوزات" : lang === "ku" ? "شیرینی" : "Bakery" },
                { id: "drinks", label: lang === "ar" ? "مشروبات" : lang === "ku" ? "خواردنەوە" : "Drinks" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border ${
                    selectedCategory === c.id
                      ? "bg-indigo-500/15 border-indigo-500/40 text-slate-100 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                      : "bg-[#141a2e] border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Product catalog grid */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto pe-1 pb-4 min-h-0 pos-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <AlertCircle size={28} />
                  <span className="text-xs font-semibold">{lang === "ar" ? "لا توجد نتائج مطابقة" : "No products found"}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock <= 0;
                    const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
                    return (
                      <div
                        key={p.id}
                        onClick={() => !isOutOfStock && addToCart(p)}
                        className={`group flex flex-col bg-[#0f1423] border border-white/5 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-200 cursor-pointer ${
                          isOutOfStock ? "opacity-45 cursor-not-allowed" : "active:scale-[0.98]"
                        }`}
                        style={{ borderTopColor: p.color, borderTopWidth: "4px" }}
                      >
                        {/* Body */}
                        <div className={`p-3.5 flex flex-col flex-1 justify-between ${lang === "ar" || lang === "ku" ? "text-right" : "text-left"}`}>
                          <div>
                            <h4 className="font-extrabold text-white text-xs truncate" title={name}>
                              {name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block truncate">
                              {p.barcode || "SKU-MOCK"}
                            </span>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <span className="font-black text-indigo-400 text-xs font-mono">
                              {Math.round(p.price).toLocaleString()} <span className="text-[9px] font-sans font-normal text-slate-500">{currT.currency}</span>
                            </span>

                            {isOutOfStock ? (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                {currT.outOfStock}
                              </span>
                            ) : p.stock <= 3 ? (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {currT.lowStock} ({p.stock})
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {currT.available} ({p.stock})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-white/5 w-full" />

                        {/* Actions */}
                        <div className="flex items-center justify-between bg-white/[0.01] text-[10px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(p);
                              setProductForm({
                                nameAr: p.nameAr, nameKu: p.nameKu, nameEn: p.nameEn,
                                price: p.price, cost: p.cost, stock: p.stock,
                                category: p.category, barcode: p.barcode
                              });
                              setIsEditProductOpen(true);
                            }}
                            className="flex-1 py-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1 font-bold"
                          >
                            <Edit3 size={11} />
                            <span>{lang === "ar" ? "تعديل" : lang === "ku" ? "دەستکاریکردن" : "Edit"}</span>
                          </button>
                          <div className="w-[1px] h-4 bg-white/5" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(p.id);
                            }}
                            className="flex-1 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors flex items-center justify-center gap-1 font-bold"
                          >
                            <Trash2 size={11} />
                            <span>{lang === "ar" ? "حذف" : lang === "ku" ? "سڕینەوە" : "Delete"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: INVENTORY VIEW */}
        {activeTab === "inventory" && (
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-6 pos-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database size={20} className="text-indigo-400" />
                  <span>{currT.inventory}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === "ar" ? "إدارة وتعديل المنتجات ومستويات المخازن" : "Manage retail product catalog and stock levels"}
                </p>
              </div>
              <button
                onClick={() => {
                  setProductForm({ nameAr: "", nameKu: "", nameEn: "", price: 0, cost: 0, stock: 0, category: "coffee", barcode: "" });
                  setIsAddProductOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <Plus size={14} />
                <span>{currT.addProduct}</span>
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0f1423] border border-white/5 rounded-2xl p-4 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "تكلفة المخزون الكلية" : lang === "ku" ? "کۆی تێچووی مەخزەن" : "Total Stock Cost"}</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-1">
                  {products.reduce((sum, p) => sum + (p.cost * p.stock), 0).toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-500">{currT.currency}</span>
                </span>
              </div>
              <div className="bg-[#0f1423] border border-white/5 rounded-2xl p-4 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "القيمة البيعية الكلية" : lang === "ku" ? "کۆی نرخی فرۆشتن" : "Total Retail Value"}</span>
                <span className="text-lg font-black text-teal-400 font-mono mt-1">
                  {products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-500">{currT.currency}</span>
                </span>
              </div>
              <div className="bg-[#0f1423] border border-white/5 rounded-2xl p-4 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "الأرباح المتوقعة" : lang === "ku" ? "قازانجی چاوەڕوانکراو" : "Expected Profit"}</span>
                <span className="text-lg font-black text-indigo-400 font-mono mt-1">
                  {products.reduce((sum, p) => sum + ((p.price - p.cost) * p.stock), 0).toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-500">{currT.currency}</span>
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#0f1423] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300">
                  <thead className="bg-[#141b2f] border-b border-white/5 font-extrabold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 text-center">#</th>
                      <th className={`p-3 ${lang === "ar" || lang === "ku" ? "text-right" : "text-left"}`}>{lang === "ar" ? "الاسم" : lang === "ku" ? "ناو" : "Product Name"}</th>
                      <th className="p-3 text-center">{lang === "ar" ? "الباركود" : lang === "ku" ? "بارکۆد" : "Barcode"}</th>
                      <th className="p-3 text-center">{lang === "ar" ? "الفئة" : lang === "ku" ? "پۆلێن" : "Category"}</th>
                      <th className="p-3 text-center">{currT.stock}</th>
                      <th className="p-3 text-center">{currT.cost}</th>
                      <th className="p-3 text-center">{currT.price}</th>
                      <th className="p-3 text-center">{currT.profit}</th>
                      <th className="p-3 text-center">{currT.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p, idx) => {
                      const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
                      const profit = p.price - p.cost;
                      return (
                        <tr key={p.id} className="hover:bg-white/3 transition-colors">
                          <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                          <td className={`p-3 font-bold text-white ${lang === "ar" || lang === "ku" ? "text-right" : "text-left"}`}>{name}</td>
                          <td className="p-3 text-center font-mono text-slate-400">{p.barcode || "-"}</td>
                          <td className="p-3 text-center">
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] text-slate-300 font-semibold uppercase">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              p.stock <= 2 ? "bg-rose-500/15 text-rose-400" : "bg-slate-800 text-slate-300"
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-amber-300">{p.cost.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono font-bold text-teal-300">{p.price.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono font-bold text-indigo-300">{(profit).toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({
                                    nameAr: p.nameAr, nameKu: p.nameKu, nameEn: p.nameEn,
                                    price: p.price, cost: p.cost, stock: p.stock,
                                    category: p.category, barcode: p.barcode
                                  });
                                  setIsEditProductOpen(true);
                                }}
                                className="p-1.5 bg-[#141b2f] hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SALES CALENDAR VIEW */}
        {activeTab === "calendar" && (
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-6 pos-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon size={20} className="text-teal-400" />
                  <span>{currT.calendar}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === "ar" ? "متابعة المبيعات اليومية والشهرية للمتجر" : lang === "ku" ? "بەدواداچوونی فرۆشی ڕۆژانە و مانگانەی دوکان" : "Monitor daily aggregated revenue calendar statistics"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#141b2f] border border-white/5 px-4 py-2 rounded-xl gap-3">
                  <div className={`flex flex-col ${lang === "ar" || lang === "ku" ? "text-right" : "text-left"}`}>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "مجموع مبيعات الشهر" : lang === "ku" ? "کۆی مبيعاتی مانگ" : "Monthly Total"}</span>
                    <span className="text-base font-black text-teal-400 font-mono mt-0.5">
                      {monthlyTotal.toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-500">{currT.currency}</span>
                    </span>
                  </div>
                  <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
                    <TrendingUp size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Calendar Grid Box */}
              <div className="lg:col-span-2 bg-[#0f1423] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <span className="font-extrabold text-sm text-white font-mono">
                    {lang === "ar" ? "حزيران / يونيو 2028" : lang === "ku" ? "حوزەیران 2028" : "June 2028"}
                  </span>
                  <div className="flex items-center gap-1" dir="ltr">
                    <button className="p-1 text-slate-500 hover:text-white"><ChevronLeft size={16} /></button>
                    <span className="text-[10px] text-slate-500 px-1 font-bold">
                      {lang === "ar" ? "حزيران" : lang === "ku" ? "حوزەیران" : "June"}
                    </span>
                    <button className="p-1 text-slate-500 hover:text-white"><ChevronRight size={16} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {(lang === "ar"
                    ? ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
                    : lang === "ku"
                    ? ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی", "شەممە"]
                    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  ).map(d => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {daysGrid.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="h-16 bg-[#141b2f]/30 border border-transparent rounded-xl" />;
                    }

                    const revenue = getDailyRevenue(day);
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={`day-${day}`}
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className={`h-16 p-2 rounded-xl flex flex-col justify-between border transition-all ${
                          lang === "ar" || lang === "ku" ? "text-right" : "text-left"
                        } ${
                          isSelected
                            ? "bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            : revenue > 0
                            ? "bg-teal-500/5 border-teal-500/25 hover:border-teal-500/60"
                            : "bg-[#141b2f]/70 border-white/5 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-xs font-mono font-bold text-slate-400">{day}</span>
                        {revenue > 0 ? (
                          <span className="text-[10px] font-black text-teal-400 font-mono truncate max-w-full">
                            {Math.round(revenue / 1000)}k
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-700 font-mono">—</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Details Sidebar */}
              <div className="bg-[#0f1423] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2 mb-4">
                    {selectedDay
                      ? `${lang === "ar" ? "تفاصيل اليوم" : lang === "ku" ? "وردەکارییەکانی ڕۆژ" : "Day Details"} - ${lang === "ar" ? "حزيران" : lang === "ku" ? "حوزەیران" : "June"} ${selectedDay}`
                      : lang === "ar" ? "اختر يوماً للتفاصيل" : lang === "ku" ? "ڕۆژێک هەڵبژێرە بۆ وردەکاری" : "Select a Day"}
                  </h3>

                  {selectedDay === null ? (
                    <div className="text-center py-16 text-slate-600 text-xs italic">
                      <CalendarIcon size={24} className="mx-auto mb-2 opacity-30" />
                      <p>{lang === "ar" ? "انقر على أي يوم نشط للاطلاع على فواتير المبيعات" : lang === "ku" ? "کلیک لەسەر هەر ڕۆژێکی چالاک بکە بۆ بینینی پسوڵەکانی فرۆشتن" : "Click any day in calendar to review logs"}</p>
                    </div>
                  ) : (
                    <div data-lenis-prevent className="space-y-3 max-h-[300px] overflow-y-auto pe-1 pos-scrollbar">
                      {sales
                        .filter((s) => {
                          const d = new Date(s.createdAt);
                          return d.getDate() === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                        })
                        .map((sale) => (
                          <div
                            key={sale.id}
                            onClick={() => handlePreviewInvoice(sale)}
                            className="bg-[#141b2f] border border-white/5 hover:border-teal-500/40 p-3 rounded-xl cursor-pointer transition-all flex flex-col gap-1.5"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-bold text-teal-400">#{sale.invoiceNumber}</span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>{lang === "ar" ? "الطريقة" : lang === "ku" ? "ڕێگا" : "Method"}: {sale.paymentMethod === "cash" ? (lang === "ar" ? "نقدي" : lang === "ku" ? "کاش" : "CASH") : (lang === "ar" ? "بطاقة" : lang === "ku" ? "کارت" : "CARD")}</span>
                              <span className="font-bold text-white font-mono">{sale.totalAmount.toLocaleString()} {currT.currency}</span>
                            </div>
                          </div>
                        ))}

                      {sales.filter((s) => {
                        const d = new Date(s.createdAt);
                        return d.getDate() === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                      }).length === 0 && (
                        <div className="text-center py-8 text-slate-600 text-[11px] italic">
                          {lang === "ar" ? "لا توجد عمليات مبيعات في هذا اليوم" : lang === "ku" ? "هیچ فرۆشتنێک لەم ڕۆژەدا تۆمار نەکراوە." : "No transactions recorded."}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: CHAT MESSAGES VIEW */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
            <h1 className="text-xl font-bold text-white border-b border-white/5 pb-4 shrink-0 flex items-center gap-2">
              <MessageSquare size={20} className="text-pink-400" />
              <span>{currT.chatTitle}</span>
            </h1>

            {/* Chats messages box */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto py-4 space-y-4 pe-1 pos-scrollbar min-h-0 flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs italic text-center p-8 space-y-2 select-none">
                  <MessageSquare size={36} className="text-slate-600 opacity-40 animate-pulse" />
                  <span>
                    {lang === "ar"
                      ? "لا توجد رسائل دعم فني نشطة حالياً. اختر سؤالاً جاهزاً للبدء."
                      : lang === "ku"
                      ? "هیچ نامەیەکی پشتیوانی چالاک نییە. پرسیارێک هەڵبژێرە."
                      : "No support messages are active. Choose a quick question to start."}
                  </span>
                </div>
              ) : (
                chatMessages.map((m) => {
                  const isCashier = m.sender === "cashier";
                  return (
                    <div key={m.id} className={`flex flex-col max-w-[85%] ${isCashier ? "self-end items-end" : "self-start items-start"}`}>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                        isCashier
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-[#141b2f] text-slate-200 rounded-bl-none border border-white/5"
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.time}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Reply Buttons */}
            <div className="flex flex-wrap gap-2 mb-3 px-1 shrink-0 border-t border-white/5 pt-3">
              <button
                type="button"
                onClick={() => handleQuickReply("details")}
                className="bg-[#141b2f] hover:bg-[#1d2744] border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {lang === "ar" ? "📋 تفاصيل النظام" : lang === "ku" ? "📋 وردەکارییەکان" : "📋 System Details"}
              </button>
              <button
                type="button"
                onClick={() => handleQuickReply("features")}
                className="bg-[#141b2f] hover:bg-[#1d2744] border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {lang === "ar" ? "✨ مميزات النظام" : lang === "ku" ? "✨ تایبەتمەندییەکان" : "✨ System Features"}
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={sendSupportMsg} className="flex gap-2 shrink-0 border-t border-white/5 pt-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={lang === "ar" ? "اكتب رسالتك للدعم الفني..." : lang === "ku" ? "نامەکەت بنووسە..." : "Type support message..."}
                className="flex-1 bg-[#141a2e] border border-white/5 rounded-xl px-3 py-2.5 text-xs outline-none text-white focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors active:scale-95"
              >
                {lang === "ar" ? "إرسال" : lang === "ku" ? "ناردن" : "Send"}
              </button>
            </form>
          </div>
        )}



        {/* VIEW 6: STORE SETTINGS VIEW */}
        {activeTab === "settings" && (
          <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-6 pos-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings size={20} className="text-indigo-400" />
                  <span>{currT.settings}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === "ar" ? "تعديل إعدادات المتجر والطابعات وأجهزة البث" : lang === "ku" ? "ڕێکخستنی پرۆفایل، پرینتەر، و پەخشی مۆبایل" : "Configure POS profiles, hardware printers and mobile access"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Form profile */}
              <form onSubmit={handleSettingsSubmit} className="bg-[#0f1423] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-4">
                  <Settings size={14} className="text-indigo-400" />
                  <span>{lang === "ar" ? "بيانات المتجر والطابعة" : lang === "ku" ? "زانیاری دوکان و پرینتەر" : "Profile & Printer"}</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">{currT.storeName}</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl text-xs focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">{currT.phone}</label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl text-xs font-mono focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">{lang === "ar" ? "عنوان المتجر" : lang === "ku" ? "ناونیشانی دوکان" : "Store Address"}</label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl text-xs focus:border-indigo-500"
                    />
                  </div>

                  <div className="border-t border-white/5 my-4" />

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">{currT.mockMode}</label>
                    <select
                      value={mockHardware}
                      onChange={(e) => setMockHardware(e.target.value)}
                      className="bg-[#141a2e] border border-white/5 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer focus:border-indigo-500"
                    >
                      <option value="true">{lang === "ar" ? "نعم (محاكاة وحفظ كملف نصي)" : lang === "ku" ? "بەڵێ (سیمیولەیشن - پاشەکەوتکردن وەک دەق)" : "Yes (Mock - Save receipt as text)"}</option>
                      <option value="false">{lang === "ar" ? "لا (طابعة فعلية ESC/POS)" : lang === "ku" ? "نەخێر (پەیوەندیکردن بە پرینتەری ESC/POS)" : "No (Connect to physical ESC/POS)"}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">{currT.printerIp}</label>
                    <input
                      type="text"
                      value={printerIP}
                      onChange={(e) => setPrinterIP(e.target.value)}
                      className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl text-xs font-mono focus:border-indigo-500"
                      placeholder="192.168.1.100"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                  >
                    {currT.save}
                  </button>
                </div>
              </form>

              {/* Mobile Access Broadcaster */}
              <div className="bg-[#0f1423] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone size={14} className="text-pink-400" />
                      <span>{currT.broadcast}</span>
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                      tunnelRunning
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {tunnelRunning ? currT.statusActive : currT.statusStopped}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-400">{lang === "ar" ? "تفعيل البث" : lang === "ku" ? "چالاککردنی پەخش" : "Enable Broadcast"}</label>
                      <select
                        value={tunnelEnabled}
                        onChange={(e) => {
                          setTunnelEnabled(e.target.value);
                          setTunnelRunning(e.target.value === "true");
                        }}
                        className="bg-[#141a2e] border border-white/5 text-slate-300 px-3 py-2 rounded-xl text-xs cursor-pointer focus:border-indigo-500"
                      >
                        <option value="true">{lang === "ar" ? "مفعل" : lang === "ku" ? "چالاککراو" : "Enabled"}</option>
                        <option value="false">{lang === "ar" ? "معطل" : lang === "ku" ? "ناچالاککراو" : "Disabled"}</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-400">{lang === "ar" ? "منفذ التحكم" : lang === "ku" ? "پۆرتی بەڕێوەبردن" : "Manager Port"}</label>
                      <input
                        type="text"
                        value={tunnelPort}
                        onChange={(e) => setTunnelPort(e.target.value)}
                        className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl text-xs font-mono focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {tunnelRunning && (
                    <div className="bg-[#141a2e] border border-white/5 p-3 rounded-xl space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === "ar" ? "رابط الانستغرام" : lang === "ku" ? "لینکی ئینستاگرام" : "Instagram Link"}</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value="https://instagram.com/kodify.co"
                            className="flex-1 bg-transparent text-indigo-400 font-mono text-[11px] focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText("https://instagram.com/kodify.co");
                              alert(currT.copied);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-xl self-center max-w-[170px] mx-auto shadow-lg border border-slate-200">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://instagram.com/kodify.co")}`}
                          alt="Instagram QR Code"
                          width={120}
                          height={120}
                          className="rounded"
                        />
                        <span className="text-[#080b13] text-[9px] font-black mt-1.5 tracking-wider uppercase">{currT.scanQr}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setTunnelRunning(!tunnelRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      tunnelRunning
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
                    }`}
                  >
                    {tunnelRunning ? currT.stopBroadcast : currT.startBroadcast}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 3. CART OVERLAY DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-30"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: lang === "ar" || lang === "ku" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" || lang === "ku" ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className={`absolute top-0 bottom-0 w-80 sm:w-[380px] bg-[#0e1322] p-4 flex flex-col justify-between z-40 ${
                lang === "ar" || lang === "ku" ? "left-0 border-r border-white/5" : "right-0 border-l border-white/5"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[#141a2e] text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-500/20 font-mono">
                      {totalItemCount}
                    </span>
                    <span className="text-sm font-black text-white">{lang === "ar" ? "سلة المبيعات" : lang === "ku" ? "سەبەتەی فرۆشتن" : "Sales Cart"}</span>
                  </div>
                </div>

                {/* Items list */}
                <div data-lenis-prevent className="py-4 space-y-3 max-h-[380px] overflow-y-auto pe-1 pos-scrollbar">
                  {cart.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-2 text-center text-xs">
                      <ShoppingBag size={28} className="opacity-30" />
                      <p className="font-bold text-white">{currT.cartEmpty}</p>
                      <p>{currT.noItemsYet}</p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const name = lang === "ar" ? item.nameAr : lang === "ku" ? item.nameKu : item.nameEn;
                      return (
                        <div
                          key={item.id}
                          className="bg-[#141a2e] border border-white/5 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-500 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                            <span className="text-xs font-black text-white font-mono">
                              {item.price.toLocaleString()} {currT.currency}
                            </span>
                          </div>

                          <div className={lang === "ar" || lang === "ku" ? "text-right" : "text-left"}>
                            <span className="text-xs font-bold text-white leading-tight block">{name}</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{item.barcode}</span>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-white/[0.03]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-5.5 h-5.5 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white flex items-center justify-center text-xs transition-all"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-xs font-mono font-bold text-white w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-5.5 h-5.5 rounded-full border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white flex items-center justify-center text-xs transition-all"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <span className="text-xs font-black text-emerald-400 font-mono">
                              {(item.price * item.quantity).toLocaleString()} <span className="text-[9px] font-sans font-normal text-slate-500">{currT.currency}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Drawer footer calculations & checkouts */}
              <div className="border-t border-white/5 pt-4 bg-[#0e1322]">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setCart([])}
                    disabled={cart.length === 0}
                    className="flex-1 py-2 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {currT.clearCart}
                  </button>
                  <button
                    onClick={() => {
                      setDiscountInput(globalDiscount.toString());
                      setDiscountTypeInput(globalDiscountType);
                      setIsDiscountModalOpen(true);
                    }}
                    disabled={cart.length === 0}
                    className="flex-1 py-2 rounded-xl bg-[#141a2e] border border-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {currT.discount} {globalDiscount > 0 ? `(${globalDiscount}${globalDiscountType === "percent" ? "%" : " IQD"})` : ""}
                  </button>
                </div>

                <div className="bg-[#141a2e] border border-white/5 rounded-2xl p-4 space-y-2.5 mb-4 shadow-inner">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{currT.subtotal}:</span>
                    <span className="font-mono font-bold text-white">{subtotal.toLocaleString()} {currT.currency}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-[10px] text-rose-400">
                      <span>{currT.discount}:</span>
                      <span className="font-mono font-bold">-{discountAmount.toLocaleString()} {currT.currency}</span>
                    </div>
                  )}
                  <div className="border-t border-white/5 pt-2 flex justify-between items-baseline">
                    <span className="text-slate-300 font-bold text-xs">{currT.total}:</span>
                    <span className="text-emerald-400 text-xl font-black font-mono tracking-tight">
                      {grandTotal.toLocaleString()} <span className="text-[9px] font-sans font-normal text-slate-500">{currT.currency}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPaymentMethod("cash");
                    setCashReceived(grandTotal);
                    setIsCheckoutOpen(true);
                  }}
                  disabled={cart.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#141a2e] disabled:text-slate-600 disabled:border-transparent text-white font-extrabold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} />
                  <span>{currT.checkout}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. DIALOG MODAL: MOCK CHECKOUT PAYMENT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[#0f1423] border border-white/5 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-xs">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141b2f]">
              <span className="font-black text-sm text-white">{lang === "ar" ? "تفاصيل الدفع والمحاسبة" : lang === "ku" ? "وردەکارییەکانی پارەدان" : "Payment Details"}</span>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-slate-400">{lang === "ar" ? "طريقة الدفع" : lang === "ku" ? "ڕێگای پارەدان" : "Payment Method"}</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => { setPaymentMethod("cash"); setCashReceived(grandTotal); }}
                    className={`py-2 rounded-xl font-bold border flex items-center justify-center gap-1 transition-all ${
                      paymentMethod === "cash"
                        ? "bg-indigo-500/10 border-indigo-500 text-white"
                        : "bg-[#141a2e] border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>💵</span>
                    <span>{lang === "ar" ? "نقدي" : lang === "ku" ? "کاش" : "Cash"}</span>
                  </button>
                  <button
                    onClick={() => { setPaymentMethod("card"); setCashReceived(grandTotal); }}
                    className={`py-2 rounded-xl font-bold border flex items-center justify-center gap-1 transition-all ${
                      paymentMethod === "card"
                        ? "bg-indigo-500/10 border-indigo-500 text-white"
                        : "bg-[#141a2e] border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>💳</span>
                    <span>{lang === "ar" ? "بطاقة" : lang === "ku" ? "کارت" : "Card"}</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-400">{lang === "ar" ? "المبلغ المستلم" : lang === "ku" ? "بڕی وەرگیراو" : "Cash Received"}</label>
                  <input
                    type="number"
                    value={cashReceived || ""}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    className="w-full bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono text-xs focus:border-indigo-500"
                  />
                  <div className="flex justify-between items-center mt-2 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400">{lang === "ar" ? "المتبقي للعميل (الباقي)" : lang === "ku" ? "بڕی ماوە (باقي)" : "Change Due"}:</span>
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {Math.max(0, cashReceived - grandTotal).toLocaleString()} {currT.currency}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                >
                  {lang === "ar" ? "تأكيد الدفع وطباعة الفاتورة" : lang === "ku" ? "تەئکیدکردنەوە و چاپکردنی پسوڵە" : "Confirm & Print Receipt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DIALOG MODAL: GENERAL DISCOUNT MODAL */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[#0f1423] border border-white/5 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col text-xs">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141b2f]">
              <span className="font-black text-xs text-white">{lang === "ar" ? "إضافة خصم عام للمبيعات" : lang === "ku" ? "داشکاندنی گشتی جێبەجێ بکە" : "Apply General Discount"}</span>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-[#141a2e] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setDiscountTypeInput("percent")}
                  className={`py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                    discountTypeInput === "percent" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {lang === "ar" ? "نسبة مئوية (%)" : lang === "ku" ? "ڕێژەیی (%)" : "Percentage (%)"}
                </button>
                <button
                  onClick={() => setDiscountTypeInput("flat")}
                  className={`py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                    discountTypeInput === "flat" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {lang === "ar" ? "مبلغ ثابت (د.ع)" : lang === "ku" ? "بڕی جێگیر (د.ع)" : "Flat (IQD)"}
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{lang === "ar" ? "قيمة الخصم" : lang === "ku" ? "بڕی داشکاندن" : "Discount Value"}</label>
                <input
                  type="number"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-full bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono text-xs focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setGlobalDiscount(0);
                    setIsDiscountModalOpen(false);
                  }}
                  className="flex-1 py-2 border border-white/5 hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl"
                >
                  {lang === "ar" ? "إزالة" : lang === "ku" ? "سڕینەوە" : "Remove"}
                </button>
                <button
                  onClick={() => {
                    setGlobalDiscount(Number(discountInput));
                    setGlobalDiscountType(discountTypeInput);
                    setIsDiscountModalOpen(false);
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                >
                  {lang === "ar" ? "تطبيق الخصم" : lang === "ku" ? "داشکاندن جێبەجێ بکە" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DIALOG MODAL: RECEIPT PREVIEW (CHECKOUT SUCCESS) */}
      {checkoutSuccess && lastInvoice && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center"
          >
            {/* Checked check circles */}
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 animate-bounce">
              <CheckCircle size={24} className="stroke-[2.5]" />
            </div>

            <h3 className="text-base font-black mb-0.5">{lang === "ar" ? "تم الدفع وإنهاء العملية!" : lang === "ku" ? "پارەدانەکە سەرکەوتوو بوو!" : "Payment Successful!"}</h3>
            <span className="text-[10px] text-slate-400 font-mono mb-4">REC-{lastInvoice.invoiceNumber}</span>

            {/* Thermal receipt template */}
            <div className="w-full border-t border-b border-dashed border-slate-200 py-3 mb-4 font-mono text-[10px] flex flex-col gap-1.5">
              <div className="text-center font-bold text-xs uppercase mb-2 tracking-wide font-sans">
                {storeName}
              </div>
              <div className="text-center text-[8px] text-slate-400 mb-2 font-sans">
                {storeAddress} | {lang === "ar" ? "الهاتف" : lang === "ku" ? "تەلەفۆن" : "Phone"}: {storePhone}
              </div>

              <div className="flex justify-between font-bold text-slate-500 border-b border-slate-100 pb-1 mb-1 font-sans">
                <span>{lang === "ar" ? "المادة" : lang === "ku" ? "کاڵا" : "Item"}</span>
                <span>{lang === "ar" ? "المجموع" : lang === "ku" ? "کۆ" : "Total"}</span>
              </div>

              {lastInvoice.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-slate-700">
                  <span>{item.name} x{item.qty}</span>
                  <span>{(item.total).toLocaleString()} {currT.currency}</span>
                </div>
              ))}

              <div className="h-[1px] bg-slate-100 my-1" />

              <div className="flex justify-between font-black text-slate-900 pt-1 text-xs font-sans">
                <span>{lang === "ar" ? "المجموع النهائي" : lang === "ku" ? "کۆی گشتی" : "Grand Total"}</span>
                <span>{lastInvoice.totalAmount.toLocaleString()} {currT.currency}</span>
              </div>

              <div className="mt-3 text-[8px] text-slate-400 text-center uppercase tracking-widest font-sans">
                {lang === "ar" ? "الدفع" : lang === "ku" ? "پارەدان" : "Payment"}: {lastInvoice.paymentMethod.toUpperCase()} | {lang === "ar" ? "جهاز" : lang === "ku" ? "ئامێر" : "Terminal"}: #01
              </div>
            </div>

            {/* Mock thermal barcode */}
            <div className="w-40 h-8 bg-barcode opacity-70 mb-5" />

            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setLastInvoice(null);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
            >
              {lang === "ar" ? "طلب جديد" : lang === "ku" ? "داواکاری نوێ" : "New Order"}
            </button>
          </motion.div>
        </div>
      )}

      {/* 7. DIALOG MODAL: RECEIPT PREVIEW (CALENDAR LOGS INSPECT) */}
      {lastInvoice && !checkoutSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100 mb-3 text-xs">
              <span className="font-bold">{lang === "ar" ? "معاينة الفاتورة" : lang === "ku" ? "معاینەکردنی پسوڵە" : "Receipt Preview"}</span>
              <button onClick={() => setLastInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Thermal receipt template */}
            <div className="w-full border-b border-dashed border-slate-200 pb-3 mb-4 font-mono text-[10px] flex flex-col gap-1.5">
              <div className="text-center font-bold text-xs uppercase mb-1 tracking-wide font-sans">
                {storeName}
              </div>
              <div className="text-center text-[8px] text-slate-400 mb-2 font-sans">
                {storeAddress} | {lang === "ar" ? "الهاتف" : lang === "ku" ? "تەلەفۆن" : "Phone"}: {storePhone}
              </div>
              <div className="text-center text-[8px] text-slate-400 mb-2 font-sans">
                {lang === "ar" ? "رقم الفاتورة" : lang === "ku" ? "ژمارەی پسوڵە" : "Invoice No"}: REC-{lastInvoice.invoiceNumber}
              </div>

              <div className="flex justify-between font-bold text-slate-500 border-b border-slate-100 pb-1 mb-1 font-sans">
                <span>{lang === "ar" ? "المادة" : lang === "ku" ? "کاڵا" : "Item"}</span>
                <span>{lang === "ar" ? "المجموع" : lang === "ku" ? "کۆ" : "Total"}</span>
              </div>

              {lastInvoice.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-slate-700">
                  <span>{item.name} x{item.qty}</span>
                  <span>{(item.total).toLocaleString()} {currT.currency}</span>
                </div>
              ))}

              <div className="h-[1px] bg-slate-100 my-1" />

              <div className="flex justify-between font-black text-slate-900 pt-1 text-xs font-sans">
                <span>{lang === "ar" ? "المجموع النهائي" : lang === "ku" ? "کۆی گشتی" : "Grand Total"}</span>
                <span>{lastInvoice.totalAmount.toLocaleString()} {currT.currency}</span>
              </div>

              <div className="mt-3 text-[8px] text-slate-400 text-center uppercase tracking-widest font-sans">
                {lang === "ar" ? "الدفع" : lang === "ku" ? "پارەدان" : "Payment"}: {lastInvoice.paymentMethod.toUpperCase()} | {lang === "ar" ? "جهاز" : lang === "ku" ? "ئامێر" : "Terminal"}: #01
              </div>
            </div>

            <div className="w-40 h-8 bg-barcode opacity-70 mb-5" />

            <button
              onClick={() => setLastInvoice(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
            >
              {lang === "ar" ? "إغلاق" : lang === "ku" ? "داخستن" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* 8. DIALOG MODAL: INVENTORY ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-[#0f1423] border border-white/5 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-xs">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141b2f]">
              <span className="font-black text-xs text-white">{currT.addProduct}</span>
              <button type="button" onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الاسم (عربي)" : lang === "ku" ? "ناو (عەرەبی)" : "Name (Arabic)"}</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameAr}
                    onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الاسم (إنجليزي)" : lang === "ku" ? "ناو (ئینگلیزی)" : "Name (English)"}</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameEn}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "سعر البيع (د.ع)" : lang === "ku" ? "نرخی فرۆشتن (د.ع)" : "Retail Price (IQD)"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "سعر الكلفة (د.ع)" : lang === "ku" ? "نرخی کڕین (د.ع)" : "Cost Price (IQD)"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.cost || ""}
                    onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "كمية المخزون" : lang === "ku" ? "بڕی مەخزەن" : "Stock Count"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock || ""}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الفئة" : lang === "ku" ? "پۆلێن" : "Category"}</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-slate-300 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <option value="coffee">{lang === "ar" ? "قهوة" : lang === "ku" ? "قاوە" : "Coffee"}</option>
                    <option value="bakery">{lang === "ar" ? "مخبوزات" : lang === "ku" ? "شیرینی" : "Bakery"}</option>
                    <option value="drinks">{lang === "ar" ? "مشروبات" : lang === "ku" ? "خواردنەوە" : "Drinks"}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{lang === "ar" ? "الباركود / رمز SKU" : lang === "ku" ? "بارکۆد / SKU" : "Barcode / SKU"}</label>
                <input
                  type="text"
                  required
                  value={productForm.barcode}
                  onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                  className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white font-bold rounded-xl transition-all"
                >
                  {lang === "ar" ? "إنشاء منتج" : lang === "ku" ? "دروستکردنی کاڵا" : "Create Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 9. DIALOG MODAL: INVENTORY EDIT PRODUCT */}
      {isEditProductOpen && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <form onSubmit={handleEditProduct} className="bg-[#0f1423] border border-white/5 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-xs">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141b2f]">
              <span className="font-black text-xs text-white">{lang === "ar" ? "تعديل المنتج" : lang === "ku" ? "دەستکاریکردنی کاڵا" : "Edit Product"}</span>
              <button type="button" onClick={() => { setIsEditProductOpen(false); setEditingProduct(null); }} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الاسم (عربي)" : lang === "ku" ? "ناو (عەرەبی)" : "Name (Arabic)"}</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameAr}
                    onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الاسم (إنجليزي)" : lang === "ku" ? "ناو (ئینگلیزی)" : "Name (English)"}</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameEn}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "سعر البيع (د.ع)" : lang === "ku" ? "نرخی فرۆشتن (د.ع)" : "Retail Price (IQD)"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "سعر الكلفة (د.ع)" : lang === "ku" ? "نرخی کڕین (د.ع)" : "Cost Price (IQD)"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.cost || ""}
                    onChange={(e) => setProductForm({ ...productForm, cost: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "كمية المخزون" : lang === "ku" ? "بڕی مەخزەن" : "Stock Count"}</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock || ""}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-400">{lang === "ar" ? "الفئة" : lang === "ku" ? "پۆلێن" : "Category"}</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="bg-[#141a2e] border border-white/5 text-slate-300 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <option value="coffee">{lang === "ar" ? "قهوة" : lang === "ku" ? "قاوە" : "Coffee"}</option>
                    <option value="bakery">{lang === "ar" ? "مخبوزات" : lang === "ku" ? "شیرینی" : "Bakery"}</option>
                    <option value="drinks">{lang === "ar" ? "مشروبات" : lang === "ku" ? "خواردنەوە" : "Drinks"}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-400">{lang === "ar" ? "الباركود / رمز SKU" : lang === "ku" ? "بارکۆد / SKU" : "Barcode / SKU"}</label>
                <input
                  type="text"
                  required
                  value={productForm.barcode}
                  onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                  className="bg-[#141a2e] border border-white/5 text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white font-bold rounded-xl transition-all"
                >
                  {lang === "ar" ? "حفظ التغييرات" : lang === "ku" ? "پاشەکەوتکردنی گۆڕانکارییەکان" : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Styled barcode component utility */}
      <style>{`
        .bg-barcode {
          background-image: repeating-linear-gradient(90deg, #1e293b, #1e293b 2px, transparent 2px, transparent 6px),
                            repeating-linear-gradient(90deg, #1e293b, #1e293b 4px, transparent 4px, transparent 8px);
          background-size: 100% 100%;
        }
      `}</style>
    </div>
  );
}

function CloudEmulator() {
  const { lang } = useApp();
  return (
    <div className="w-full h-full bg-[#0a0a0a] text-emerald-400 font-mono text-xs sm:text-sm p-4 overflow-hidden flex flex-col">
      <div className="mb-4">
        <span className="text-sky-400">root@kodify-cloud</span>:<span className="text-blue-400">~/server</span>$ ./status
        --watch
      </div>
      <div data-lenis-prevent className="flex-1 overflow-y-auto pos-scrollbar">
        <div className="flex flex-col gap-1 opacity-80">
          <div className="flex justify-between border-b border-emerald-900/50 pb-1 mb-2 text-[10px] sm:text-xs text-emerald-600">
            <span className="w-24 sm:w-32">{lang === "ar" ? "الخدمة" : lang === "ku" ? "خزمەتگوزاری" : "SERVICE"}</span>
            <span className="w-12 sm:w-16">{lang === "ar" ? "الحالة" : lang === "ku" ? "دۆخ" : "STATUS"}</span>
            <span className="w-12 sm:w-16">{lang === "ar" ? "المعالج" : lang === "ku" ? "پرۆسێسەر" : "CPU"}</span>
            <span>{lang === "ar" ? "الذاكرة" : lang === "ku" ? "مێمۆری" : "MEM"}</span>
          </div>
          {["api-gateway", "auth-service", "db-primary", "cache-redis", "worker-queue"].map((s) => (
            <div key={s} className="flex justify-between">
              <span className="w-24 sm:w-32 truncate pr-2">{s}</span>
              <span className="w-12 sm:w-16 text-emerald-500">[OK]</span>
              <span className="w-12 sm:w-16">
                {Math.floor(Math.random() * 20)}.{Math.floor(Math.random() * 9)}%
              </span>
              <span>{Math.floor(Math.random() * 500)}MB</span>
            </div>
          ))}
          <br />
          <div>{lang === "ar" ? "حمل النظام" : lang === "ku" ? "بارگرانی سیستەم" : "System Load"}: 1.04 1.12 1.08</div>
          <div>{lang === "ar" ? "مدة التشغيل" : lang === "ku" ? "کاتی کارکردن" : "Uptime"}: {lang === "ar" ? "45 يوم، 12 ساعة، 23 دقيقة" : lang === "ku" ? "45 ڕۆژ، 12 کاتژمێر، 23 خولەک" : "45 days, 12 hours, 23 mins"}</div>
          <br />
          <div className="animate-pulse">{lang === "ar" ? "جاري مراقبة السجلات النشطة..." : lang === "ku" ? "چاودێریکردنی لۆگە چالاکەکان..." : "Monitoring active logs..."}</div>
        </div>
      </div>
    </div>
  );
}

function SecurityEmulator() {
  const { lang } = useApp();
  return (
    <div className="w-full h-full bg-slate-950 text-sky-400 font-mono text-xs sm:text-sm p-6 overflow-hidden flex flex-col relative items-center justify-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 0, #020617 100%), repeating-radial-gradient(circle at center, transparent, transparent 40px, rgba(56, 189, 248, 0.2) 41px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-sky-500/50 flex items-center justify-center relative mb-6 sm:mb-8">
          <div
            className="absolute inset-0 rounded-full border border-sky-400/20 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <ShieldCheck className="text-sky-400 w-10 h-10 sm:w-12 sm:h-12" />
          <div
            className="absolute top-1/2 left-1/2 w-12 sm:w-16 h-[2px] bg-sky-400 origin-left animate-spin"
            style={{ animationDuration: "4s", animationTimingFunction: "linear" }}
          />
        </div>

        <div className="text-center">
          <div className="text-lg sm:text-xl font-black text-white mb-2 tracking-widest text-center">
            {lang === "ar" ? "الشبكة آمنة" : lang === "ku" ? "تۆڕەکە پارێزراوە" : "NETWORK SECURE"}
          </div>
          <div className="text-sky-500/60 mb-1 text-center">
            {lang === "ar" ? "0 تهديدات مكتشفة" : lang === "ku" ? "0 هەڕەشە دۆزرایەوە" : "0 Threats Detected"}
          </div>
          <div className="text-sky-500/60 text-center">
            {lang === "ar" ? "جدار الحماية: نشط | التشفير: AES-256" : lang === "ku" ? "دیواری ئاگرین: چالاک | کۆدکردن: AES-256" : "Firewall: ACTIVE | Encryption: AES-256"}
          </div>
        </div>
      </div>
    </div>
  );
}
