import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useMotivationalStore } from '../store/motivationalStore';
import { translations } from '../utils/translations';
import { AdminPinModal } from '../components/AdminPinModal';
import { PriceEditModal } from '../components/PriceEditModal';
import { GeneralDiscountModal } from '../components/GeneralDiscountModal';
import { ProductFormModal } from '../components/ProductFormModal';
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
  Pencil,
  Image,
  Camera,
  Edit3,
  List,
  X
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

  // Edit/Delete Product State
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showImages, setShowImages] = useState(() => {
    return localStorage.getItem('pos_show_images') !== 'false';
  });

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

  const handleDeleteProduct = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      language === 'ar' 
        ? `هل أنت متأكد من حذف ${product.nameAr} نهائياً؟` 
        : `Are you sure you want to delete ${product.nameEn}?`
    );
    if (!confirmDelete) return;

    try {
      const success = await window.api.deleteProduct(product.id);
      if (success) {
        loadData();
      } else {
        alert(t.error);
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const handleEditProduct = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Motivational Store selectors & hooks
  const { activeNotification, queue, popNotification, clearActive } = useMotivationalStore();
  const isSaleActive = isCartOpen || items.length > 0 || isCheckoutOpen;

  // Initialize session and start hourly check timer
  useEffect(() => {
    const { initSession, checkHourlyTrigger } = useMotivationalStore.getState();
    initSession();

    const interval = setInterval(() => {
      checkHourlyTrigger();
    }, 10000); // check hourly trigger every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset session when user logs out
  useEffect(() => {
    if (!user) {
      useMotivationalStore.getState().resetSession();
    }
  }, [user]);

  // Queue check: pop if no active sale and queue has items
  useEffect(() => {
    if (!isSaleActive && queue.length > 0 && !activeNotification) {
      popNotification();
    }
  }, [isSaleActive, queue.length, activeNotification]);

  // Auto-dismiss current active notification after 6 seconds
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        clearActive();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

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
      // While the user is typing in any editable field, never intercept keys.
      // This prevents the barcode buffer from swallowing keystrokes and from
      // calling preventDefault() on Enter (which used to block form submits and
      // make inputs feel "frozen").
      const activeEl = document.activeElement as HTMLElement | null;
      const isEditable =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT' ||
        activeEl?.isContentEditable === true;

      if (isEditable) {
        barcodeBuffer.current = '';
        return;
      }

      // Allow capturing barcode scan globally (HID wedge scanners type very fast)
      const now = Date.now();

      // Reset buffer on a long gap (human typing); keep it for fast HID scans
      if (now - lastKeyTime.current > 50) {
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
              setIsCartOpen(true);
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

      // Record sale for motivational triggers
      useMotivationalStore.getState().recordSale(totals.total);

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

  const handleApplyGeneralDiscount = (val: number, type: 'percent' | 'flat') => {
    setGlobalDiscount(val, type);
    setIsDiscountModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden bg-[#eef2f8]"
    >

      {/* LEFT AREA: Product Selection Catalog & search */}
      <div className="flex-1 flex flex-col h-full border-r border-[#e3e9f1] p-4 gap-4 overflow-hidden">

        {/* Top bar: Search query and category filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.scanBarcode}
              className="w-full bg-[#fbfcfe] border border-[#e3e9f1] focus:border-[#2563eb] text-[#18212f] pl-11 pr-4 py-3 rounded-xl text-sm transition-all outline-none focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] placeholder:text-[#94a3b8]"
            />
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-[#94a3b8] ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
          </div>

          <button
            onClick={loadData}
            className="px-4 h-12 rounded-xl border border-[#e3e9f1] bg-[#fbfcfe] text-[#64748b] hover:border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-all active:scale-[0.98]"
          >
            <RefreshCw size={16} />
          </button>
          
          {/* Cart Trigger Button */}
          <button
            id="cart-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative px-5 h-12 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold shrink-0"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">{language === 'ar' ? 'السلة' : 'Cart'}</span>
            {totals.itemCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totals.itemCount}
                className="absolute -top-2 -right-2 bg-[#2563eb] text-white text-[10px] font-black w-6 h-6 rounded-md flex items-center justify-center border-2 border-white shadow-[0_4px_10px_rgba(37,99,235,0.35)]"
              >
                {totals.itemCount}
              </motion.div>
            )}
          </button>
        </div>

        {/* Category horizontal scrolling tabs */}
        <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 shrink-0 rounded-lg border border-[#cfd8e6] bg-[#fbfcfe] p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-md text-[11px] font-black whitespace-nowrap transition-all duration-150 active:scale-[0.98] ${
                selectedCategory === cat
                  ? 'bg-[#0b1a33] text-white shadow-sm'
                  : 'text-[#64748b] hover:bg-[#f4f7fb] hover:text-[#18212f]'
              }`}
            >
              {cat === 'All' ? t.categoryAll : cat}
            </button>
          ))}
        </div>

        {/* Product quick-keys grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pl-1 pt-3">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#94a3b8] text-sm">
              {language === 'ar' ? 'لا توجد منتجات مطابقة للبحث' : 'No products found.'}
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-md border border-[#cfd8e6] bg-[#fbfcfe] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#18212f]">
                  <span className="h-2 w-2 rounded-sm bg-[#2563eb]" />
                  {selectedCategory === 'All' ? t.categoryAll : selectedCategory}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border border-[#cfd8e6] bg-[#f4f7fb] p-0.5">
                    <button 
                      onClick={() => {
                        setShowImages(true);
                        localStorage.setItem('pos_show_images', 'true');
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                        showImages 
                          ? 'bg-[#0b1a33] text-white shadow-sm' 
                          : 'text-[#64748b] hover:text-[#18212f]'
                      }`}
                    >
                      <Camera size={13} />
                      {language === 'ar' ? 'مع صور' : 'With Image'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowImages(false);
                        localStorage.setItem('pos_show_images', 'false');
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold transition-all ${
                        !showImages 
                          ? 'bg-[#0b1a33] text-white shadow-sm' 
                          : 'text-[#64748b] hover:text-[#18212f]'
                      }`}
                    >
                      <List size={13} />
                      {language === 'ar' ? 'بدون صور' : 'No Image'}
                    </button>
                  </div>
                  <div className="rounded-md border border-[#cfd8e6] bg-[#fbfcfe] px-3 py-1.5 text-[11px] font-bold text-[#64748b]">
                    {filteredProducts.length} {language === 'ar' ? 'منتج' : 'Products'}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.slice(0, 50).map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = !isOutOfStock && p.stock <= (p.minStock ?? 5);
                  const productName = language === 'ar' ? p.nameAr : language === 'ku' ? (p.nameKu || p.nameAr) : p.nameEn;
                  const accentColor = p.color || '#2563eb';
                  
                  return (
                    <motion.div
                      key={p.id}
                      id={`product-card-${p.id}`}
                      className={`group relative flex flex-col overflow-hidden rounded-lg border bg-[#fbfcfe] transition-all duration-150 ${
                        isOutOfStock
                          ? 'border-[#e3e9f1] opacity-55'
                          : 'border-[#cfd8e6] hover:border-[#2563eb] hover:shadow-[0_10px_24px_rgba(16,24,40,0.12)]'
                      }`}
                      whileTap={isOutOfStock ? {} : { scale: 0.985 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div
                        className="h-1.5 w-full shrink-0"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="absolute top-2.5 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 end-2">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd8e6] bg-[#fbfcfe] text-[#64748b] shadow-sm transition-colors hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb]"
                          onClick={(e) => handleEditProduct(p, e)}
                          title={t.edit}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd8e6] bg-[#fbfcfe] text-[#64748b] shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                          onClick={(e) => handleDeleteProduct(p, e)}
                          title={t.delete}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div
                        className={`flex flex-1 flex-col p-3 pt-2.5 ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={(e) => {
                          if (!isOutOfStock) {
                            addItem(p);
                            triggerFlyToCart(p, e);
                            setIsCartOpen(true);
                          }
                        }}
                      >
                        {showImages && (
                          <div className="relative mb-2.5 aspect-[4/3] w-full overflow-hidden rounded-md border border-[#d0d9e4] bg-[#eef2f8]">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={productName}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-[#94a3b8]">
                                <Camera strokeWidth={1.5} className="mb-1 h-6 w-6 text-[#cbd5e1]" />
                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                  {language === 'ar' ? 'بدون صورة' : 'No Image'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="truncate font-mono text-[10px] font-bold tracking-wide text-[#94a3b8]">
                            {p.sku || p.barcode || '---'}
                          </span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-black ${
                              isOutOfStock
                                ? 'bg-rose-600 text-white'
                                : isLowStock
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </div>

                        <h3
                          className="mb-3 min-h-[2.4rem] line-clamp-2 text-[13px] font-extrabold leading-snug text-[#18212f]"
                          title={productName}
                        >
                          {productName}
                        </h3>

                        <div className="mt-auto rounded-md bg-[#0b1a33] px-3 py-2.5">
                          <div className="flex items-end justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                              {t.currency}
                            </span>
                            <span className="font-mono text-base font-black tracking-tight text-white">
                              {Math.round(p.price).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {(isOutOfStock || isLowStock) && (
                          <div className="mt-2 text-center">
                            <span
                              className={`text-[9px] font-black uppercase tracking-[0.12em] ${
                                isOutOfStock ? 'text-rose-600' : 'text-amber-600'
                              }`}
                            >
                              {isOutOfStock
                                ? language === 'ar'
                                  ? 'نفذ من المخزون'
                                  : 'Out of Stock'
                                : language === 'ar'
                                  ? 'مخزون منخفض'
                                  : 'Low Stock'}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {filteredProducts.length > 50 && (
                <div className="text-center mt-4 text-[#94a3b8] text-sm font-medium">
                  {language === 'ar' ? `يتم عرض أول 50 نتيجة من أصل ${filteredProducts.length}. يرجى تحسين البحث لرؤية المزيد.` : `Showing top 50 results out of ${filteredProducts.length}. Please refine your search.`}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Cart Sidebar Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/50 z-[60]"
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* RIGHT AREA: Cart Register Ledger (Sliding Sidebar) */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 bottom-0 right-0 w-full sm:w-[420px] shrink-0 flex flex-col justify-between h-full bg-[#fbfcfe] border-l border-[#e3e9f1] p-4 gap-4 overflow-hidden shadow-[-8px_0_40px_rgba(15,23,42,0.12)] z-[70]"
          >

            {/* Cart Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#e3e9f1] shrink-0">
              {/* Close X button on the left */}
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f7fb] border border-[#e3e9f1] text-[#64748b] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors"
              >
                <X size={18} />
              </button>

              {/* Title "سلة المبيعات" on the right with item count badge in blue */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#2563eb] text-white">
                  {totals.itemCount}
                </span>
                <span className="text-base font-bold text-[#18212f]">
                  {language === 'ar' ? 'سلة المبيعات' : (language === 'ku' ? 'سەبەتەی فرۆشتن' : 'Sales Cart')}
                </span>
              </div>
            </div>

            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-0.5 pl-0.5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#64748b] text-xs gap-3">
                  <div className="w-20 h-20 rounded-full bg-[#eff6ff] flex items-center justify-center mb-2">
                    <ShoppingBag size={32} className="text-[#2563eb]" />
                  </div>
                  <span className="font-bold text-base text-[#18212f]">{language === 'ar' ? 'لا توجد منتجات بعد' : 'No items yet'}</span>
                  <span className="text-[#94a3b8]">{t.cartIsEmpty}</span>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="relative bg-[#fbfcfe] border border-[#e3e9f1] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                    >
                      {/* Top Row: Delete button on top left, Price badge on top right */}
                      <div className="flex justify-between items-center w-full">
                        {/* Delete button (trash icon) top left in red */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#fff1f2] hover:bg-[#dc2626] text-[#dc2626] hover:text-white transition-all border border-rose-200"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Price badge on the top right with lock icon if price is overridden */}
                        <button
                          onClick={() => requestPriceEdit(item)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f4f7fb] border border-[#e3e9f1] hover:border-[#bfdbfe] text-xs font-bold text-[#18212f] transition-all"
                          title={isAdmin ? 'تعديل السعر' : 'يتطلب صلاحية مشرف'}
                        >
                          {item.originalPrice !== item.price && <Lock size={11} className="text-[#2563eb] shrink-0" />}
                          
                          {item.originalPrice > item.price ? (
                            <div className="flex items-center gap-1.5 flex-row-reverse">
                              <span className="line-through text-[#94a3b8] text-[10px] font-mono">{Math.round(item.originalPrice).toLocaleString()}</span>
                              <span className="text-[#2563eb] text-xs font-bold font-mono">{Math.round(item.price).toLocaleString()}</span>
                              <span className="text-[9px] bg-[#fff1f2] text-[#dc2626] px-1 rounded font-sans">
                                -{Math.round((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#18212f] text-xs font-bold font-mono">
                              {Math.round(item.price).toLocaleString()} <span className="text-[10px] text-[#94a3b8] font-normal">{t.currency}</span>
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Middle Row: Product name bold and clear, SKU below in muted blue monospace */}
                      <div className={`flex flex-col gap-1 w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <span className="text-sm font-bold text-[#18212f] tracking-wide line-clamp-2 leading-snug">
                          {language === 'ar' ? item.nameAr : language === 'ku' ? (item.nameKu || item.nameAr) : item.nameEn}
                        </span>
                        <span className="text-xs font-mono text-[#2563eb]/80 font-medium tracking-wide">
                          {item.sku || item.barcode || '---'}
                        </span>
                      </div>

                      {/* Bottom Row: Quantity Controls & Final Item Total */}
                      <div className="flex justify-between items-center w-full mt-1">
                        {/* Quantity controls (minus / number / plus) as rounded buttons at the bottom left — blue outline style */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all flex items-center justify-center bg-transparent active:scale-90"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          
                          <motion.span
                            key={item.quantity}
                            animate={{ scale: [1, 1.25, 1] }}
                            transition={{ duration: 0.2 }}
                            className="w-8 text-center text-xs font-bold text-[#18212f] font-mono"
                          >
                            {item.quantity}
                          </motion.span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all flex items-center justify-center bg-transparent active:scale-90"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Final Item Total */}
                        <div className={`flex flex-col ${dir === 'rtl' ? 'items-start text-left' : 'items-end text-right'}`}>
                          <span className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wider mb-0.5">
                            {language === 'ar' ? 'المجموع' : 'Total'}
                          </span>
                          <span className="text-sm font-extrabold text-[#2563eb] font-mono leading-none tracking-tight">
                            {Math.round((item.price * item.quantity) - item.discount).toLocaleString()} <span className="text-[10px] text-[#94a3b8] font-sans">{t.currency}</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Calculations and Actions Footer */}
            <div className="bg-[#fbfcfe] border-t border-[#e3e9f1] pt-4 pb-2 flex flex-col gap-4 shrink-0 relative">
              {/* Discount triggers */}
              <div className="flex gap-2 relative z-10 w-full">
                {/* تفريغ السلة (red outline) */}
                <button
                  onClick={clearCart}
                  className="flex-1 h-10 rounded-xl border border-rose-200 text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 bg-[#fbfcfe]"
                >
                  <Trash2 size={13} />
                  <span>{language === 'ar' ? 'تفريغ السلة' : (language === 'ku' ? 'خاڵیکردنی سەبەتە' : 'Clear Cart')}</span>
                </button>

                {/* الخصم العام % (light outline) */}
                <button
                  onClick={() => {
                    if (isAdmin) {
                      setIsDiscountModalOpen(true);
                    } else {
                      setDiscountPinError('');
                      setIsDiscountPinModalOpen(true);
                    }
                  }}
                  className="flex-1 h-10 rounded-xl bg-[#fbfcfe] hover:bg-[#eff6ff] border border-[#e3e9f1] hover:border-[#bfdbfe] text-[#334155] hover:text-[#2563eb] text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Percent size={13} className="text-[#2563eb]" />
                  <span>
                    {language === 'ar' ? 'الخصم العام %' : (language === 'ku' ? 'داشکاندنی گشتی %' : 'General Discount %')}{' '}
                    {globalDiscount > 0
                      ? globalDiscountType === 'percent'
                        ? `(${globalDiscount}%)`
                        : `(${globalDiscount.toLocaleString()} ${t.currency})`
                      : ''}
                  </span>
                </button>
              </div>

              {/* Summary card with solid background showing المجموع قبل الخصم and المجموع النهائي clearly */}
              <div className="bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-4 space-y-3 relative z-10">
                <div className="flex justify-between items-center text-xs text-[#334155] font-sans">
                  <span className="font-bold">{language === 'ar' ? 'المجموع قبل الخصم' : (language === 'ku' ? 'کۆی گشتی پێش داشکاندن' : 'Subtotal before discount')}:</span>
                  <span className="font-mono text-[#18212f] font-bold">{Math.round(totals.subtotal).toLocaleString()} {t.currency}</span>
                </div>

                {totals.itemsDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-[#dc2626] font-sans">
                    <span className="font-bold">{t.itemsDiscount}:</span>
                    <span className="font-mono font-bold">-{Math.round(totals.itemsDiscountAmount).toLocaleString()} {t.currency}</span>
                  </div>
                )}

                {totals.globalDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-[#dc2626] font-sans">
                    <span className="font-bold">
                      {language === 'ar' ? 'الخصم العام' : (language === 'ku' ? 'داشکاندنی گشتی' : 'General Discount')} {globalDiscountType === 'percent' ? `(${globalDiscount}%)` : `(${t.currency})`}:
                    </span>
                    <span className="font-mono font-bold">-{Math.round(totals.globalDiscountAmount).toLocaleString()} {t.currency}</span>
                  </div>
                )}

                <div className="border-t border-[#e3e9f1] pt-2.5 flex justify-between items-baseline">
                  <span className="text-[#334155] font-bold text-xs font-sans">{language === 'ar' ? 'المجموع النهائي' : (language === 'ku' ? 'کۆی کۆتایی' : 'Total')}:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#18212f] text-2xl font-extrabold font-mono leading-none tracking-tight">
                      {Math.round(totals.total).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#2563eb] font-bold font-sans">{t.currency}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={openCheckoutModal}
                disabled={items.length === 0}
                className="w-full py-4 rounded-xl font-extrabold text-sm relative z-10 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none bg-[#2563eb] text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] hover:bg-[#1d4ed8] active:translate-y-px disabled:bg-[#cbd5e1] disabled:shadow-none"
              >
                <ShoppingBag size={18} />
                <span>{language === 'ar' ? 'دفع وإنهاء الفاتورة' : (language === 'ku' ? 'دان و تەواوکردنی پسوڵە' : 'Pay & Complete Sale')}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOMER SEARCH MODAL DIALOG */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4">
          <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-md flex flex-col max-h-[500px] overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-[#e3e9f1] flex justify-between items-center">
              <h3 className="font-bold text-[#18212f]">{t.customers}</h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#18212f]"
              >
                ✕
              </button>
            </div>
            {/* Search customer input */}
            <div className="p-3 border-b border-[#e8edf4] shrink-0">
              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full bg-[#fbfcfe] border border-[#e3e9f1] text-[#18212f] px-3 py-2 rounded-xl text-xs focus:border-[#2563eb] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.12)] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-[#94a3b8] text-xs">{language === 'ar' ? 'لا يوجد عملاء بهذا الاسم' : 'No matches'}</div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCustomer(c);
                      setIsCustomerModalOpen(false);
                    }}
                    className="w-full text-right p-3 rounded-xl bg-[#fbfcfe] border border-[#e3e9f1] hover:border-[#bfdbfe] hover:bg-[#eff6ff] flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="font-bold text-[#18212f]">{c.name}</span>
                      <span className="text-[10px] text-[#94a3b8] font-mono mt-0.5">{c.phone || 'No phone'}</span>
                    </div>
                    <span className="text-[#2563eb] font-semibold font-mono bg-[#eff6ff] px-2 py-1 rounded">
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
        <div className="fixed inset-0 glass z-[100] flex items-center justify-center p-4">
          <div className="bg-[#fbfcfe] rounded-2xl border border-[#e3e9f1] shadow-[0_24px_60px_rgba(15,23,42,0.12)] w-full max-w-lg flex flex-col overflow-hidden animate-fade-in">

            {/* Header */}
            <div className="p-4 border-b border-[#e3e9f1] flex justify-between items-center bg-[#fbfcfe]">
              <h3 className="font-extrabold text-[#18212f] text-sm flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-[#2563eb]" />
                <span>{t.checkout}</span>
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-[#94a3b8] hover:text-[#18212f]"
                disabled={checkoutSuccess}
              >
                ✕
              </button>
            </div>

            {checkoutSuccess ? (
              /* PREMIUM SUCCESS SCREEN */
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-[#fbfcfe]">
                {/* Animated checkmark container */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Main checkmark bubble */}
                  <div className="relative w-16 h-16 rounded-2xl bg-[#ecfdf5] border border-emerald-200 flex items-center justify-center">
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
                      className="text-[#10b981]"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </div>
                </motion.div>

                <div className="space-y-1 relative z-10">
                  <h4 className="text-xl font-extrabold text-[#18212f] tracking-wide uppercase">
                    {language === 'ar' ? 'تمت العملية بنجاح' : t.saleCompleted}
                  </h4>
                  <p className="text-xs text-[#64748b] font-mono tracking-widest uppercase">
                    {language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}: <span className="text-[#2563eb] font-bold">{lastInvoiceNumber}</span>
                  </p>
                </div>

                {/* Details Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-[#f4f7fb] border border-[#e3e9f1] rounded-xl p-4 space-y-3 relative z-10 text-xs"
                >
                  <div className="flex justify-between items-center text-[#64748b]">
                    <span>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                    <span className="font-bold text-[#18212f] capitalize flex items-center gap-1.5 bg-[#fbfcfe] px-2.5 py-1 rounded-lg border border-[#e3e9f1]">
                      {paymentMethod === 'cash' ? (
                        <>
                          <DollarSign size={12} className="text-[#2563eb]" />
                          <span>{t.cash}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={12} className="text-[#2563eb]" />
                          <span>{t.card}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#64748b] border-t border-[#e3e9f1] pt-2.5">
                    <span>{language === 'ar' ? 'المبلغ المطلوب' : 'Total Amount'}:</span>
                    <span className="font-bold font-mono text-[#18212f]">
                      {Math.round(totals.total).toLocaleString()} {t.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#64748b] border-t border-[#e3e9f1] pt-2.5">
                    <span>{language === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}:</span>
                    <span className="font-bold font-mono text-[#18212f]">
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
                    <div className="flex justify-between items-center text-[#dc2626] border-t border-[#e3e9f1] pt-2.5">
                      <span>{language === 'ar' ? 'المبلغ المتبقي للعميل' : 'Change Due'}:</span>
                      <span className="font-extrabold font-mono text-[#2563eb] text-sm">
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
                  className="w-full text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider text-center pt-2"
                >
                  {language === 'ar' ? '✓ تم حفظ الفاتورة وتحديث المخزون بنجاح' : '✓ Invoice saved and inventory records updated successfully'}
                </motion.div>
              </div>
            ) : (
              /* INPUT FORM */
              <div className="p-5 flex flex-col gap-4">

                {/* Grand Total banner */}
                <div className="bg-[#f4f7fb] p-4 rounded-xl border border-[#e3e9f1] flex justify-between items-center">
                  <span className="text-xs text-[#64748b] font-bold">{t.total} / المجموع المطلوب:</span>
                  <span className="text-2xl font-extrabold text-[#18212f] font-mono tracking-tight">
                    {Math.round(totals.total).toLocaleString()} {t.currency}
                  </span>
                </div>

                {/* Payment Method tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setPaymentMethod('cash'); setCashReceived(totals.total); }}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 active:scale-95 ${paymentMethod === 'cash'
                        ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]'
                        : 'bg-[#fbfcfe] border-[#e3e9f1] text-[#64748b] hover:text-[#18212f]'
                      }`}
                  >
                    <DollarSign size={16} />
                    <span>{t.cash}</span>
                  </button>
                  <button
                    onClick={() => { setPaymentMethod('card'); setCashReceived(totals.total); }}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 active:scale-95 ${paymentMethod === 'card'
                        ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#2563eb]'
                        : 'bg-[#fbfcfe] border-[#e3e9f1] text-[#64748b] hover:text-[#18212f]'
                      }`}
                  >
                    <CreditCard size={16} />
                    <span>{t.card}</span>
                  </button>
                </div>

                {/* Payment values layout depending on method */}
                <div className="bg-[#f4f7fb] p-4 rounded-xl border border-[#e3e9f1] space-y-4">
                  {paymentMethod === 'cash' && (
                    <div className="py-4 text-center text-xs text-[#64748b] leading-relaxed bg-[#fbfcfe] rounded-lg border border-[#e3e9f1]">
                      {language === 'ar'
                        ? 'الدفع نقداً، يرجى تأكيد استلام المبلغ بالكامل.'
                        : 'Cash payment. Please confirm receipt of the exact amount.'}
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="py-4 text-center text-xs text-[#64748b] leading-relaxed bg-[#fbfcfe] rounded-lg border border-[#e3e9f1]">
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
                    className="flex-1 bg-[#fbfcfe] hover:bg-[#f4f7fb] border border-[#e3e9f1] text-[#64748b] py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={paymentMethod === 'cash' && cashReceived < totals.total}
                    className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-[0_8px_20px_rgba(37,99,235,0.24)] active:translate-y-px disabled:bg-[#cbd5e1] disabled:shadow-none disabled:pointer-events-none"
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
          const targetEl = isCartOpen ? document.getElementById('cart-target-icon') : document.getElementById('cart-trigger-btn');
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
              className="fixed top-0 left-0 pointer-events-none z-[9999] w-32 h-20 bg-[#2563eb] border border-[#1d4ed8] text-white rounded-xl flex flex-col justify-between p-2 shadow-[0_8px_20px_rgba(37,99,235,0.35)]"
            >
              <div className="text-[10px] font-black truncate leading-tight">
                {item.name}
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono font-bold">
                  {Math.round(item.price).toLocaleString()}
                </span>
                <span className="text-[8px] bg-white/20 px-1 py-0.5 rounded font-black text-white">
                  +1
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <ProductFormModal
        isOpen={isProductModalOpen}
        product={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={loadData}
      />

      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ y: -120, opacity: 0, scale: 0.9, x: '-50%' }}
            animate={{ y: 0, opacity: 1, scale: 1, x: '-50%' }}
            exit={{ y: -120, opacity: 0, scale: 0.9, x: '-50%' }}
            transition={{ type: 'spring', damping: 18, stiffness: 120 }}
            className="fixed top-6 left-1/2 z-[9999] w-full max-w-sm bg-[#fbfcfe] border border-[#e3e9f1] rounded-2xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] p-4 select-none text-right"
            dir="rtl"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl shrink-0 leading-none mt-1 animate-bounce select-none">
                {activeNotification.emoji}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <p className="text-sm font-extrabold text-[#18212f] leading-relaxed text-right">
                  {activeNotification.message}
                </p>
                {/* Progress bar */}
                <div className="h-1 bg-[#e8edf4] rounded-full overflow-hidden w-full">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: 0 }}
                    transition={{ duration: 6, ease: 'linear' }}
                    className="h-full bg-[#2563eb]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearActive}
                className="px-3.5 py-1.5 rounded-md bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border border-[#bfdbfe] text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              >
                <span>😄 استمر!</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
