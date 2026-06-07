"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "@/app/providers";
import {
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  Plus,
  Minus,
  Trash2,
  Edit,
  Check,
  Layers,
  Eye,
  ShoppingCart,
  TrendingUp,
  User,
  MapPin,
  CreditCard,
  CheckCircle,
  Database,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  X
} from "lucide-react";

type Lang = "ar" | "en" | "ku";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    nameAr: "لوحة مفاتيح ميكانيكية مضيئة RGB",
    nameKu: "تەختەکلیلی میکانیکی ڕووناککەرەوەی RGB",
    nameEn: "RGB Mechanical Keyboard Pro",
    price: 129,
    stock: 12,
    category: "accessories",
    img: "⌨️",
    salesCount: 15
  },
  {
    id: 2,
    nameAr: "ماوس الألعاب اللاسلكي السريع",
    nameKu: "ماوسی یاری بێتەل",
    nameEn: "Ultra-Fast Wireless Gaming Mouse",
    price: 79,
    stock: 18,
    category: "accessories",
    img: "🖱️",
    salesCount: 22
  },
  {
    id: 3,
    nameAr: "شاشة منحنية 34 بوصة 144 هرتز",
    nameKu: "شاشەی چەماوەی ٣٤ ئینچ ١٤٤ هێرتز",
    nameEn: "34\" Curved Gaming Monitor 144Hz",
    price: 499,
    stock: 5,
    category: "electronics",
    img: "🖥️",
    salesCount: 4
  },
  {
    id: 4,
    nameAr: "سماعة الرأس المحيطية اللاسلكية",
    nameKu: "سەماعەی بێتەلی دەنگی دەوروبەر",
    nameEn: "Wireless Spatial Audio Headset",
    price: 189,
    stock: 8,
    category: "electronics",
    img: "🎧",
    salesCount: 10
  },
  {
    id: 5,
    nameAr: "حقيبة الظهر التقنية المقاومة للماء",
    nameKu: "جانتاکۆڵی تەکنەلۆژی دژە ئاو",
    nameEn: "Waterproof Tech Backpack",
    price: 95,
    stock: 25,
    category: "gear",
    img: "🎒",
    salesCount: 30
  },
  {
    id: 6,
    nameAr: "حامل كمبيوتر محمول معدني قابل للتعديل",
    nameKu: "حاملی لاپتۆپی کانزایی",
    nameEn: "Adjustable Aluminum Laptop Stand",
    price: 39,
    stock: 35,
    category: "gear",
    img: "💻",
    salesCount: 42
  }
];

const INITIAL_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "10042",
    customerName: "أحمد علي",
    address: "أربيل، شارع 100",
    items: [{ productId: 2, name: "Ultra-Fast Wireless Gaming Mouse", qty: 1, price: 79 }],
    subtotal: 79,
    total: 82.95,
    status: "delivered",
    date: "2026-06-05T14:30:00.000Z"
  },
  {
    id: "ord-2",
    orderNumber: "10043",
    customerName: "کاردۆ شوان",
    address: "سلیمانی، تووی مەلیک",
    items: [
      { productId: 1, name: "RGB Mechanical Keyboard Pro", qty: 1, price: 129 },
      { productId: 6, name: "Adjustable Aluminum Laptop Stand", qty: 2, price: 39 }
    ],
    subtotal: 207,
    total: 217.35,
    status: "shipped",
    date: "2026-06-06T09:15:00.000Z"
  }
];

const dict = {
  ar: {
    storeName: "متجر كوديفاي التقني",
    storeUrl: "kodify-store.com",
    visitStore: "زيارة المتجر",
    adminDashboard: "لوحة التحكم",
    connectedDb: "متصل بقاعدة البيانات",
    heroTitle: "أدوات المطورين الاحترافية",
    heroDesc: "ارتقِ بإنتاجيتك ومساحة عملك مع أحدث الأجهزة والملحقات التقنية المصممة خصيصاً للمبرمجين والمصممين.",
    shopNow: "تسوق الآن",
    all: "الكل",
    electronics: "إلكترونيات",
    accessories: "ملحقات",
    gear: "أدوات ومعدات",
    addToCart: "إضافة إلى السلة",
    outOfStock: "نفذت الكمية",
    itemsLeft: "قطع متبقية",
    cartTitle: "سلة التسوق",
    subtotal: "المجموع الفرعي",
    tax: "الضريبة والخدمة",
    total: "المجموع النهائي",
    checkout: "إتمام الشراء",
    checkoutTitle: "تفاصيل الدفع والتوصيل",
    fullName: "الاسم الكامل",
    address: "العنوان ورقم الهاتف",
    paymentMethod: "طريقة الدفع",
    cod: "الدفع عند الاستلام",
    card: "بطاقة ائتمان (تجريبي)",
    placeOrder: "تأكيد الطلب وشحن المنتجات",
    orderSuccess: "تم تسجيل طلبك بنجاح!",
    orderSuccessDesc: "تم إرسال الطلب فوراً إلى لوحة التحكم الإدارية لتأكيد الشحن ودفع الفواتير.",
    continueShopping: "مواصلة التسوق",
    overview: "نظرة عامة",
    products: "المنتجات",
    orders: "الطلبات",
    totalRevenue: "إجمالي المبيعات",
    activeOrders: "الطلبات النشطة",
    totalProducts: "إجمالي المنتجات",
    lowStockAlertText: "تنبيه المخزون المنخفض",
    revenueChart: "رسم بياني للمبيعات",
    orderDistribution: "توزيع حالة الطلبات",
    addNewProduct: "إضافة منتج جديد",
    productNameAr: "الاسم بالعربية",
    productNameKu: "الاسم بالكردية",
    productNameEn: "الاسم بالإنجليزية",
    price: "السعر ($)",
    stock: "الكمية في المخزن",
    category: "الفئة",
    saveProduct: "حفظ المنتج",
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    status: "الحالة",
    pending: "قيد الانتظار",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    customer: "العميل",
    date: "التاريخ",
    orderDetails: "تفاصيل الطلب",
    searchPlaceholder: "ابحث عن منتج...",
    cartEmpty: "سلتك فارغة تماماً",
    viewDetails: "عرض التفاصيل",
    productAr: "الاسم (عربي)",
    productKu: "الاسم (كردي)",
    productEn: "الاسم (إنجليزي)"
  },
  en: {
    storeName: "Kodify Tech Store",
    storeUrl: "kodify-store.com",
    visitStore: "Visit Store",
    adminDashboard: "Admin Dashboard",
    connectedDb: "Live Database Sync",
    heroTitle: "Premium Developer Gear",
    heroDesc: "Elevate your productivity and workspace with the latest gadgets and accessories designed for developers and creators.",
    shopNow: "Shop Now",
    all: "All",
    electronics: "Electronics",
    accessories: "Accessories",
    gear: "Gear & Tools",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    itemsLeft: "items left",
    cartTitle: "Shopping Cart",
    subtotal: "Subtotal",
    tax: "Tax & Service (5%)",
    total: "Total",
    checkout: "Checkout",
    checkoutTitle: "Checkout & Shipping Details",
    fullName: "Full Name",
    address: "Address & Phone Number",
    paymentMethod: "Payment Method",
    cod: "Cash on Delivery",
    card: "Credit Card (Demo)",
    placeOrder: "Confirm Order & Ship",
    orderSuccess: "Order Placed Successfully!",
    orderSuccessDesc: "Your order has been sent to the Admin Dashboard in real-time for shipping and processing.",
    continueShopping: "Continue Shopping",
    overview: "Overview",
    products: "Products",
    orders: "Orders",
    totalRevenue: "Total Revenue",
    activeOrders: "Active Orders",
    totalProducts: "Total Products",
    lowStockAlertText: "Low Stock Alert",
    revenueChart: "Sales Analytics",
    orderDistribution: "Order Statuses",
    addNewProduct: "Add New Product",
    productNameAr: "Arabic Name",
    productNameKu: "Kurdish Name",
    productNameEn: "English Name",
    price: "Price ($)",
    stock: "Stock Qty",
    category: "Category",
    saveProduct: "Save Product",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    status: "Status",
    pending: "Pending",
    shipped: "Shipped",
    delivered: "Delivered",
    customer: "Customer",
    date: "Date",
    orderDetails: "Order Details",
    searchPlaceholder: "Search for a product...",
    cartEmpty: "Your cart is empty",
    viewDetails: "View Details",
    productAr: "Name (Arabic)",
    productKu: "Name (Kurdish)",
    productEn: "Name (English)"
  },
  ku: {
    storeName: "فرۆشگای تەکنەلۆژی کۆدیفای",
    storeUrl: "kodify-store.com",
    visitStore: "سەردانی فرۆشگا",
    adminDashboard: "کۆنترۆڵی سەرەکی",
    connectedDb: "پەیوەستە بە داتابەیس",
    heroTitle: "ئامرازە پێشکەوتووەکانی گەشەپێدەران",
    heroDesc: "بەرهەمداری کارەکانت بەرز بکەرەوە بە باشترین و نوێترین ئامێر و مەلەحاتی تەکنیکی کە بۆ گەشەپێدەران دیزاین کراون.",
    shopNow: "ئێستا بکڕە",
    all: "سەرجەم",
    electronics: "ئامێرەکان",
    accessories: "پێداویستییەکان",
    gear: "کەلوپەل و ئامرازەکان",
    addToCart: "خستنە ناو سەبەتە",
    outOfStock: "کۆتا بووە",
    itemsLeft: "دانە ماوە",
    cartTitle: "سەبەتەی کڕین",
    subtotal: "کۆتایی بەشەکی",
    tax: "باج و خزمەتگوزاری (٥٪)",
    total: "کۆی گشتی",
    checkout: "تەواوکردنی کڕین",
    checkoutTitle: "زانیاری ناردن و شێوازی پارەدان",
    fullName: "ناوی تەواو",
    address: "ناونیشان و ژمارەی تەلەفۆن",
    paymentMethod: "شێوازی پارەدان",
    cod: "پارەدان لە کاتی وەرگرتن (COD)",
    card: "کارتی بانکی (تاقیکردنەوە)",
    placeOrder: "تەواوکردنی کڕین و ناردن",
    orderSuccess: "کڕینەکە بەسەرکەوتوویی تۆمارکرا!",
    orderSuccessDesc: "داواکارییەکەت لە هەمان ساتدا ڕەوانەی بەشی بەڕێوەبردن کرا بۆ ناردن و پرۆسەکردن.",
    continueShopping: "بەردەوامبوون لە کڕین",
    overview: "بەسەرکردنەوە",
    products: "بەرهەمەکان",
    orders: "داواکارییەکان",
    totalRevenue: "کۆی گشتی فرۆش",
    activeOrders: "داواکارییە چالاکەکان",
    totalProducts: "کۆی بەرهەمەکان",
    lowStockAlertText: "تنبێهی کۆگای کەمماوە",
    revenueChart: "شیکاری فرۆشتن",
    orderDistribution: "دۆخی داواکارییەکان",
    addNewProduct: "زیادکردنی بەرهەمی نوێ",
    productNameAr: "ناوی عەرەبی",
    productNameKu: "ناوی کوردی",
    productNameEn: "ناوی ئینگلیزی",
    price: "نرخ ($)",
    stock: "بڕ لە کۆگا",
    category: "هاوپۆل",
    saveProduct: "پاشەکەوتکردن",
    actions: "کردارەکان",
    edit: "تعديل",
    delete: "سڕینەوە",
    status: "دۆخ",
    pending: "چاوەڕوانکراو",
    shipped: "نێردراوە",
    delivered: "گەیشتووە",
    customer: "کڕیار",
    date: "بەروار",
    orderDetails: "وردەکاری داواکاری",
    searchPlaceholder: "بگەڕێ بۆ بەرهەم...",
    cartEmpty: "سەبەتەکەت بەتاڵە",
    viewDetails: "بینینی وردەکاری",
    productAr: "ناو (عەرەبی)",
    productKu: "ناو (کوردی)",
    productEn: "ناو (ئینگلیزی)"
  }
};

export default function StoreAndDashboardEmulator() {
  const { lang } = useApp() as { lang: Lang };
  const t = dict[lang] || dict.en;
  const isRtl = lang === "ar" || lang === "ku";

  // Shared Global States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState<{ productId: number; qty: number }[]>([]);
  const [view, setView] = useState<"store" | "admin">("store");

  // Web Browser Shell Measurements
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
    const timer = setTimeout(updateSize, 150);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden font-sans min-h-0">
      {/* Top browser address bar */}
      <div className="h-12 border-b border-slate-200 flex items-center px-4 justify-between shrink-0 bg-slate-100 z-20 relative select-none">
        <div className="flex gap-1.5" dir="ltr">
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
        </div>
        
        {/* Navigation & Address */}
        <div className="flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("store")}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${
                view === "store" ? "bg-cyan-500 text-white shadow-sm" : "bg-slate-200/50 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {t.visitStore}
            </button>
            <button
              onClick={() => setView("admin")}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${
                view === "admin" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-200/50 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {t.adminDashboard}
            </button>
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-[10px] text-slate-400 text-center truncate font-mono select-all">
            https://{t.storeUrl}/{view === "admin" ? "admin" : "shop"}
          </div>
        </div>
        
        {/* Database Status indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/40">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          {t.connectedDb}
        </div>
      </div>

      {/* Main Virtual Screen Workspace */}
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#070b13]">
        <div
          className="absolute top-0 left-0 flex flex-col bg-[#070b13] text-white"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformOrigin: "top left",
            transform: `scale(${dimensions.scale})`
          }}
        >
          {view === "store" ? (
            <StorefrontView
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
              orders={orders}
              setOrders={setOrders}
              t={t}
              lang={lang}
              isRtl={isRtl}
            />
          ) : (
            <AdminDashboardView
              products={products}
              setProducts={setProducts}
              orders={orders}
              setOrders={setOrders}
              t={t}
              lang={lang}
              isRtl={isRtl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. STOREFRONT VIEW
// ==========================================
function StorefrontView({
  products,
  setProducts,
  cart,
  setCart,
  orders,
  setOrders,
  t,
  lang,
  isRtl
}: any) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutScreen, setCheckoutScreen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderNum, setLastOrderNum] = useState("");

  // Checkout form fields
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("cod");

  const cartTotalQty = useMemo(() => cart.reduce((sum: number, c: any) => sum + c.qty, 0), [cart]);

  const cartDetails = useMemo(() => {
    return cart
      .map((c: any) => {
        const p = products.find((x: any) => x.id === c.productId);
        return p ? { ...p, qty: c.qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return cartDetails.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  }, [cartDetails]);

  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleAddToCart = (id: number) => {
    const prod = products.find((x: any) => x.id === id);
    if (!prod || prod.stock <= 0) return;

    setCart((prev: any) => {
      const idx = prev.findIndex((c: any) => c.productId === id);
      if (idx >= 0) {
        const nextCart = [...prev];
        const nextQty = Math.min(prod.stock, nextCart[idx].qty + 1);
        nextCart[idx] = { productId: id, qty: nextQty };
        return nextCart;
      }
      return [...prev, { productId: id, qty: 1 }];
    });
  };

  const handleQtyChange = (id: number, delta: number) => {
    const prod = products.find((x: any) => x.id === id);
    if (!prod) return;

    setCart((prev: any) => {
      return prev
        .map((c: any) => {
          if (c.productId === id) {
            const nextQty = c.qty + delta;
            if (nextQty <= 0) return null;
            return { productId: id, qty: Math.min(prod.stock, nextQty) };
          }
          return c;
        })
        .filter(Boolean);
    });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim() || !address.trim()) return;

    const orderNum = Math.floor(10000 + Math.random() * 90000).toString();
    const orderItems = cartDetails.map((c: any) => ({
      productId: c.id,
      name: lang === "ar" ? c.nameAr : lang === "ku" ? c.nameKu : c.nameEn,
      qty: c.qty,
      price: c.price
    }));

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      address,
      items: orderItems,
      subtotal,
      total: grandTotal,
      status: "pending",
      date: new Date().toISOString()
    };

    // Deduct stock and increment salesCount in products
    setProducts((prev: any) => {
      return prev.map((p: any) => {
        const cartItem = cart.find((c: any) => c.productId === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.qty),
            salesCount: p.salesCount + cartItem.qty
          };
        }
        return p;
      });
    });

    // Add Order
    setOrders((prev: any) => [newOrder, ...prev]);

    setLastOrderNum(orderNum);
    setCart([]);
    setCheckoutScreen(false);
    setOrderSuccess(true);

    // Reset Form
    setCustomerName("");
    setAddress("");
  };

  const filteredProducts = products.filter((p: any) => {
    const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Shop Navbar */}
      <nav className="h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-white font-black shadow-lg">
            <ShoppingBag size={20} />
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {t.storeName}
          </span>
        </div>

        {/* Search & Cart */}
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute top-2.5 right-3 text-white/30" size={16} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 group"
          >
            <ShoppingCart size={16} className="text-cyan-400 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold">{t.cartTitle}</span>
            {cartTotalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 bg-cyan-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartTotalQty}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 min-h-0 bg-[#080b13]">
        {orderSuccess ? (
          // Success Screen
          <div className="max-w-md mx-auto my-12 bg-slate-900/50 border border-white/10 p-8 rounded-[2rem] text-center shadow-2xl backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-black mb-3">{t.orderSuccess}</h2>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              {t.orderSuccessDesc}
            </p>
            <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl mb-6 font-mono text-sm">
              <span className="text-white/40">Order No: </span>
              <span className="text-cyan-400 font-bold">#{lastOrderNum}</span>
            </div>
            <button
              onClick={() => setOrderSuccess(false)}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-400/10 transition-all"
            >
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-cyan-950/20 to-sky-950/20 p-10 md:p-12 mb-10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-2xl relative z-10 text-start">
                <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full inline-block mb-4">
                  Next.js 15 Fast Commerce
                </span>
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-sm md:text-base text-white/50 leading-relaxed mb-6">
                  {t.heroDesc}
                </p>
                <a
                  href="#products-list"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-400/10 transition-all group"
                >
                  <span>{t.shopNow}</span>
                  {isRtl ? <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> : <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                </a>
              </div>
            </div>

            {/* Catalog Filter Controls */}
            <div id="products-list" className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex gap-2">
                {[
                  { key: "all", label: t.all },
                  { key: "electronics", label: t.electronics },
                  { key: "accessories", label: t.accessories },
                  { key: "gear", label: t.gear }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory === cat.key
                        ? "bg-cyan-400 border-cyan-400 text-black"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p: any) => {
                const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
                const isOutOfStock = p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    className="group border border-white/5 bg-slate-900/30 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 hover:shadow-[0_20px_50px_rgba(43,127,255,0.03)] transition-all duration-300"
                  >
                    <div>
                      {/* Emoji Image placeholder */}
                      <div className="h-44 w-full rounded-2xl bg-gradient-to-br from-slate-950/80 to-slate-900/50 flex items-center justify-center text-6xl shadow-inner mb-6 group-hover:scale-[1.02] transition-transform duration-300 relative">
                        <span>{p.img}</span>
                        {p.stock <= 3 && p.stock > 0 && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                            {p.stock} {t.itemsLeft}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black mb-2 truncate group-hover:text-cyan-400 transition-colors text-start">
                        {name}
                      </h3>
                      <p className="text-[10px] text-white/40 tracking-wider uppercase mb-4 text-start font-mono">
                        SKU: KDY-{p.id}00
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-lg font-black text-white">${p.price}</span>
                      <button
                        onClick={() => handleAddToCart(p.id)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                          isOutOfStock
                            ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                            : "bg-cyan-400 hover:bg-cyan-500 text-black shadow-lg shadow-cyan-400/5 active:scale-[0.98]"
                        }`}
                      >
                        <ShoppingCart size={13} />
                        <span>{isOutOfStock ? t.outOfStock : t.addToCart}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Cart & Checkout Panel Overlay */}
      {isCartOpen && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex justify-end animate-[fadeIn_0.2s_ease-out]">
          <div className="w-[420px] h-full bg-[#090e18] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl relative">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-cyan-400" />
                  <span className="font-black text-lg">{checkoutScreen ? t.checkoutTitle : t.cartTitle}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutScreen(false);
                  }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {checkoutScreen ? (
                // Checkout Fields form
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-start mt-2">
                  <div>
                    <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                      {t.fullName}
                    </label>
                    <div className="relative">
                      <User className="absolute top-2.5 left-3 text-white/30" size={14} />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                      {t.address}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-2.5 left-3 text-white/30" size={14} />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Iraq, Erbil, 100m Road"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/50 block mb-2 uppercase tracking-wider">
                      {t.paymentMethod}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod("cod")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          payMethod === "cod"
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                            : "bg-white/5 border-white/5 text-white/60"
                        }`}
                      >
                        <CheckCircle size={16} />
                        <span className="text-[10px] font-bold">{t.cod}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("card")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          payMethod === "card"
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                            : "bg-white/5 border-white/5 text-white/60"
                        }`}
                      >
                        <CreditCard size={16} />
                        <span className="text-[10px] font-bold">{t.card}</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // Items List
                <div className="space-y-3 max-h-[380px] overflow-y-auto pe-1">
                  {cartDetails.length === 0 ? (
                    <div className="text-center py-12 text-white/40 text-xs">
                      {t.cartEmpty}
                    </div>
                  ) : (
                    cartDetails.map((item: any) => {
                      const name = lang === "ar" ? item.nameAr : lang === "ku" ? item.nameKu : item.nameEn;
                      return (
                        <div key={item.id} className="flex gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-2xl shrink-0">
                            {item.img}
                          </div>
                          <div className="flex-1 min-w-0 text-start">
                            <h4 className="text-xs font-bold truncate mb-1">{name}</h4>
                            <span className="text-xs font-mono text-cyan-400">${item.price}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleQtyChange(item.id, -1)}
                              className="w-6 h-6 bg-white/5 hover:bg-white/10 rounded-md flex items-center justify-center text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => handleQtyChange(item.id, 1)}
                              className="w-6 h-6 bg-white/5 hover:bg-white/10 rounded-md flex items-center justify-center text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Calculations & Button Footer */}
            {cart.length > 0 && (
              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="space-y-2 text-xs text-white/70 mb-4">
                  <div className="flex justify-between">
                    <span>{t.subtotal}</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.tax}</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-white border-t border-white/5 pt-2 text-sm">
                    <span>{t.total}</span>
                    <span className="font-mono text-cyan-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutScreen ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutScreen(false)}
                      className="w-1/3 py-3 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs font-bold transition-all"
                    >
                      {isRtl ? "رجوع" : "Back"}
                    </button>
                    <button
                      onClick={handleCheckoutSubmit}
                      disabled={!customerName.trim() || !address.trim()}
                      className="flex-1 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/5 transition-all"
                    >
                      {t.placeOrder}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckoutScreen(true)}
                    className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/5 transition-all flex items-center justify-center gap-1"
                  >
                    <span>{t.checkout}</span>
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. ADMIN CONTROL DASHBOARD VIEW
// ==========================================
function AdminDashboardView({
  products,
  setProducts,
  orders,
  setOrders,
  t,
  lang,
  isRtl
}: any) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");

  // Product addition / editing modal variables
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProductMode, setEditProductMode] = useState<any | null>(null);
  
  // Product forms
  const [formNameAr, setFormNameAr] = useState("");
  const [formNameKu, setFormNameKu] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formCategory, setFormCategory] = useState("accessories");

  const revenue = useMemo(() => orders.reduce((sum: number, o: any) => sum + o.subtotal, 0), [orders]);
  const activeOrdersCount = useMemo(() => orders.filter((o: any) => o.status !== "delivered").length, [orders]);
  const lowStockCount = useMemo(() => products.filter((p: any) => p.stock <= 3).length, [products]);

  const handleEditProductOpen = (prod: any) => {
    setEditProductMode(prod);
    setFormNameAr(prod.nameAr);
    setFormNameKu(prod.nameKu);
    setFormNameEn(prod.nameEn);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormCategory(prod.category);
    setProductModalOpen(true);
  };

  const handleNewProductOpen = () => {
    setEditProductMode(null);
    setFormNameAr("");
    setFormNameKu("");
    setFormNameEn("");
    setFormPrice(0);
    setFormStock(0);
    setFormCategory("accessories");
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim() || !formNameKu.trim() || !formNameEn.trim()) return;

    if (editProductMode) {
      // Edit
      setProducts((prev: any) => {
        return prev.map((p: any) => {
          if (p.id === editProductMode.id) {
            return {
              ...p,
              nameAr: formNameAr,
              nameKu: formNameKu,
              nameEn: formNameEn,
              price: Number(formPrice),
              stock: Number(formStock),
              category: formCategory
            };
          }
          return p;
        });
      });
    } else {
      // Add
      const newProd = {
        id: Date.now(),
        nameAr: formNameAr,
        nameKu: formNameKu,
        nameEn: formNameEn,
        price: Number(formPrice),
        stock: Number(formStock),
        category: formCategory,
        img: "📦",
        salesCount: 0
      };
      setProducts((prev: any) => [...prev, newProd]);
    }
    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev: any) => prev.filter((p: any) => p.id !== id));
  };

  const handleOrderStatusChange = (id: string, newStatus: string) => {
    setOrders((prev: any) => {
      return prev.map((o: any) => {
        if (o.id === id) {
          return { ...o, status: newStatus };
        }
        return o;
      });
    });
  };

  return (
    <div className="flex-1 flex min-h-0 bg-[#080b13] text-start" dir={isRtl ? "rtl" : "ltr"}>
      {/* Sidebar navigation */}
      <div className="w-64 shrink-0 border-r border-white/5 bg-slate-950/40 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Database size={16} />
            </div>
            <span className="text-sm font-black tracking-wider uppercase text-white/80">
              Kodify Portal
            </span>
          </div>

          <div className="space-y-1">
            {[
              { key: "overview", label: t.overview, icon: BarChart3 },
              { key: "products", label: t.products, icon: Package },
              { key: "orders", label: t.orders, icon: ShoppingBag }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.key
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "text-white/50 border border-transparent hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-[10px] text-white/30 font-mono">
            DB Engine: SQLite (Local)
            <br />
            Next.js SSR: Active
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-8 min-h-0">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-[fadeIn_0.25s_ease-out]">
            <h2 className="text-xl font-black">{t.overview}</h2>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: t.totalRevenue, val: `$${revenue.toLocaleString()}`, col: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/10" },
                { label: t.activeOrders, val: activeOrdersCount, col: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/10" },
                { label: t.totalProducts, val: products.length, col: "text-indigo-400", bg: "bg-indigo-500/5 border-indigo-500/10" },
                { label: t.lowStockAlertText, val: lowStockCount, col: lowStockCount > 0 ? "text-rose-400" : "text-white/30", bg: "bg-rose-500/5 border-rose-500/10" }
              ].map((s, idx) => (
                <div key={idx} className={`border p-6 rounded-2xl ${s.bg}`}>
                  <span className="text-[10px] font-bold text-white/40 block mb-2 uppercase tracking-wider">{s.label}</span>
                  <span className={`text-2xl font-black ${s.col}`}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Sales Chart Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border border-white/5 bg-slate-900/30 rounded-[2rem] p-6 text-start">
                <span className="text-xs font-bold text-white/50 block mb-6">{t.revenueChart}</span>
                
                {/* SVG Line Chart */}
                <div className="h-48 relative w-full">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    
                    {/* Gradient Area under the path */}
                    <path
                      d="M 10 130 Q 100 110 180 80 T 350 90 T 490 30 L 490 145 L 10 145 Z"
                      fill="url(#chartGlow)"
                    />
                    
                    {/* Dynamic Sales Path */}
                    <path
                      d="M 10 130 Q 100 110 180 80 T 350 90 T 490 30"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    
                    {/* Nodes */}
                    <circle cx="180" cy="80" r="5" fill="#4f46e5" stroke="#080b13" strokeWidth="2" />
                    <circle cx="350" cy="90" r="5" fill="#4f46e5" stroke="#080b13" strokeWidth="2" />
                    <circle cx="490" cy="30" r="5" fill="#4f46e5" stroke="#080b13" strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/30">June 2026 Analytics</div>
                </div>
              </div>

              {/* Status circular progress mock */}
              <div className="border border-white/5 bg-slate-900/30 rounded-[2rem] p-6 text-start flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-white/50 block mb-6">{t.orderDistribution}</span>
                  <div className="space-y-3">
                    {[
                      { l: t.pending, c: "bg-amber-400", p: "25%" },
                      { l: t.shipped, c: "bg-indigo-400", p: "45%" },
                      { l: t.delivered, c: "bg-emerald-400", p: "30%" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/60 font-bold">
                          <span>{stat.l}</span>
                          <span>{stat.p}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${stat.c}`} style={{ width: stat.p }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS TABLE */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">{t.products}</h2>
              <button
                onClick={handleNewProductOpen}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>{t.addNewProduct}</span>
              </button>
            </div>

            <div className="border border-white/5 rounded-3xl bg-slate-900/10 overflow-hidden">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <th className="p-4">{t.products}</th>
                    <th className="p-4">{t.category}</th>
                    <th className="p-4">{t.price}</th>
                    <th className="p-4">{t.stock}</th>
                    <th className="p-4 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-white/5">
                  {products.map((p: any) => {
                    const name = lang === "ar" ? p.nameAr : lang === "ku" ? p.nameKu : p.nameEn;
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-3">
                          <span className="text-2xl">{p.img}</span>
                          <div>
                            <div className="text-white">{name}</div>
                            <span className="text-[9px] font-mono text-white/30">ID: KDY-{p.id}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/60 font-semibold">{t[p.category] || p.category}</td>
                        <td className="p-4 font-mono text-cyan-400">${p.price}</td>
                        <td className="p-4 font-mono">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            p.stock <= 3 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {p.stock} Qty
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditProductOpen(p)}
                              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white hover:bg-white/10 hover:text-indigo-400 transition"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition"
                            >
                              <Trash2 size={13} />
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
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
            <h2 className="text-xl font-black">{t.orders}</h2>

            <div className="border border-white/5 rounded-3xl bg-slate-900/10 overflow-hidden">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    <th className="p-4">Order #</th>
                    <th className="p-4">{t.customer}</th>
                    <th className="p-4">{t.products}</th>
                    <th className="p-4">{t.total}</th>
                    <th className="p-4">{t.status}</th>
                    <th className="p-4 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-white/5">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">#{o.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.customerName}</div>
                        <span className="text-[9px] text-white/30">{o.address}</span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-white/70">
                        {o.items.map((it: any) => `${it.qty}x ${it.name}`).join(", ")}
                      </td>
                      <td className="p-4 font-mono text-cyan-400 font-bold">${o.total.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          o.status === "delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : o.status === "shipped"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {t[o.status] || o.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                            className="bg-[#0b0f19] border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                          >
                            <option value="pending">{t.pending}</option>
                            <option value="shipped">{t.shipped}</option>
                            <option value="delivered">{t.delivered}</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal Overlay */}
      {productModalOpen && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="w-[480px] bg-[#090e18] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black mb-6 border-b border-white/5 pb-3">
              {editProductMode ? t.edit : t.addNewProduct}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-start">
              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                  {t.productAr}
                </label>
                <input
                  type="text"
                  required
                  value={formNameAr}
                  onChange={(e) => setFormNameAr(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                  {t.productKu}
                </label>
                <input
                  type="text"
                  required
                  value={formNameKu}
                  onChange={(e) => setFormNameKu(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                  {t.productEn}
                </label>
                <input
                  type="text"
                  required
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                    {t.price}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                    {t.stock}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 block mb-1 uppercase tracking-wider">
                  {t.category}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500/50 text-white cursor-pointer"
                >
                  <option value="electronics">{t.electronics}</option>
                  <option value="accessories">{t.accessories}</option>
                  <option value="gear">{t.gear}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/10 transition-all"
              >
                {t.saveProduct}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
