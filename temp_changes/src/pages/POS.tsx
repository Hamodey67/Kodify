import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { AdminPinModal } from '../components/AdminPinModal';
import { PriceEditModal } from '../components/PriceEditModal';
import { GeneralDiscountModal } from '../components/GeneralDiscountModal';
import { usePriceOverride } from '../utils/usePriceOverride';
import { 
  Search, 
  UserPlus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Split, 
  Plus, 
  Minus, 
  Percent, 
  RefreshCw,
  ShoppingBag,
  Info,
  Lock,
  Pencil
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const POS: React.FC = () => {
  const { language, dir } = useLanguageStore();
  const t = translations[language];
  const { user } = useAuthStore();
  const { getSetting } = useSettingsStore();
  const {
    isAdmin,
    selectedItem,
    selectedItemName,
    isPinModalOpen,
    isPriceModalOpen,
    pinError,
    isPinLocked,
    lockSecondsLeft,
    requestPriceEdit,
    verifyPin,
    savePriceOverride,
    closePinModal,
    closePriceModal,
  } = usePriceOverride();

  // Cart Store selectors
  const { 
    items, 
    customer, 
    addItem, 
    removeItem, 
    updateQuantity, 
    updateDiscount, 
    setCustomer, 
    setGlobalDiscount, 
    globalDiscount,
    globalDiscountType,
    getTotals, 
    clearCart,
    checkout 
  } = useCartStore();

  const totals = getTotals();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // Fly-to-cart animation state
  interface FlyingItem {
    id: string;
    name: string;
    price: number;
    startX: number;
    startY: number;
  }
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const triggerFlyToCart = (product: any, eventOrCoords?: React.MouseEvent | { x: number; y: number }) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (eventOrCoords && 'clientX' in eventOrCoords) {
      startX = eventOrCoords.clientX;
      startY = eventOrCoords.clientY;
    } else if (eventOrCoords && 'x' in eventOrCoords) {
      startX = eventOrCoords.x;
      startY = eventOrCoords.y;
    } else {
      // Barcode scan or programmatically added: find card element
      const cardEl = document.getElementById(`product-card-${product.id}`);
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else {
        // Fallback: search input box position
        const searchInput = document.querySelector('input[placeholder]');
        if (searchInput) {
          const rect = searchInput.getBoundingClientRect();
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;
        }
      }
    }

    const name = language === 'ar' 
      ? product.nameAr 
      : language === 'ku' 
        ? (product.nameKu || product.nameAr) 
        : product.nameEn;

    const newItem: FlyingItem = {
      id: `${product.id}-${Date.now()}-${Math.random()}`,
      name,
      price: product.price,
      startX,
      startY,
    };

    setFlyingItems((prev) => [...prev, newItem]);
  };
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');

  // General discount PIN verification state
  const [isDiscountPinModalOpen, setIsDiscountPinModalOpen] = useState(false);
  const [discountPinError, setDiscountPinError] = useState('');
  const [discountFailedAttempts, setDiscountFailedAttempts] = useState(0);
  const [discountLockedUntil, setDiscountLockedUntil] = useState<number | null>(null);
  const [discountLockSecondsLeft, setDiscountLockSecondsLeft] = useState(0);

  const isDiscountPinLocked = !!discountLockedUntil && discountLockedUntil > Date.now();

  useEffect(() => {
    if (!discountLockedUntil) {
      setDiscountLockSecondsLeft(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((discountLockedUntil - Date.now()) / 1000));
      setDiscountLockSecondsLeft(remaining);
      if (remaining <= 0) {
        setDiscountLockedUntil(null);
        setDiscountPinError('');
        setDiscountFailedAttempts(0);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [discountLockedUntil]);

  const verifyDiscountPin = async (pin: string): Promise<boolean> => {
    if (isDiscountPinLocked) {
      setDiscountPinError(language === 'ar' ? 'تم قفل الإدخال مؤقتاً' : 'Entry locked temporarily');
      return false;
    }

    const valid = await window.api.verifyAdminPin(pin);
    if (valid) {
      setDiscountPinError('');
      setDiscountFailedAttempts(0);
      setIsDiscountPinModalOpen(false);
      setIsDiscountModalOpen(true);
      return true;
    }

    const nextFailedAttempts = discountFailedAttempts + 1;
    setDiscountFailedAttempts(nextFailedAttempts);
    setDiscountPinError(language === 'ar' ? 'رمز PIN غير صحيح' : 'Incorrect PIN');

    if (nextFailedAttempts >= 3) {
      setDiscountLockedUntil(Date.now() + 30_000);
      setDiscountPinError(
        language === 'ar' 
          ? 'تم تجاوز الحد المسموح. المحاولة متاحة بعد 30 ثانية' 
          : 'Too many attempts. Try again in 30 seconds'
      );
    }

    return false;
  };
  
  // Customer selection state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);

  // Barcode scanner HID Wedge listener variables
  const barcodeBuffer = useRef<string>('');
  const lastKeyTime = useRef<number>(0);

  // Load products & customers from DB
  const loadData = async () => {
    try {
      const prodList = await window.api.getProducts();
      setProducts(prodList || []);
      setFilteredProducts(prodList || []);
      
      // Extract unique categories
      const cats: string[] = ['All'];
      prodList?.forEach((p: any) => {
        if (p.category && !cats.includes(p.category)) {
          cats.push(p.category);
        }
      });
      setCategories(cats);

      const custList = await window.api.getCustomers();
      setAllCustomers(custList || []);
      setFilteredCustomers(custList || []);
    } catch (err) {
      console.error('POS failed to load products/customers:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products by search query and category tab
  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        (p.nameKu && p.nameKu.toLowerCase().includes(q))
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  // Filter customers during modal search
  useEffect(() => {
    if (customerSearchQuery) {
      const q = customerSearchQuery.toLowerCase();
      setFilteredCustomers(
        allCustomers.filter(c => 
          c.name.toLowerCase().includes(q) || 
          (c.phone && c.phone.includes(q))
        )
      );
    } else {
      setFilteredCustomers(allCustomers);
    }
  }, [customerSearchQuery, allCustomers]);

  // Barcode HID Keyboard wedge capture logic
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore key events when typing inside search boxes
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      
      // Allow capturing barcode scan globally
      const now = Date.now();
      
      // HID scanners type keys very fast (usually < 30ms interval)
      if (now - lastKeyTime.current > 50) {
        // Slow keypress, clear buffer if it was human typing and we are focused on input
        if (isInput && e.key !== 'Enter') {
          barcodeBuffer.current = '';
          return;
        }
        // If not focused on input, buffer it anyway
        barcodeBuffer.current = '';
      }

      lastKeyTime.current = now;

      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length >= 5) {
          e.preventDefault();
          const code = barcodeBuffer.current;
          barcodeBuffer.current = '';
          
          console.log(`[Barcode Wedge Detected]: ${code}`);
          // Look up product by barcode
          try {
            const matches = await window.api.searchProducts(code);
            if (matches && matches.length > 0) {
              addItem(matches[0]);
              triggerFlyToCart(matches[0]);
              console.log(`Product added to cart via barcode: ${matches[0].nameAr}`);
            } else {
              alert(language === 'ar' ? `المنتج ذو الباركود ${code} غير موجود` : `Barcode ${code} not found`);
            }
          } catch (err) {
            console.error('Barcode scanner handler error:', err);
          }
        }
      } else if (e.key.length === 1 && /\d|[a-zA-Z]/.test(e.key)) {
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products, language]);

  // Checkout Calculations
  const changeDue = Math.max(0, cashReceived - (paymentMethod === 'split' ? cashAmount : totals.total));

  // Initialize values when checkout modal opens
  const openCheckoutModal = () => {
    if (items.length === 0) return;
    setPaymentMethod('cash');
    setCashReceived(totals.total);
    setCardAmount(0);
    setCashAmount(totals.total);
    setCheckoutSuccess(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async () => {
    if (!user) return;
    
    const storeName = getSetting('store_name_en', 'Kodify System');
    const storeAddress = getSetting('store_address', 'بغداد');
    const storePhone = getSetting('store_phone', '+0964-750-101-0964');
    const storeTaxNumber = getSetting('store_tax_number', '100012345');
    
    const result = await checkout({
      userId: user.id,
      paymentMethod,
      cashReceived: paymentMethod === 'card' ? 0 : (paymentMethod === 'split' ? cashAmount : cashReceived),
      cashReturned: paymentMethod === 'card' ? 0 : changeDue,
      cardAmount: paymentMethod === 'card' ? totals.total : (paymentMethod === 'split' ? cardAmount : 0),
      storeName,
      storeAddress,
      storePhone,
      storeTaxNumber,
      cashierName: user.name,
    });

    if (result.success) {
      setLastInvoiceNumber(result.invoiceNumber || '');
      setCheckoutSuccess(true);
      
      // Auto close after 2 seconds or let user inspect receipt
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setCheckoutSuccess(false);
        loadData(); // reload stocks
      }, 2500);
    } else {
      alert(t.error + ': ' + result.error);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden bg-pos-bg"
    >
      
      {/* LEFT AREA: Product Selection Catalog & search */}
      <div className="flex-1 flex flex-col h-full border-r border-white/5 p-4 gap-4 overflow-hidden">
        
        {/* Top bar: Search query and category filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.scanBarcode}
              className="w-full bg-white/3 border border-white/8 focus:border-indigo-400/40 text-slate-100 pl-11 pr-4 py-3 rounded-2xl text-sm transition-all outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-glass"
            />
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-slate-300/70 ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
          </div>
          
          <button 
            onClick={loadData}
            className="px-4 h-12 rounded-2xl border border-white/8 bg-white/3 glass text-slate-200 hover:text-white hover:bg-white/6 transition-all active:scale-[0.98]"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Category horizontal scrolling tabs */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 active:scale-95 border ${
                selectedCategory === cat
                  ? 'bg-[linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.18))] text-slate-100 border-white/10 shadow-glow-indigo'
                  : 'bg-white/3 text-slate-300/70 border-white/8 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? t.categoryAll : cat}
            </button>
          ))}
        </div>

        {/* Product quick-keys grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pl-1 pt-3">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-300/60 text-sm">
              {language === 'ar' ? 'لا توجد منتجات مطابقة للبحث' : 'No products found.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 pb-4">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isHovered = hoveredProductId === p.id;
                const cardColor = p.color || '#6366f1';
                
                return (
                  <motion.button
                    key={p.id}
                    id={`product-card-${p.id}`}
                    onClick={(e) => {
                      addItem(p);
                      triggerFlyToCart(p, e);
                    }}
                    onMouseEnter={() => setHoveredProductId(p.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    whileHover={isOutOfStock ? {} : { scale: 1.02, y: -2 }}
                    whileTap={isOutOfStock ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      backgroundColor: isOutOfStock 
                        ? '#0c101b' 
                        : (isHovered ? '#1c2538' : '#111827'),
                      borderColor: isOutOfStock 
                        ? 'rgba(239, 68, 68, 0.15)' 
                        : (isHovered ? cardColor : `${cardColor}30`),
                      boxShadow: isOutOfStock
                        ? 'none'
                        : (isHovered 
                          ? `0 0 20px ${cardColor}25, inset 0 0 12px ${cardColor}10` 
                          : '0 4px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'),
                    }}
                    className={`relative overflow-hidden border p-3 rounded-2xl flex flex-col justify-between h-[148px] ${dir === 'rtl' ? 'text-right' : 'text-left'} transition-all duration-300 group ${
                      isOutOfStock ? 'cursor-not-allowed opacity-50 filter grayscale-[20%]' : ''
                    }`}
                    disabled={isOutOfStock}
                  >
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-500 pointer-events-none" 
                      style={{
                        background: `linear-gradient(135deg, ${cardColor}00, ${cardColor}15)`,
                        opacity: isHovered ? 1 : 0,
                      }}
                    />

                    {/* Top Section: Image or text spacer */}
                    {p.image ? (
                      <div className="w-full h-[60px] rounded-xl overflow-hidden mb-1 relative shrink-0 border border-white/5 bg-slate-950/40">
                        <img src={p.image} alt={p.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {/* Floating Category Pill on Image */}
                        <span 
                          className="absolute bottom-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-md border uppercase tracking-wider"
                          style={{
                            color: '#ffffff',
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {p.category}
                        </span>

                        {/* Floating Stock Badge on Image */}
                        <span className={`absolute top-1 left-1 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md backdrop-blur-md border flex items-center gap-1 ${
                          isOutOfStock 
                             ? 'text-rose-400 bg-rose-950/70 border-rose-500/30' 
                             : p.stock <= 5 
                               ? 'text-amber-400 bg-amber-950/70 border-amber-500/30'
                               : 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isOutOfStock ? 'bg-rose-500 animate-pulse' : p.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span>{p.stock}</span>
                        </span>
                      </div>
                    ) : (
                      /* Top Header when no image */
                      <div className="flex justify-between items-center w-full shrink-0 relative z-10 mb-1">
                        {/* Category Label */}
                        <span 
                          className="text-[8.5px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider transition-all"
                          style={{
                            color: '#ffffff',
                            backgroundColor: isHovered ? `${cardColor}25` : `${cardColor}12`,
                            borderColor: isHovered ? `${cardColor}40` : `${cardColor}20`,
                          }}
                        >
                          {p.category}
                        </span>
                        
                        {/* Stock Pill Badge */}
                        <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all ${
                          isOutOfStock 
                             ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                             : p.stock <= 5 
                               ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                               : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isOutOfStock ? 'bg-rose-500 animate-pulse' : p.stock <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span>{p.stock}</span>
                        </span>
                      </div>
                    )}

                    {/* Product Name & Details */}
                    <div className="flex flex-col mt-0.5 relative z-10 flex-1 justify-center">
                      <span className="text-slate-100 text-[12.5px] font-extrabold tracking-wide group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                      </span>
                      {!p.image && (
                        <span className="text-[9px] text-slate-500 font-mono tracking-wider mt-0.5 truncate opacity-70 group-hover:opacity-100 transition-opacity">
                          {p.barcode || p.sku || '---'}
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="flex justify-between items-center w-full shrink-0 relative z-10 mt-auto pt-1.5">
                      {/* Price Badge Container */}
                      <div 
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all duration-300"
                        style={{
                          backgroundColor: isHovered ? `${cardColor}15` : 'rgba(15, 23, 42, 0.35)',
                          borderColor: isHovered ? `${cardColor}40` : 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <span 
                          className="font-black font-mono text-[13px] tracking-tight transition-all"
                          style={{
                            color: isHovered ? '#ffffff' : cardColor,
                            textShadow: isHovered ? `0 0 10px ${cardColor}` : undefined,
                          }}
                        >
                          {Math.round(p.price).toLocaleString()}
                        </span>
                        <span className="text-[7.5px] font-sans font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase">{t.currency}</span>
                      </div>
                      
                      {/* Add Icon (Hover) */}
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 w-5.5 h-5.5 shrink-0 rounded-lg flex items-center justify-center shadow-lg border border-white/10"
                        style={{
                          backgroundColor: cardColor,
                          color: '#ffffff',
                          boxShadow: `0 0 10px ${cardColor}50`,
                        }}
                      >
                        <Plus size={11} strokeWidth={3} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT AREA: Cart Register Ledger */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col justify-between h-full bg-slate-50 border-l border-slate-200 p-4 gap-4 overflow-hidden shadow-2xl relative z-20">
        
        {/* Cart Header */}
        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div id="cart-target-icon" className="w-10 h-10 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-slate-800">{language === 'ar' ? 'سلة المبيعات' : 'Sales Cart'}</span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {items.length} {language === 'ar' ? 'أصناف مختلفة' : 'unique items'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700">
            {totals.itemCount} {language === 'ar' ? 'قطعة' : 'pcs'}
          </span>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5 pl-0.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
              <ShoppingBag size={28} className="text-slate-200" />
              <span>{t.cartIsEmpty}</span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {/* Top: Name and Trash */}
                  <div className="flex justify-between items-start gap-2 relative z-10">
                    <div className={`flex flex-col gap-1 flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <span className="text-[13px] font-bold text-slate-200 tracking-wide line-clamp-2 leading-snug">
                        {language === 'ar' ? item.nameAr : language === 'ku' ? (item.nameKu || item.nameAr) : item.nameEn}
                      </span>
                      
                      {/* SKU / Barcode tag */}
                      {item.barcode && (
                        <span className="text-[9px] text-slate-500 font-mono tracking-widest leading-none">
                          {item.barcode}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Middle: Price Tag Badge */}
                  <div className={`flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'} relative z-10`}>
                    <button
                      onClick={() => requestPriceEdit(item)}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-[11px] text-slate-300"
                      title={isAdmin ? 'تعديل السعر' : 'يتطلب صلاحية مشرف'}
                    >
                      {isAdmin ? <Pencil size={10} className="text-slate-400 shrink-0" /> : <Lock size={10} className="text-slate-500 shrink-0" />}
                      
                      {item.originalPrice > item.price ? (
                        <div className="flex items-center gap-1.5 flex-row-reverse">
                          <span className="line-through text-slate-500 text-[10px] font-mono">{Math.round(item.originalPrice).toLocaleString()}</span>
                          <span className="text-emerald-400 text-[11px] font-bold font-mono">{Math.round(item.price).toLocaleString()}</span>
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 rounded font-sans">
                            -{Math.round((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-200 text-[11px] font-bold font-mono">
                          {Math.round(item.price).toLocaleString()} <span className="text-[9px] text-slate-500">{t.currency}</span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Bottom: Quantity and Total */}
                  <div className="flex justify-between items-center relative z-10 mt-1">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-slate-950/50 rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-200 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Final Item Total */}
                    <div className={`flex flex-col ${dir === 'rtl' ? 'items-start text-left' : 'items-end text-right'}`}>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                        {language === 'ar' ? 'المجموع' : 'Total'}
                      </span>
                      <span className="text-[15px] font-black text-cyan-400 font-mono leading-none">
                        {Math.round((item.price * item.quantity) - item.discount).toLocaleString()} <span className="text-[10px] text-cyan-500 font-sans">{t.currency}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Calculations and Actions Footer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shrink-0 shadow-xl relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-cyan-500/5 blur-[40px] rounded-full pointer-events-none" />
          
          {/* Discount triggers */}
          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => {
                if (isAdmin) {
                  setIsDiscountModalOpen(true);
                } else {
                  setDiscountPinError('');
                  setIsDiscountPinModalOpen(true);
                }
              }}
              className="flex-1 h-10 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Percent size={11} className="text-teal-400 animate-pulse" />
              <span>
                {t.generalDiscount}{' '}
                {globalDiscount > 0 
                  ? globalDiscountType === 'percent' 
                    ? `(${globalDiscount}%)` 
                    : `(${globalDiscount.toLocaleString()} ${t.currency})`
                  : ''}
              </span>
            </button>
            <button
              onClick={clearCart}
              className="h-10 px-4 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-[11px] font-black transition-all duration-200 active:scale-95"
            >
              {t.clearCart}
            </button>
          </div>

          <div className="border-t border-slate-800/80 my-0.5 relative z-10"></div>

          {/* Pricing breakdowns in a dark card inset */}
          <div className="bg-slate-950/40 border border-slate-800/55 rounded-xl p-4 space-y-3 relative z-10 shadow-inner">
            <div className="flex justify-between items-center text-xs text-slate-400 font-sans">
              <span className="font-bold">{t.subtotalBeforeDiscount}:</span>
              <span className="font-mono text-slate-200 font-bold">{Math.round(totals.subtotal).toLocaleString()} {t.currency}</span>
            </div>
            
            {totals.itemsDiscountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-rose-400 font-sans">
                <span className="font-bold">{t.itemsDiscount}:</span>
                <span className="font-mono font-bold">-{Math.round(totals.itemsDiscountAmount).toLocaleString()} {t.currency}</span>
              </div>
            )}
            
            {totals.globalDiscountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-rose-400 font-sans">
                <span className="font-bold">
                  {t.generalDiscount} {globalDiscountType === 'percent' ? `(${globalDiscount}%)` : `(${t.currency})`}:
                </span>
                <span className="font-mono font-bold">-{Math.round(totals.globalDiscountAmount).toLocaleString()} {t.currency}</span>
              </div>
            )}

            <div className="border-t border-slate-800/60 pt-2.5 flex justify-between items-baseline">
              <span className="text-slate-400 font-bold text-xs font-sans">{t.total}:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-emerald-400 text-2xl font-black font-mono leading-none tracking-tight">
                  {Math.round(totals.total).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold font-sans">{t.currency}</span>
              </div>
            </div>
          </div>

          {/* Checkout Trigger */}
          <button
            onClick={openCheckoutModal}
            disabled={items.length === 0}
            className="w-full py-3.5 rounded-xl font-black text-sm text-white border border-white/10 bg-[linear-gradient(135deg,#6366f1,#06b6d4)] hover:bg-[linear-gradient(135deg,#5a5df0,#05a6c2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 relative z-10"
          >
            {t.checkout}
          </button>
        </div>

      </div>

      {/* CUSTOMER SEARCH MODAL DIALOG */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md flex flex-col max-h-[500px] overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-200">{t.customers}</h3>
              <button 
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {/* Search customer input */}
            <div className="p-3 border-b border-slate-700/60 shrink-0">
              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
              />
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">{language === 'ar' ? 'لا يوجد عملاء بهذا الاسم' : 'No matches'}</div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCustomer(c);
                      setIsCustomerModalOpen(false);
                    }}
                    className="w-full text-right p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 hover:bg-slate-800 flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="font-bold text-slate-200">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{c.phone || 'No phone'}</span>
                    </div>
                    <span className="text-teal-400 font-semibold font-mono bg-teal-500/5 px-2 py-1 rounded">
                      {c.points} Points
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={closePinModal}
        onVerify={verifyPin}
        isLocked={isPinLocked}
        lockSecondsLeft={lockSecondsLeft}
        errorMessage={pinError}
      />

      <PriceEditModal
        isOpen={isPriceModalOpen}
        itemName={selectedItemName}
        currentPrice={selectedItem?.price || 0}
        onClose={closePriceModal}
        onSave={async (newPrice, reason) => savePriceOverride({ newPrice, reason })}
      />

      <GeneralDiscountModal
        isOpen={isDiscountModalOpen}
        currentDiscount={globalDiscount}
        currentDiscountType={globalDiscountType}
        itemsTotal={totals.subtotal - totals.itemsDiscountAmount}
        onClose={() => setIsDiscountModalOpen(false)}
        onSave={(discount, type) => {
          setGlobalDiscount(discount, type);
          setIsDiscountModalOpen(false);
        }}
      />

      <AdminPinModal
        isOpen={isDiscountPinModalOpen}
        onClose={() => setIsDiscountPinModalOpen(false)}
        onVerify={verifyDiscountPin}
        isLocked={isDiscountPinLocked}
        lockSecondsLeft={discountLockSecondsLeft}
        errorMessage={discountPinError}
      />

      {/* CHECKOUT & PAYMENT MODAL DIALOG */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 glass z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-fade-in">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/40">
              <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-teal-400" />
                <span>{t.checkout}</span>
              </h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-white"
                disabled={checkoutSuccess}
              >
                ✕
              </button>
            </div>

            {checkoutSuccess ? (
              /* PREMIUM SUCCESS SCREEN */
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-slate-900/50">
                {/* Background ambient glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                {/* Animated checkmark container */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Decorative rotating dashed border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/30"
                  />
                  {/* Glowing outer circle */}
                  <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
                  
                  {/* Main checkmark bubble */}
                  <div className="relative w-16 h-16 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-400"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </div>
                </motion.div>

                <div className="space-y-1 relative z-10">
                  <h4 className="text-xl font-black text-white tracking-wide uppercase">
                    {language === 'ar' ? 'تمت العملية بنجاح' : t.saleCompleted}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                    {language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}: <span className="text-teal-400 font-bold">{lastInvoiceNumber}</span>
                  </p>
                </div>

                {/* Details Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-inner relative z-10 text-xs"
                >
                  <div className="flex justify-between items-center text-slate-400">
                    <span>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                    <span className="font-bold text-slate-200 capitalize flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {paymentMethod === 'cash' ? (
                        <>
                          <DollarSign size={12} className="text-emerald-400 animate-pulse" />
                          <span>{t.cash}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={12} className="text-indigo-400" />
                          <span>{t.card}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400 border-t border-slate-900/60 pt-2.5">
                    <span>{language === 'ar' ? 'المبلغ المطلوب' : 'Total Amount'}:</span>
                    <span className="font-bold font-mono text-slate-200">
                      {Math.round(totals.total).toLocaleString()} {t.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400 border-t border-slate-900/60 pt-2.5">
                    <span>{language === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}:</span>
                    <span className="font-bold font-mono text-slate-200">
                      {Math.round(
                        paymentMethod === 'cash'
                          ? cashReceived
                          : paymentMethod === 'split'
                            ? (cashAmount + cardAmount)
                            : totals.total
                      ).toLocaleString()} {t.currency}
                    </span>
                  </div>

                  {paymentMethod === 'cash' && changeDue > 0 && (
                    <div className="flex justify-between items-center text-rose-400 border-t border-slate-900/60 pt-2.5">
                      <span>{language === 'ar' ? 'المبلغ المتبقي للعميل' : 'Change Due'}:</span>
                      <span className="font-extrabold font-mono text-emerald-400 text-sm">
                        {Math.round(changeDue).toLocaleString()} {t.currency}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Notification Badge */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center pt-2"
                >
                  {language === 'ar' ? '✓ تم حفظ الفاتورة وتحديث المخزون بنجاح' : '✓ Invoice saved and inventory records updated successfully'}
                </motion.div>
              </div>
            ) : (
              /* INPUT FORM */
              <div className="p-5 flex flex-col gap-4">
                
                {/* Grand Total banner */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">{t.total} / المجموع المطلوب:</span>
                  <span className="text-2xl font-black text-teal-400 font-mono">
                    {Math.round(totals.total).toLocaleString()} {t.currency}
                  </span>
                </div>

                 {/* Payment Method tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setPaymentMethod('cash'); setCashReceived(totals.total); }}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                      paymentMethod === 'cash'
                        ? 'bg-teal-500/15 border-teal-500/40 text-teal-400 glow-teal'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <DollarSign size={16} />
                    <span>{t.cash}</span>
                  </button>
                  <button
                    onClick={() => { setPaymentMethod('card'); setCashReceived(totals.total); }}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>{t.card}</span>
                  </button>
                </div>
 
                 {/* Payment values layout depending on method */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-4">
                  {paymentMethod === 'cash' && (
                    <div className="py-4 text-center text-xs text-slate-400 leading-relaxed bg-slate-800/40 rounded border border-slate-800">
                      {language === 'ar' 
                        ? 'الدفع نقداً، يرجى تأكيد استلام المبلغ بالكامل.' 
                        : 'Cash payment. Please confirm receipt of the exact amount.'}
                    </div>
                  )}
 
                   {paymentMethod === 'card' && (
                    <div className="py-4 text-center text-xs text-slate-400 leading-relaxed bg-slate-800/40 rounded border border-slate-800">
                      {language === 'ar' 
                        ? 'يرجى تمرير بطاقة العميل على جهاز الشبكة المصرفي قبل التأكيد.' 
                        : 'Please process the card swipe on the external bank terminal before confirming.'}
                    </div>
                  )}
                </div>

                {/* Confirm actions */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={paymentMethod === 'cash' && cashReceived < totals.total}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-teal-400 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none hover-scale glow-teal"
                  >
                    {language === 'ar' ? 'تأكيد ودفع وطباعة' : 'Confirm & Print'}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Flying Items Overlay */}
      <AnimatePresence>
        {flyingItems.map((item) => {
          const targetEl = document.getElementById('cart-target-icon');
          const targetRect = targetEl?.getBoundingClientRect();
          const endX = targetRect ? (targetRect.left + targetRect.width / 2) : (window.innerWidth - 200);
          const endY = targetRect ? (targetRect.top + targetRect.height / 2) : 80;

          return (
            <motion.div
              key={item.id}
              initial={{ 
                x: item.startX - 64, 
                y: item.startY - 40, 
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              animate={{ 
                x: endX - 16, 
                y: endY - 16,
                scale: 0.15,
                rotate: 360,
                opacity: 0.4,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 120,
                damping: 14,
                mass: 0.8
              }}
              onAnimationComplete={() => {
                setFlyingItems((prev) => prev.filter((f) => f.id !== item.id));
              }}
              className="fixed top-0 left-0 pointer-events-none z-[9999] w-32 h-20 bg-pink-600/90 border border-pink-400 text-white rounded-2xl flex flex-col justify-between p-2 shadow-2xl backdrop-blur-md"
            >
              <div className="text-[10px] font-black truncate leading-tight">
                {item.name}
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono font-bold">
                  {Math.round(item.price).toLocaleString()}
                </span>
                <span className="text-[8px] bg-white/20 px-1 py-0.5 rounded font-black text-pink-200">
                  +1
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

    </motion.div>
  );
};
