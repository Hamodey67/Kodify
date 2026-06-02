import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../utils/translations';
import { AdminPinModal } from '../components/AdminPinModal';
import { PriceEditModal } from '../components/PriceEditModal';
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
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
  
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
    const storePhone = getSetting('store_phone', '0750 101 0964');
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
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pl-1">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-300/60 text-sm">
              {language === 'ar' ? 'لا توجد منتجات مطابقة للبحث' : 'No products found.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 pb-4">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => addItem(p)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden glass-card border border-white/8 hover:border-indigo-400/25 p-3.5 rounded-2xl flex flex-col justify-between h-36 text-right transition-all duration-300 hover:shadow-glow-indigo group"
                  >
                    {/* Top status indicator: Stock and Category */}
                    <div className="flex justify-between items-center w-full shrink-0">
                      <span className="text-[9px] font-extrabold text-slate-200/70 bg-white/4 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider group-hover:text-cyan-200 transition-colors">
                        {p.category}
                      </span>
                      {/* Live stock indicator dot */}
                      <span className={`w-2 h-2 rounded-full ${
                        isOutOfStock 
                          ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                          : p.stock <= 5 
                            ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      }`} title={`Stock: ${p.stock}`} />
                    </div>

                    {/* Product Name */}
                    <div className={`mt-2 flex flex-col ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <span className="text-slate-100 text-xs font-black tracking-wide group-hover:text-teal-400 transition-colors line-clamp-2">
                        {language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-wider mt-1 truncate">
                        {p.barcode || p.sku}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="flex justify-end items-center border-t border-white/6 pt-2 mt-2 w-full shrink-0">
                      <span className="text-cyan-200 font-black font-mono text-xs tracking-wide">
                        {Math.round(p.price).toLocaleString()} <span className="text-[9px] font-sans font-normal text-slate-500">{t.currency}</span>
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT AREA: Cart Register Ledger */}
      <div className="w-full xl:w-[420px] shrink-0 flex flex-col justify-between h-full border-l border-white/5 p-4 gap-4 overflow-hidden">
        
        {/* Cart Header */}
        <div className="glass-card border border-white/8 px-4 py-3 rounded-2xl flex justify-between items-center shrink-0 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 flex items-center justify-center shadow-glow-cyan">
              <ShoppingBag size={16} />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-slate-100">{language === 'ar' ? 'سلة المبيعات' : 'Sales Cart'}</span>
              <span className="text-[11px] text-slate-300/60 font-semibold">
                {items.length} {language === 'ar' ? 'أصناف مختلفة' : 'unique items'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/10 bg-white/4 text-slate-100">
            {totals.itemCount} {language === 'ar' ? 'قطعة' : 'pcs'}
          </span>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5 pl-0.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300/60 text-xs gap-2">
              <ShoppingBag size={28} className="text-slate-300/30" />
              <span>{t.cartIsEmpty}</span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card rounded-2xl border border-white/8 p-3.5 flex flex-col gap-2 hover:border-indigo-400/20 transition-all shadow-glass"
                >
                {/* Title & Remove */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-extrabold text-slate-100">
                      {language === 'ar' ? item.nameAr : language === 'ku' ? (item.nameKu || item.nameAr) : item.nameEn}
                    </span>
                    <span className="text-[11px] text-slate-300/70 font-mono mt-1">
                      <button
                        onClick={() => requestPriceEdit(item)}
                        className="inline-flex items-center gap-1.5 text-cyan-200 hover:text-cyan-100 transition-colors flex-wrap text-right"
                        title={isAdmin ? 'تعديل السعر' : 'يتطلب صلاحية مشرف'}
                      >
                        {isAdmin ? <Pencil size={12} className="shrink-0" /> : <Lock size={12} className="shrink-0" />}
                        
                        {item.originalPrice > item.price ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="line-through text-slate-500 text-[10px]">{Math.round(item.originalPrice).toLocaleString()}</span>
                            <span className="text-emerald-400 font-bold">{Math.round(item.price).toLocaleString()}</span>
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                              -{Math.round((item.originalPrice - item.price) * item.quantity).toLocaleString()} {t.currency}
                            </span>
                          </div>
                        ) : (
                          <span>{Math.round(item.price).toLocaleString()} {t.currency}</span>
                        )}
                      </button>
                    </span>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-9 h-9 rounded-xl border border-white/8 bg-white/3 glass flex items-center justify-center text-slate-200/70 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Adjuster controls */}
                <div className="flex items-center justify-between border-t border-white/6 pt-2 shrink-0">
                  {/* Quantity control */}
                  <div className="flex items-center rounded-full border border-white/10 bg-white/4 glass p-1 text-xs font-mono">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full text-slate-200/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="px-3 font-black text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full text-slate-200/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Pricing Total */}
                  <div className="text-sm font-black text-cyan-200 font-mono">
                    {Math.round((item.price * item.quantity) - item.discount).toLocaleString()} {t.currency}
                  </div>
                </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Calculations and Actions Footer */}
        <div className="glass-card rounded-2xl border border-white/8 p-4 flex flex-col gap-3 shrink-0 shadow-glass">
          
          {/* Discount triggers */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const val = prompt(language === 'ar' ? 'أدخل قيمة الخصم العام (٪)' : 'Enter general discount (%)', String(globalDiscount));
                if (val !== null) setGlobalDiscount(Number(val), 'percent');
              }}
              className="flex-1 h-10 rounded-2xl border border-white/8 bg-white/3 glass text-slate-100/80 hover:text-white hover:bg-white/6 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
            >
              <Percent size={11} />
              <span>{t.discount} {globalDiscountType === 'percent' ? `(${globalDiscount}%)` : ''}</span>
            </button>
            <button
              onClick={clearCart}
              className="h-10 px-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/14 text-rose-100 text-[11px] font-extrabold transition-all"
            >
              {t.clearCart}
            </button>
          </div>

          <div className="border-t border-white/6 my-1"></div>

          {/* Pricing breakdowns */}
          <div className="text-xs space-y-1.5 text-slate-400 font-mono">
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>{t.discount}:</span>
                <span>-{Math.round(totals.discountAmount).toLocaleString()} {t.currency}</span>
              </div>
            )}
            <div className="border-t border-white/6 pt-2 flex justify-between text-sm font-black text-slate-100">
              <span className="font-sans">{t.total}:</span>
              <span className="text-cyan-200 text-base font-mono">{Math.round(totals.total).toLocaleString()} {t.currency}</span>
            </div>
          </div>

          {/* Checkout Trigger */}
          <button
            onClick={openCheckoutModal}
            disabled={items.length === 0}
            className="w-full py-3 rounded-2xl font-black text-sm text-white border border-white/10 btn-primary btn-shimmer disabled:opacity-50 disabled:pointer-events-none transition-all"
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
              /* SUCCESS SCREEN */
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center glow-teal-strong animate-bounce">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-slate-100">{t.saleCompleted}</h4>
                <p className="text-xs text-slate-400 font-mono">Invoice Number: {lastInvoiceNumber}</p>
                <div className="text-[10px] text-slate-500 italic mt-4 bg-slate-900/40 px-3 py-1.5 rounded border border-slate-700">
                  {language === 'ar' ? 'تم حفظ الفاتورة وتحديث المخزون بنجاح' : 'Inventory records and shift balances updated'}
                </div>
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

    </motion.div>
  );
};
